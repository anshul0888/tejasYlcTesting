'use strict';
angular.module('com.ylc.iPMessaging')
    .controller('IPMessagingNewOrderCtrl', function (
        $scope,
        $stateParams,
        $timeout,
        $uibModal,
        blockUI,
        auth,
        TwilioService,
        User,
        debounce,
        $http,
        twilio,
        FormService,
        orderDetails,
        localsData,
        $state,
        Yumigo_API,
        FeathersEmail,
        CoreService
    ) {

        $scope.userData = localsData;
        $scope.formIsPresent = false;
        $scope.mandatoryFieldsNotFilled = true;

        $scope.order_id = $stateParams.orderId;
        $scope.orderDetails = orderDetails;

        $scope.goOrderDetails = function () {
            if (auth.uid === orderDetails.travelerId) {
                $state.go('orders.traveler.order', { orderId: $stateParams.orderId })
            } else {
                $state.go('orders.local.order', { orderId: $stateParams.orderId })
            }
        }

        $scope.isUserOwnerOfForm = false;

        if (orderDetails.travelerId == localsData.$id) {
            $scope.isUserOwnerOfForm = true;
        }
        FormService.getForm($stateParams.orderId).then(function (resolvedData) {
            $scope.formIsPresent = true;
            $scope.messageQuestionnaire = resolvedData.data;

            if (resolvedData.data.secondaryLocations) {
                for (var i = 0; i < resolvedData.data.secondaryLocations.length; i++) {
                    var eachSecondaryLocation = resolvedData.data.secondaryLocations[i]
                    $scope.secondaryLocations.push({
                        details: eachSecondaryLocation,
                        id: i
                    })
                }
            }

        });

        $scope.messageQuestionnaire = {
            secondaryLocations: []
        }
        $scope.tempSecondaryLocations = {};
        $scope.secondaryLocations = []
        var geocoder = new google.maps.Geocoder();


        $scope.$watch('messageQuestionnaire', function (newValue, oldValue) {
            if (
                newValue.travelingWith &&
                newValue.primaryLocation &&
                newValue.primaryLocation.formatted_address &&
                newValue.tripBudget &&
                newValue.tripFromDate &&
                newValue.tripToDate &&
                newValue.preferenceToDo &&
                newValue.travelerPhoneNumber) {
                $scope.mandatoryFieldsNotFilled = false;
            }
        }, true)

        $scope.$watch('secondaryLocations', function (newValue, oldValue) {}, true)



        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.dateFromClear = function () {
            $scope.tripFromDate = null;
        };

        $scope.dateToClear = function () {
            $scope.tripToDate = null;
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 3, 18);

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.saveFromDate = function () {
            // MessagesConversation.saveTripFromDate(questionnaireId[0].$id, new Date(new Date($scope.tripFromDate).toDateString()).getTime());
        };

        $scope.saveToDate = function () {
            // MessagesConversation.saveTripToDate(questionnaireId[0].$id, new Date(new Date($scope.tripToDate).toDateString()).getTime());
        };

        $scope.saveWhoYouTravelingWith = function (travelingWith) {
            // MessagesConversation.saveWhoYouTravWith(questionnaireId[0].$id, travelingWith)
        };



        $scope.saveCurrentLocation = function (location) {
            geocoder.geocode({ 'placeId': location.placeLocationData.formatted_address.place_id }, function (response, status) {
                if (status === 'OK') {
                    if ((response[0].types[0] === 'locality') || (response[0].types[0] === 'administrative_area_level_1') || (response[0].types[0] === 'administrative_area_level_2') || (response[0].types[0] === 'administrative_area_level_3') || (response[0].types[0] === 'administrative_area_level_4') || (response[0].types[0] === 'administrative_area_level_5') || (response[0].types[0] === 'sublocality_level_1') || (response[0].types[0] === 'sublocality_level_2') || (response[0].types[0] === 'sublocality_level_3') || (response[0].types[0] === 'sublocality_level_4') || (response[0].types[0] === 'sublocality_level_5') || (response[0].types[0] === 'colloquial_area') || (response[0].types[0] === 'sublocality') || (response[0].types[0] === 'political') || (response[0].types[0] === 'country')) {
                        $scope.messageQuestionnaire.primaryLocation = response[0];
                    }
                } else {}
            });
        };

        $scope.addLocation = function () {

            if ($scope.secondaryLocations.length == 4) {
                CoreService.toastError('You can enter at most 4 secondary locations');
                return;
            }
            $scope.secondaryLocations.push({ details: {}, id: $scope.secondaryLocations.length + 1 });
        };

        $scope.removeLocation = function (locationDetails, index) {
            $scope.secondaryLocations.splice(index, 1);
            $scope.messageQuestionnaire.secondaryLocations = $scope.secondaryLocations;

            if (locationDetails.details.place_id) {
                delete $scope.tempSecondaryLocations[locationDetails.details.place_id];
            }
        };

        $scope.secondaryLocationChanged = function (location, id) {

            var placeId = "";
            try {
                placeId = location.place_id;
            } catch (e) {
                var splicedItem = $scope.secondaryLocations.splice(id - 1, 1)[0];
                var splicedItemPlaceId = splicedItem.details.place_id;
                delete $scope.tempSecondaryLocations[splicedItemPlaceId];
                return
            }
            if (placeId !== undefined && placeId !== null) {
                if ($scope.messageQuestionnaire.primaryLocation && placeId === $scope.messageQuestionnaire.primaryLocation.place_id) {
                    // Location already added as Main Location add another location
                    $scope.secondaryLocations.splice(id - 1, 1);
                } else {

                    if ($scope.tempSecondaryLocations[placeId] === undefined ||
                        $scope.tempSecondaryLocations[placeId] === null) {

                        geocoder.geocode({ 'placeId': placeId }, function (response, status) {
                            if ((response[0].types[0] === 'locality') || (response[0].types[0] === 'administrative_area_level_1') || (response[0].types[0] === 'administrative_area_level_2') || (response[0].types[0] === 'administrative_area_level_3') || (response[0].types[0] === 'administrative_area_level_4') || (response[0].types[0] === 'administrative_area_level_5') || (response[0].types[0] === 'sublocality_level_1') || (response[0].types[0] === 'sublocality_level_2') || (response[0].types[0] === 'sublocality_level_3') || (response[0].types[0] === 'sublocality_level_4') || (response[0].types[0] === 'sublocality_level_5') || (response[0].types[0] === 'colloquial_area') || (response[0].types[0] === 'sublocality') || (response[0].types[0] === 'political') || (response[0].types[0] === 'country')) {

                                $scope.secondaryLocations[id - 1].details = response[0];
                                $scope.tempSecondaryLocations[placeId] = response[0];
                                $scope.messageQuestionnaire.secondaryLocations = []
                                for (var i = 0; i < $scope.secondaryLocations.length; i++) {
                                    var eachLocation = $scope.secondaryLocations[i];
                                    if (eachLocation.details != "" || eachLocation.details != null) {
                                        $scope.messageQuestionnaire.secondaryLocations.push(eachLocation.details);
                                    }
                                }
                            }
                        }, function (error) {});
                    } else {
                        $scope.secondaryLocations.splice(id - 1, 1);
                    }
                }
            }
        };

        var CURRENT_USER_ID = auth.uid;
        var CHANNEL_ID = orderDetails.travelerId + '@separator@' + orderDetails.localId;

        var travellerId = orderDetails.travelerId;
        var localId = orderDetails.localId;
        var travelerObj = User(travellerId);
        $scope.travelerDetails = travelerObj;
        var localObj = User(localId);

        $scope.userId = auth.uid;
        var tc = {};
        tc.userId = CURRENT_USER_ID;

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
            twilioClientPromise.then(function (tokenResponse) {
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

        tc.getChannel = function (channelId) {
            if (tc.messagingClient === undefined) {
                console.log('Client is not initialized');
                return;
            }

            tc.messagingClient.getChannelByUniqueName(channelId).then(function (channel) {
                if (!channel || channel == undefined) {

                    // SInce no channel is found I will be making a new channel here
                    tc.createChannel(channelId);
                    return;
                }

                tc.currentChannel = channel;

                // deleteCurrentChannel();
                tc.setUpChannel();
            });
        }

        function deleteCurrentChannel() {
            if (!tc.currentChannel) {
                return;
            }
            tc.currentChannel.delete().then(function (channel) {
                console.log('channel: ' + channel.friendlyName + ' deleted');
            });
        }


        // This creates the channel with the unique name
        tc.createChannel = function (uniqueName) {
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
                        travellerName: travelerObj.getFullName(),
                        travellerProfilePhoto: travelerObj.getUserProfilePhoto(),
                        localEmail: localObj.getUserEmail(),
                        travellerEmail: travelerObj.getUserEmail()
                    },
                    isPrivate: true
                }).then(function (channel) {
                    tc.inviteMember(channel, localId);
                    tc.joinChannel(channel);
                });
            } else {
                console.log('Found channel already:');
            }
        };

        tc.inviteMember = function (channel, memberId) {
            if (!memberId || memberId == "") {
                console.log('No memberId Specified!');
                return;
            }
            channel.invite(memberId).then(function () {
                console.log('Your friend has been invited!');
            }).catch(function (error) {
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
                    setTimeout(function () {
                        tc.inviteMember(channel, memberId);
                    }, 4000);

                }, function errorCallback(response) {
                    console.log('error');
                    console.log(response);
                });
            });
        }

        tc.joinChannel = function (channel) {
            channel.join().then(function (joinedChannel) {
                console.log('Joined channel ' + joinedChannel);

                tc.currentChannel = channel;
                tc.setUpChannel();

            }).catch(function (error) {
                console.log('some error in joining channel');
                console.log(error);
            });
        }

        // registers all the events to the channel
        tc.setUpChannel = function () {
            if (!tc.currentChannel) {
                console('No channel has been setup.');
                return;
            }
            $scope.channel = tc.currentChannel;
        }

        // Update the lastUpdate property which will be used to sort the conversations
        // in descending order of the lastUpdate
        function updateChannel() {
            updateLastUpdate();
        }

        function updateLastUpdate() {
            if (tc.currentChannel == null) {
                console.log('Current channel not setup yet');
                return;
            }

            var currentAttributes = tc.currentChannel.attributes;
            currentAttributes.lastUpdate = Date.now();
            tc.currentChannel.updateAttributes(currentAttributes).then(function (something) {
                console.log(something);
                console.log('i think it is a success');

                blockUI.stop();
                var $uibModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'payments/views/success.tpl.html',
                    controller: function ($scope, $stateParams, $state) {

                        $scope.heading = 'Congratulations for submitting your trip details!';
                        $scope.subheading = 'Your local will contact you in the next 24 to 48 hours.';
                        $scope.continue = function () {
                            $uibModalInstance.close('successCompleted');
                            $state.go('orders.conversation', {
                                orderId: $stateParams.orderId,
                                channelId: CHANNEL_ID
                            })
                        };

                        $scope.cancel = function () {
                            $state.go('orders.conversation', {
                                orderId: $stateParams.orderId,
                                channelId: CHANNEL_ID
                            });
                        };
                    },
                    size: 'lg'
                });

                $uibModalInstance.result.then(function () {
                    $state.go('orders.conversation', {
                        orderId: $stateParams.orderId,
                        channelId: CHANNEL_ID
                    });
                }, function () {
                    $state.go('orders.conversation', {
                        orderId: $stateParams.orderId,
                        channelId: CHANNEL_ID
                    });
                })
            }).catch(function (err) {
                console.log(err);
            });
        }

        $scope.sendMessage = function (messageType) {
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
                    travellerName: travelerObj.getFullName(),
                    travellerProfilePhoto: travelerObj.getUserProfilePhoto(),
                    localEmail: localObj.getUserEmail(),
                    travellerEmail: travelerObj.getUserEmail(),
                    sendMessageTo: sendMessageTo,
                    messageType: messageType
                });
                $scope.message = '';

                sendEmail({
                    "orderQuestionnaireLocalEmail": true,
                    "local": localObj.firstName,
                    "traveler": travelerObj.firstName,
                    "orderId": $stateParams.orderId,
                    "sendEmailTo": localObj.email
                }, function (error) {
                    if (error) {
                        alert('Something went wrong in sending the email to local')
                    }
                    updateChannel();
                })
                console.log('Message: ' + message);
            }
        }

        $scope.send_form_message = function send_form_message(data) {
            if (

                data.travelingWith &&
                data.primaryLocation &&
                data.primaryLocation.formatted_address &&
                data.tripBudget &&
                data.tripFromDate &&
                data.tripToDate &&
                data.preferenceToDo &&
                data.travelerPhoneNumber &&
                data.tos) {

                blockUI.start();
                data.orderId = $stateParams.orderId;
                FormService.saveForm(data)
                    .then(function (response) {
                        $scope.message = response.data.firebaseId;
                        $scope.sendMessage('form');
                    }).catch(function (error) {
                        console.log(data)
                    });
            } else {
                CoreService.toastError('Please fill in all the mandatory information');
            }
        }

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
            members.then(function (currentMembers) {
                currentMembers.forEach(function (member) {
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


        function sendEmail(data, callback) {
            FeathersEmail.create(data).then(function (response) {
                callback(null, response);
            }).catch(function (error) {
                callback(error);
            })
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
