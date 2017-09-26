
angular.module('com.ylc.payments')
    .config(function($stateProvider) {
    $stateProvider
        .state('payment', {
            url: '/payment',
            resolve: {
                auth: function($state, Auth){
                    return Auth.$requireAuth().catch(function(){
                        $state.go('signin');
                    });
                }
            },
            abstract : true,
            views : {
                main : {
                    templateUrl: 'payments/views/main.tpl.html'
                }
          },
          data:{ pageTitle: 'Payment' }
        })
        .state('payment.confirm', {
            url: '/confirm',
            //params : {
            //    userCart : null
            //},
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    backdrop: 'static', // Does not let the modal to close onClick at the black/backscreen
                    animation: true, // Default
                    templateUrl: 'payments/views/confirm.tpl.html',
                    controller:function($uibModalInstance ,$scope){
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        auth: function($state, Auth) {
                            return Auth.$requireAuth().catch(function() {
                                $state.go('signin');
                            });
                        },
                        cartData: function($state, Cart, State, CoreService, gettextCatalog) {
                            if (Cart.getUserCart()) {
                                return Cart.getUserCart();
                            } else {
                                CoreService.toastError(gettextCatalog.getString('You need to select a product before continuing!'),
                                    gettextCatalog.getString('Please select a product before continuing!'));
                                $state.go(State.getUserPreviousState(), State.getUserPreviousStateParams());
                            }
                        }
                    }
                });
            }],
            views : {
                payment : {
                    templateUrl: 'payments/views/confirm.tpl.html',
                    controller : 'PaymentConfirmationCtrl'
                }
            },
            data:{ pageTitle: 'Confirm Order' }
        })
        .state('payment.process', {
            url: '/process',
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    backdrop: 'static', // Does not let the modal to close onClick at the black/backscreen
                    animation: true, // Default
                    templateUrl: 'payments/views/process.tpl.html',
                    controller: 'PaymentProcessingCtrl',
                    resolve: {
                        auth: function($state, Auth){
                            return Auth.$requireAuth().catch(function(){
                                $state.go('signin');
                            });
                        }
                    }
                });
            }],
            data:{ pageTitle: 'Process Payment' }
        })
        .state('payment.success', {
            url: '/success/:orderId',
            resolve: {
                auth: function($state, Auth){
                    return Auth.$requireAuth().catch(function(){
                        $state.go('signin');
                    });
                }
            },
            views : {
                payment : {
                    templateUrl: 'payments/views/success.tpl.html',
                    controller : 'PaymentSuccessCtrl'
                }
            },
            data:{ pageTitle: 'Success' }
        });
    });

