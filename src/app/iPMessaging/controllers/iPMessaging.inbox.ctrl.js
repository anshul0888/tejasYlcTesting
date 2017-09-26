'use strict';
angular.module('com.ylc.iPMessaging')
    .controller('IPMessagingInboxCtrl', function($scope, $stateParams, $state, auth, TwilioService, User, twilio, Auth) {


        console.log('-----Auth----');
        console.log(Auth);
        console.log('-----Auth----');

        console.log('------Twilio------');
        console.log(twilio)
        console.log('------Twilio------');

        var CURRENT_USER_ID = auth.uid;
    	var tc = {};
    	$scope.conversations = [];
        $scope.unread = {};
        $scope.userId = auth.uid;

        // TODO: Fetch the userId from Firebase and pass it here
        console.log('--------auth-------')
        console.log(auth)
        console.log('--------auth-------')
        // connectClientWithUserId(auth.uid);

        tc.userId = CURRENT_USER_ID;

        function connectClientWithUserId(userId) {
            tc.userId = userId;
            fetchAccessToken(tc.userId, connectMessagingClient);
        }

        // Fetch the access token for further communication with twilio
        // Using the common Twilio service
        function fetchAccessToken(userId, handler) {
            var twilioClientPromise = TwilioService.getAccessToken(userId);
            twilioClientPromise.then(function(tokenResponse) {
            	console.log(tokenResponse)
                handler(tokenResponse);
            })
        }

        // Connect and initialize the messaging client with the token from the feathers server
        function connectMessagingClient(tokenResponse) {
            // Initialize the IP messaging client
            tc.accessManager = new Twilio.AccessManager(tokenResponse.token);
            tc.messagingClient = new Twilio.IPMessaging.Client(tc.accessManager);
            console.log('test')
            // load with the list of channels that the user is part of
            tc.loadChannelList();

            tc.messagingClient.on('channelAdded', tc.loadChannelList);
            tc.messagingClient.on('channelRemoved', tc.loadChannelList);
            tc.messagingClient.on('channelInvited', tc.joinNewChannel);
            tc.messagingClient.on('tokenExpired', refreshToken);
        }

        tc.joinNewChannel = function (channel) {
            // joins the new invited channel
            channel.join();

            // reloads the channel list
            tc.loadChannelList();
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

        // loads the list of channels and updated the channel scope
        tc.loadChannelList = function(handler) {
            if (tc.messagingClient === undefined) {
                console.log('Client is not initialized');
                return;
            }
            tc.messagingClient.getChannels().then(function(channels) {
                console.log('load channel called and resolved')
                console.log(channels)
                tc.channelArray = tc.sortChannelsByTime(channels);
                
                // attachChannelEvents(channels);
                $scope.conversations = tc.channelArray;
                if (typeof handler === 'function') {
                    handler();
                }
            });
        };


        /**
         * Attaches the messageAdded event to all the channels
         * @param  {Object} channels Channel Object of Twilio
         */
        function attachChannelEvents(channels) {
            console.log(channels);
            for (var i = 0; i < channels.length; i++) {
                handleChannelEvents(channels[i]);
            }
        }

        /**
         * Handles the channel event onMessageAdded, more events can be added
         * as needed
         * @param  {Object} channel Channel Object
         */
        function handleChannelEvents(channel) {
            console.log('--------------test -----------')
            console.log(channel);
            // on adding messages get the unreadMessagesFor that particular conversation
            channel.on('messageAdded', getUnreadMessagesForConversation(channel));
            console.log('-------after event attachment--------');
        }

        // sorts the channels based of the last updated time
        // or rather based on the last time message was sent or recieved
        tc.sortChannelsByTime = function(channels) {
            return channels.sort(function(a, b) {
                return b.attributes.lastUpdate - a.attributes.lastUpdate;
            });
        };


        /**
         * Fetches the number of unread messages for a particular channel
         * @param  {Object} channel Twilio Channel Object
         */
        function getUnreadMessagesForConversation(channel) {

            var members = channel.getMembers();
            var messages = channel.getMessages();

            // fetches the current members of a channel
            members.then(function(currentMembers) {
                if (currentMembers.length == 0) {
                    return;
                }

                // fetches the current messages of the channel
                messages.then(function(currentMessages) {

                    var messageCount = currentMessages.length;
                    for (var i = 0; i < currentMembers.length; i++) {
                        var member = currentMembers[i];

                        // only get the unread count of the currently
                        // logged in user
                        if(member.identity == CURRENT_USER_ID){
                            var unreadCount = 0;
                            if (messageCount > 0) {
                                unreadCount = messageCount - member.lastConsumedMessageIndex - 1;
                            } else {
                                unreadCount = 0;
                            }
                            console.log('Channel Message Length: ' + messageCount);
                            console.log(member.lastConsumedMessageIndex);
                            console.log('Unread Message Count: ' + unreadCount);
                            updateUnreadMessages(channel.uniqueName, unreadCount);
                            break;
                        }
                    }
                });
            });
        }

        $scope.getUnreadMessagesForConversation = getUnreadMessagesForConversation;

        /**
         * Updates the unread message count of a particular message
         * @param  {String} channelId   Channel ID of whose messages needs to be updated
         * @param  {Number} unreadCount Integer number of unread messages
         */
        function updateUnreadMessages(channelId, unreadCount) {
            $scope.unread[channelId] = unreadCount;
            console.log($scope.unread);
        }


        /**
         * Gets the last message of a particular conversation;
         * @param  {String} channelId Channel ID of whose last message needs to fetched
         */
    	$scope.getConversationLastMessage = function(channelId) {
    		tc.messagingClient.getChannelByUniqueName(channelId).then(function (channel) {

                // failure case when the channel id is invalid
                if(!channel || channel == undefined){
                    console.log('No such channel found');
                    return;
                }

                // Need to get the last message out of this channel
                channel.getMessages(1).then(function (messages) {
	                return messages;
	            });
                
            });	
    	}

        $scope.parseJson = function(stringifiedData) {
            return JSON.parse(stringifiedData)
        }

        connectMessagingClient(twilio);
    });
