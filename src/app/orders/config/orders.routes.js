angular.module('com.ylc.orders')
    .config(function($stateProvider) {
        $stateProvider
            .state('orders', {
                url: '/orders',
                abstract: true,
                views: {
                    main: {
                        templateUrl: 'orders/views/main.tpl.html'
                    }
                },
                data: { pageTitle: 'Orders' }
            })
            .state('orders.traveler', {
                url: '/traveler',
                abstract: true,
                resolve: {},
                views: {
                    traveler: {
                        templateUrl: 'orders/views/traveler.tpl.html'
                    }
                },
                data: { pageTitle: 'Traveler Orders' }
            })
            .state('orders.traveler.order', {
                url: '/:orderId',
                resolve: {
                    auth: function($state, Auth, State, $stateParams) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('orders.traveler.order');
                            //TODO ADD ORDERID BELOW
                            State.setUserNextStateParams({ orderId: $stateParams.orderId });
                            $state.go('signin');
                        });
                    },
                    orderDetails: function(OrdersRef, $firebaseObject, $stateParams) {
                        return $firebaseObject(OrdersRef.child($stateParams.orderId)).$loaded();
                    },
                    userData: ['User', 'Auth', function(User, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            return User(auth.uid).$loaded();
                        }).catch(function() {
                            return null;
                        });
                    }]
                },
                views: {
                    travelerOrder: {
                        templateUrl: 'orders/views/traveler.order.tpl.html',
                        controller: 'TravelersOrderCtrl'
                    }
                },
                data: { pageTitle: 'Order' }
            })
            .state('orders.local', {
                url: '/local',
                abstract: true,
                resolve: {},
                views: {
                    local: {
                        templateUrl: 'orders/views/local.tpl.html'
                    }
                },
                data: { pageTitle: 'Local Orders' }
            })
            .state('orders.local.order', {
                url: '/:orderId',
                resolve: {
                    auth: function($state, Auth, State, $stateParams) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('orders.local.order');
                            //TODO ADD ORDERID BELOW
                            State.setUserNextStateParams({ orderId: $stateParams.orderId });
                            $state.go('signin');
                        });
                    },
                    orderDetails: function(OrdersRef, $firebaseObject, $stateParams) {
                        return $firebaseObject(OrdersRef.child($stateParams.orderId)).$loaded();
                    },
                    userData: ['User', 'Auth', function(User, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            return User(auth.uid).$loaded();
                        }).catch(function() {
                            return null;
                        });
                    }]
                },
                views: {
                    localOrder: {
                        templateUrl: 'orders/views/local.order.tpl.html',
                        controller: 'LocalsOrderCtrl'
                    }
                },
                data: { pageTitle: 'Order' }
            })
            .state('orders.newOrderConversation', {
                url: '/:orderId/newForm',
                resolve: {
                    auth: function($state, Auth, State, $stateParams) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('orders.local.order');
                            //TODO ADD ORDERID BELOW
                            State.setUserNextStateParams({ orderId: $stateParams.orderId });
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
                    },

                    orderDetails: function(OrdersRef, $firebaseObject, $stateParams) {
                        return $firebaseObject(OrdersRef.child($stateParams.orderId)).$loaded();
                    },
                    localsData: ['User', 'Auth', function(User, Auth) {
                        return Auth.$requireAuth().then(function(auth) {
                            return User(auth.uid).$loaded();
                        }).catch(function() {
                            return null;
                        });
                    }]

                },
                views: {
                    orderForm: {
                        templateUrl: 'iPMessaging/views/newOrderQuestionaire.tpl.html',
                        controller: 'IPMessagingNewOrderCtrl'
                    }
                },
                params: {
                    isCollapsed: false
                },
                data: { pageTitle: 'Conversation' }
            })
            .state('orders.conversation', {
                url: '/chat/:orderId/:channelId',
                resolve: {
                    /**
                     * The below function fetches the user details from the Yumigo API
                     * @param  {Object} $state            $state Object of angular 
                     * @param  {Object} YumigoUserService Yumigo Factory to send and recieve user data 
                     * @return {Promise}                  Returns a Promise object
                     */
                    auth: function($state, Auth, State, $stateParams) {
                        return Auth.$requireAuth().catch(function() {
                            State.setUserNextState('orders.conversation');
                            //TODO ADD ORDERID BELOW
                            State.setUserNextStateParams({ orderId: $stateParams.orderId });
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
                    orderChat: {
                        templateUrl: 'iPMessaging/views/conversation.tpl.html',
                        controller: 'IPMessagingConversationCtrl'
                    }
                },
                params: {
                    isCollapsed: false
                },
                data: { pageTitle: 'Conversation' }
            })
    });
