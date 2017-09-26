'use strict';
angular.module('com.ylc.iPMessaging')
    .factory('debounce', function($timeout) {
        return function(callback, interval) {
            var timeout = null;
            return function() {
                $timeout.cancel(timeout);
                var args = arguments;
                timeout = $timeout(function() {
                    callback.apply(this, args);
                }, interval);
            };
        };
    })
    .controller('IPMessagingConversationCtrl', function(
        $scope,
        $stateParams,
        $timeout,
        auth,
        TwilioService,
        User,
        debounce,
        $http,
        twilio,
        FormService,
        Yumigo_API,
        FeathersEmail
    ) {

        var CURRENT_USER_ID = auth.uid;
        var CHANNEL_ID = $stateParams.channelId;

        var travellerId = CHANNEL_ID.split("@separator@")[0];
        var localId = CHANNEL_ID.split("@separator@")[1];
        var travellerObj = User(travellerId);
        var localObj = User(localId);

        $scope.userId = auth.uid;

        var tc = {};
        tc.userId = CURRENT_USER_ID;
        var MESSAGES_HISTORY_LIMIT = 50;

        // TODO: Fetch the userId from Firebase and pass it here
        // connectClientWithUserId(CURRENT_USER_ID);

        function connectClientWithUserId(userId) {
            tc.userId = userId;
            fetchAccessToken(tc.userId, connectMessagingClient);
        }

        // Fetch the access token for further communication with twilio
        // Using the common Twilio service
        function fetchAccessToken(userId, handler) {
            var twilioClientPromise = TwilioService.getAccessToken(userId);
            twilioClientPromise.then(function(tokenResponse) {
                handler(tokenResponse);
            })
        }

        // Connect and initialize the messaging client with the token from the feathers server
        function connectMessagingClient(tokenResponse) {
            // Initialize the IP messaging client
            tc.accessManager = new Twilio.AccessManager(tokenResponse.token);
            tc.messagingClient = new Twilio.IPMessaging.Client(tc.accessManager);

            // load with the list of channels that the user is part of
            tc.getChannel(CHANNEL_ID);

            tc.messagingClient.on('tokenExpired', refreshToken);
        }

        tc.getChannel = function(channelId) {
            if (tc.messagingClient === undefined) {
                console.log('Client is not initialized');
                return;
            }

            tc.messagingClient.getChannelByUniqueName(channelId).then(function(channel) {
                if (!channel || channel == undefined) {
                    console.log('No such channel found');

                    if (travellerId == CURRENT_USER_ID) {
                        // SInce no channel is found I will be making a new channel here
                        tc.createChannel(channelId);
                        return;
                    }

                    alert('Only travelers can create the messaging channel.')

                }

                tc.currentChannel = channel;
                // deleteCurrentChannel();
                // tc.setUpChannel();
                tc.joinChannel(channel);
            });
        };

        function deleteCurrentChannel() {
            if (!tc.currentChannel) {
                console.log('nothing configed')
                return;
            }
            tc.currentChannel.delete().then(function(channel) {
                console.log('channel: ' + channel.friendlyName + ' deleted');
            });
        }


        // This creates the channel with the unique name
        tc.createChannel = function(uniqueName) {
            console.log('Attempting to create the new channel....');
            if (!tc.currentChannel) {
                // If it doesn't exist, let's create it
                tc.messagingClient.createChannel({
                    uniqueName: uniqueName,
                    friendlyName: 'Private Chat Channel',
                    attributes: {
                        localId: localId,
                        travellerId: travellerId,
                        localName: localObj.getFullName(),
                        localProfilePhoto: localObj.getUserProfilePhoto(),
                        travellerName: travellerObj.getFullName(),
                        travellerProfilePhoto: travellerObj.getUserProfilePhoto(),
                        localEmail: localObj.getUserEmail(),
                        travellerEmail: travellerObj.getUserEmail()
                    },
                    isPrivate: true
                }).then(function(channel) {
                    tc.inviteMember(channel, localId);
                    tc.joinChannel(channel);
                });
            } else {
                console.log('Found channel already:');
            }
        };

        tc.inviteMember = function(channel, memberId) {
            if (!memberId || memberId == "") {
                console.log('No memberId Specified!');
                return;
            }
            channel.invite(memberId).then(function() {
                console.log('Your friend has been invited!');
            }).catch(function(error) {
                console.log('some error in inviting member');
                $http({
                    method: 'POST',
                    // url: 'http://localhost:3030/ipmessagings/',
                    url: Yumigo_API + 'ipmessagings/',
                    data: {
                        identity: memberId
                    }
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('success creating user');
                    console.log('retrying inviting user');
                    setTimeout(function() {
                        tc.inviteMember(channel, memberId);
                    }, 4000);

                }, function errorCallback(response) {
                    console.log('error');
                    console.log(response);
                });
            });
        };

        tc.joinChannel = function(channel) {
            channel.join().then(function(joinedChannel) {
                console.log('Joined channel ' + joinedChannel);

                tc.currentChannel = channel;
                tc.setUpChannel();

                tc.currentChannel.on('messageAdded', updateChannel);
                tc.currentChannel.on('typingStarted', showTypingStarted);
                tc.currentChannel.on('typingEnded', hideTypingStarted);

            }).catch(function(error) {
                console.log('some error in joining channel');
                console.log(error);
            });
        };

        // registers all the events to the channel
        tc.setUpChannel = function() {
            if (!tc.currentChannel) {
                console.log('No channel has been setup.');
                return;
            }

            tc.loadMessages();
            $scope.channel = tc.currentChannel;
            tc.currentChannel.on('messageAdded', updateChannel);
            tc.currentChannel.on('typingStarted', showTypingStarted);
            tc.currentChannel.on('typingEnded', hideTypingStarted);
        };

        // Update the lastUpdate property which will be used to sort the conversations
        // in descending order of the lastUpdate
        function updateChannel() {
            tc.loadMessages();
            updateLastUpdate();
        }

        function updateLastUpdate() {
            if (tc.currentChannel == null) {
                console.log('Current channel not setup yet');
                return;
            }

            var currentAttributes = tc.currentChannel.attributes;
            currentAttributes.lastUpdate = Date.now();
            tc.currentChannel.updateAttributes(currentAttributes).then(function(something) {
                console.log(something);
                console.log('i think it is a success');
            }).catch(function(err) {
                console.log(err);
            });
        }

        $scope.sendMessage = function(messageType) {
            var message = $scope.message.trim();
            if (message == "") {
                console.log('Are you really going to send that? I mean seriously?')
            } else {
                if (!tc.currentChannel) {
                    console.log('No channel has been setup.');
                    return;
                }

                var sendMessageTo = '';
                if (CURRENT_USER_ID == localId) {
                    sendMessageTo = 'TRAVELLER';
                } else {
                    sendMessageTo = 'LOCAL';
                }
                tc.currentChannel.sendMessage(message, {
                    localId: localId,
                    travellerId: travellerId,
                    localName: localObj.getFullName(),
                    localProfilePhoto: localObj.getUserProfilePhoto(),
                    travellerName: travellerObj.getFullName(),
                    travellerProfilePhoto: travellerObj.getUserProfilePhoto(),
                    localEmail: localObj.getUserEmail(),
                    travellerEmail: travellerObj.getUserEmail(),
                    sendMessageTo: sendMessageTo,
                    messageType: messageType
                });

                updateChannel();

                var emailMessage = '';
                if (messageType == 'attachment') {
                    emailMessage = 'You have recieved a file as an attachment'
                } else {
                    emailMessage = $scope.message;
                }

                var sendEmailTo = '';
                var userIsAYumigoTraveler = false;
                if (CURRENT_USER_ID == localId) {
                    sendEmailTo = travellerObj.email;
                    if (travellerObj.userType == 'yumigo_traveler') {
                        userIsAYumigoTraveler = true;
                        sendEmailTo = travellerId;
                    }
                } else {
                    sendEmailTo = localObj.email;
                }

                sendEmail({
                    "ipMessageSentEmail": true,
                    "message": emailMessage,
                    "chatId": CHANNEL_ID,
                    "sendEmailTo": sendEmailTo,
                    "userIsAYumigoTraveler": userIsAYumigoTraveler
                }, function() {});
                $scope.message = '';
            }
        };

        function sendEmail(data, callback) {
            FeathersEmail.create(data).then(function(response) {
                callback(null, response);
            }).catch(function(error) {
                callback(error);
            })
        }

        function send_form_message(data) {
            FormService.saveForm({
                    test: 'some_rubbish_data'
                })
                .then(function(response) {
                    $scope.message = response.data.firebaseId;
                    $scope.sendMessage('form');
                }).catch(function(error) {
                    console.log(data)
                })
        }

        function send_attachment(data) {
            $scope.message = JSON.stringify(data);
            $scope.sendMessage('attachment');
        }

        $scope.formData = {};
        $scope.fetchFormData = function(formId) {
            FormService.getForm(formId).then(function(response) {
                $scope.formData[formId] = response.data;
            });
        };

        $scope.parseJson = function(stringifiedData) {
            return JSON.parse(stringifiedData)
        };

        $scope.uploadFile = function() {
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.pickAndStore({}, {
                    path: "/"
                },
                function(Blobs) {
                    send_attachment(Blobs[0]);
                },
                function(error) {
                    console.log(error)
                        // CoreService.toastError(gettextCatalog.getString('File not uploaded'),gettextCatalog.getString('File not uploaded, Please try again!'));
                }
            );
        };



        // TODO: need to find an alternative to throttle this function
        $scope.$watch('message', debounce(function(id) {
            if (tc.currentChannel == null) {
                return console.log('Current channel not setup yet.')
            }
            tc.currentChannel.typing();
        }, 1000));

        // load messages of the current channel (upto a maximum history of MESSAGES_HISTORY_LIMIT)
        tc.loadMessages = function() {
            tc.currentChannel.getMessages(MESSAGES_HISTORY_LIMIT).then(function(messages) {
                $scope.messages = messages;
                updateLastConsumedMessage();
                $scope.$apply();
                try {

                    $('#reply-section').scrollTop($('#reply-section')[0].scrollHeight);
                } catch (e) {
                    console.log(e)
                }

            });
            // var objDiv = document.getElementById("");
            // objDiv.scrollTop = objDiv.scrollHeight;
        };

        $scope.$watch('messages', function() {
            $('#reply-section').scrollTop($('#reply-section')[0].scrollHeight);
        });

        function updateLastConsumedMessage() {

            if (!tc.currentMember) {
                console.log('Current member is not set, trying to set up');
                setCurrentMember(updateLastConsumedMessage);
            } else {
                var newestMessageIndex = tc.currentChannel.messages.length ?
                    tc.currentChannel.messages[tc.currentChannel.messages.length - 1].index : 0;
                console.log(newestMessageIndex);
                tc.currentChannel.updateLastConsumedMessageIndex(newestMessageIndex)
            }
        }

        function setCurrentMember(handler) {
            var members = tc.currentChannel.getMembers();
            //for each member, set up a listener for when the member is updated
            members.then(function(currentMembers) {
                currentMembers.forEach(function(member) {
                    //handle the read status information for this member
                    //note this method would use the provided information 
                    //to render this to the user in some way

                    if (member.identity == CURRENT_USER_ID) {
                        console.log('success')
                        console.log(member);
                        tc.currentMember = member;

                        if (typeof handler === 'function') {
                            handler();
                        }
                    }

                });
            });
        }

        // Set scope variable to true for typing event
        function showTypingStarted(member) {

            if (CURRENT_USER_ID == tc.currentChannel.attributes.localId) {
                $scope.typing = tc.currentChannel.attributes.travellerName + ' is typing ...';
            } else {
                $scope.typing = tc.currentChannel.attributes.localName + ' is typing ...';
            }

            $timeout(function() {
                console.log('no more typing')
                $scope.typing = ''
            }, 5000);

            $scope.$apply();
        }

        // Set scope variable to false for typing ended event
        function hideTypingStarted(member) {
            $scope.typing = 'not typing';
            $scope.apply();
        }

        // This is to be called once the token expires
        // an event is triggered on token expiry
        function refreshToken() {
            fetchAccessToken(tc.userId, setNewToken);
        }

        // Updates the accessManager with the new updated token retrieved from the feathers server
        function setNewToken(tokenResponse) {
            tc.accessManager.updateToken(tokenResponse.token);
        }

        connectMessagingClient(twilio);

    });
