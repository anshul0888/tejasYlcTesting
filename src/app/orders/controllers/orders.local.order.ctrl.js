'use strict';
angular.module('com.ylc.orders')
    .controller('LocalsOrderCtrl', function(
        $scope,
        CoreService,
        gettextCatalog,
        auth,
        $state,
        Dashboard,
        User,
        Gigs,
        userData,
        Register,
        notify,
        orderDetails,
        OrdersService,
        $stateParams
    ) {

        if (userData) {
            $scope.usersData = userData;
            $scope.signedIn = true;
        } else {
            $scope.signedIn = false;
        }

        $scope.travelersData = null;
        $scope.orderDetails = null;
        $scope.orderDetails = orderDetails;
        $scope.travelersData = User(orderDetails.travelerId);
        $scope.orderId = $stateParams.orderId;

        $scope.getNumber = function(num) {
            return new Array(num);
        };

        $scope.changeGigStatus = function(gigId, status, orderId) {
            Dashboard.changeGigStatus(gigId, status, orderId);
            if (status === 'IN_PROGRESS') {
                Dashboard.changeGigStatusText(gigId, 'IN PROGRESS', orderId)
            } else {
                if (status === 'COMPLETED') {
                    Dashboard.changeGigStatusText(gigId, 'COMPLETED', orderId)
                }
            }
        };

        $scope.declineOrder = function(reason, orderId) {
            //TODO Ask for reason if OTHER
            //TODO EMAIL
            var data = {};
            data.orderId = orderId;
            //TODO EMAIL


            // fetches the order details first
            OrdersService.get(orderId).then(function(resolvedData) {
                var orderData = resolvedData.data;

                // Prepares the data which is to be updated
                var finalData = {
                    gigs: {},
                    status: 'DECLINED',
                    statusChangedTime: Date.now(),
                    localDeclinedReason: reason,
                    update_status: 'order_declined',
                    update_source: 'ylc_update'
                };

                for (var prop in orderData.gigs) {
                    finalData.gigs[prop] = {
                        status: 'DECLINED',
                        statusChangedTime: Date.now(),
                        statusText: 'DECLINED'
                    }
                }

                // Updates the data
                OrdersService.update(orderId, finalData).then(function(resolvedData) {
                    console.log(resolvedData);
                }).catch(function(error) {
                    console.log(error);
                });

            });
            Dashboard.declineOrderReason(reason, orderId);
            Dashboard.orderDeclinedSendEmailTraveler(data);
            Dashboard.orderDeclinedSendEmailTJ(data);
            //Dashboard.orderDeclinedSendEmailYLC(data);
        };


        /**
         * Accepts orders by changing the status of an order and also by setting the gig
         * properties
         * @param  {String} orderId Order ID whose status is to be changed
         */
        $scope.acceptOrder = function(orderId) {
            var data = {};
            data.orderId = orderId;
            //TODO EMAIL


            // fetches the order details first
            OrdersService.get(orderId).then(function(resolvedData) {
                var orderData = resolvedData.data;

                // Prepares the data which is to be updated
                var finalData = {
                    gigs: {},
                    status: 'ACCEPTED',
                    statusChangedTime: Date.now(),
                    update_status: 'order_accepted',
                    update_source: 'ylc_update'
                };

                for (var prop in orderData.gigs) {
                    finalData.gigs[prop] = {
                        status: 'IN_PROGRESS',
                        statusChangedTime: Date.now(),
                        statusText: 'IN PROGRESS'
                    }
                }

                // Updates the data
                OrdersService.update(orderId, finalData).then(function(resolvedData) {
                    console.log(resolvedData);
                }).catch(function(error) {
                    console.log(error);
                });

            });
        };

        /**
         * Accepts orders by changing the status of an order and also by setting the gig
         * properties
         * @param  {String} orderId Order ID whose status is to be changed
         */
        $scope.orderCompleted = function(orderId) {
            var data = {};
            data.orderId = orderId;
            //TODO EMAIL


            // fetches the order details first
            OrdersService.get(orderId).then(function(resolvedData) {
                var orderData = resolvedData.data;

                // Prepares the data which is to be updated
                var finalData = {
                    gigs: {},
                    localCompletedOrder: true,
                    status: 'COMPLETED',
                    orderCompletedTime: Date.now(),
                    update_status: 'order_completed',
                    update_source: 'ylc_update'
                };

                for (var prop in orderData.gigs) {
                    finalData.gigs[prop] = {
                        status: 'COMPLETED',
                        statusChangedTime: Date.now(),
                        statusText: 'COMPLETED'
                    }
                }

                // Updates the data
                OrdersService.update(orderId, finalData).then(function(resolvedData) {
                    console.log(resolvedData);
                }).catch(function(error) {
                    console.log(error);
                });

            });
            // Dashboard.orderStatusChange(orderId, 'ACCEPTED');
            // Dashboard.orderAcceptedSendEmailTraveler(data);
        };

        $scope.hoveringLeave = function(rating, orderId) {
            if (orderId) {
                if (!rating || rating < 1 || rating > 5) {} else {
                    Dashboard.setLocalOrderRating(orderId).$save().then(function(ref) {
                        ref.set(rating, function(error) {
                            if (error) {
                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Rating not saved!'))
                            } else {
                                //TODO QUEUE TO UPDATE AVG RATING OF LOCAL
                                //CoreService.toastSuccess(gettextCatalog.getString('Ratings Saved'),gettextCatalog.getString('Your Rating is safe with us!'));
                            }
                        })
                    });
                    Dashboard.setLocalOrderRated(orderId).$save().then(function(ref) {
                        ref.set(true, function(error) {
                            if (error) {
                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Rating not saved!'))
                            } else {
                                //TODO QUEUE TO UPDATE AVG RATING OF LOCAL
                                CoreService.toastSuccess(gettextCatalog.getString('Ratings Saved'), gettextCatalog.getString('Your Rating is safe with us!'));
                            }
                        })
                    })
                }
            } else {
                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Select an Order!'))
            }
        };

        $scope.orderReopen = function(orderId) {
            Dashboard.reopenOrder(orderId);

            Dashboard.getGigs(orderId).$loaded().then(function(gigData) {
                angular.forEach(gigData, function(value, key) {
                    Dashboard.changeGigStatus(value.$id, 'IN_PROGRESS', orderId);
                    Dashboard.changeGigStatusText(value.$id, 'IN PROGRESS', orderId);
                })
            })
        };

        if (orderDetails.localId === auth.uid) {

        } else {
            $state.go('dashboard.view');
        }

        $scope.getGig = function(id) {
            return Gigs.getGig(id);
        };

        $scope.usersData = userData;

        $scope.getTravelersData = function(travelersId) {
            return User(travelersId);
        };
    });
