angular.module('com.ylc.iPMessaging')
    .config(function($stateProvider) {
        $stateProvider
            .state('iPMessaging', {
                url: '/messages',
                abstract: true,
                resolve: {
                    /**
                     * The below function fetches the user details from the Yumigo API
                     * @param  {Object} $state            $state Object of angular 
                     * @param  {Object} YumigoUserService Yumigo Factory to send and recieve user data 
                     * @return {Promise}                  Returns a Promise object
                     */
                    auth: function($state, Auth, State) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('dashboard.view');
                            State.setUserNextStateParams(null);
                            $state.go('signin');
                        });
                    }
                },
                views: {
                    main: {
                        templateUrl: 'iPMessaging/views/main.tpl.html'
                    }
                },
                data: { pageTitle: 'Messages' }
            })
            .state('iPMessaging.inbox', {
                url: '',
                resolve: {

                    /**
                     * The below function fetches the user details from the Yumigo API
                     * @param  {Object} $state            $state Object of angular 
                     * @param  {Object} YumigoUserService Yumigo Factory to send and recieve user data 
                     * @return {Promise}                  Returns a Promise object
                     */
                    auth: function($state, Auth, State) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('dashboard.view');
                            State.setUserNextStateParams(null);
                            $state.go('signin');
                        });
                    },

                    /**
                     * Twilio service to fetch twilio credentials
                     * @param  {Object} TwilioService Angular custom service
                     * @param  {Object} auth          Resolved promise returned in the previous function
                     * @return {Promise}              Returns a HTTP promise
                     */
                    twilio: function(TwilioService, auth) {
                        return TwilioService.getAccessToken(auth.uid).catch(function(error) {
                            console.log('There is an error');
                            console.log(error);
                        });
                    }
                },
                views: {
                    messages: {
                        templateUrl: 'iPMessaging/views/inbox.tpl.html',
                        controller: 'IPMessagingInboxCtrl'
                    }
                },
                data: { pageTitle: 'Inbox' }
            })
            .state('iPMessaging.conversation', {
                url: '/:channelId',
                resolve: {
                    /**
                     * The below function fetches the user details from the Yumigo API
                     * @param  {Object} $state            $state Object of angular 
                     * @param  {Object} YumigoUserService Yumigo Factory to send and recieve user data 
                     * @return {Promise}                  Returns a Promise object
                     */
                    auth: function($state, Auth, State) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('dashboard.view');
                            State.setUserNextStateParams(null);
                            $state.go('signin');
                        });
                    },


                    /**
                     * Twilio service to fetch twilio credentials
                     * @param  {Object} TwilioService Angular custom service
                     * @param  {Object} auth          Resolved promise returned in the previous function
                     * @return {Promise}              Returns a HTTP promise
                     */
                    twilio: function(TwilioService, auth) {
                        return TwilioService.getAccessToken(auth.uid).catch(function(error) {
                            console.log('There is an error');
                            console.log(error);
                        });
                    }
                },
                views: {
                    messages: {
                        templateUrl: 'iPMessaging/views/conversation.tpl.html',
                        controller: 'IPMessagingConversationCtrl'
                    }
                },
                params: {
                    isCollapsed: false
                },
                data: { pageTitle: 'Conversation' }
            })
            .state('iPMessaging.newOrderConversation', {
                url: '/:channelId/:orderId',
                resolve: {
                    /**
                     * The below function fetches the user details from the Yumigo API
                     * @param  {Object} $state            $state Object of angular 
                     * @param  {Object} YumigoUserService Yumigo Factory to send and recieve user data 
                     * @return {Promise}                  Returns a Promise object
                     */
                    auth: function($state, Auth, State) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('dashboard.view');
                            State.setUserNextStateParams(null);
                            $state.go('signin');
                        });
                    },

                    /**
                     * Twilio service to fetch twilio credentials
                     * @param  {Object} TwilioService Angular custom service
                     * @param  {Object} auth          Resolved promise returned in the previous function
                     * @return {Promise}              Returns a HTTP promise
                     */
                    twilio: function(TwilioService, auth) {
                        return TwilioService.getAccessToken(auth.uid).catch(function(error) {
                            console.log('There is an error');
                            console.log(error);
                        });
                    }
                },
                views: {
                    messages: {
                        templateUrl: 'iPMessaging/views/newOrderQuestionaire.tpl.html',
                        controller: 'IPMessagingNewOrderCtrl'
                    }
                },
                params: {
                    isCollapsed: false
                },
                data: { pageTitle: 'Conversation' }
            })
    });
