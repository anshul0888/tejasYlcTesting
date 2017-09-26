'use strict';
angular.module('com.ylc.core')
    .controller('GiftcardPaymentProcessingCtrl', function($scope,$stateParams,CoreService, $uibModal, $modalInstance,
                                                  Cart,State,Payment,auth,gettextCatalog,$state,Orders,blockUI, $timeout, userData) {


        if(Cart.getUserCart()){
            var data = {userId : auth.uid};
            data["_start"] = "client_token";

            $scope.total = Math.round(Cart.getUserCart().total * 100) / 100;

            var cart = Cart.getUserCart();

            if(cart.isAFreeGig === true && cart.isAFreeGig !== undefined && cart.isAFreeGig !== null){
                var orderData = {};
                //Lets not put the entire products within cart this has to change to only GigId later

                Cart.setUserCart(null);
                var orderD = {};
                orderD.status = 'paymentSuccess';

                $timeout(function() {
                    $modalInstance.close(orderD);    
                }, 5000)
                

            } else {
                Payment.getToken(data).then(function (queueData) {
                    queueData.on('value', function (dataSnapshot) {
                        if(dataSnapshot.val()._state === 'client_token_error'){
                            CoreService.toastError(gettextCatalog.getString(
                                'Error!'), gettextCatalog.getString(
                                'Try again!'));
                        }

                        if(dataSnapshot.val()._state === 'client_token_finished'){
                            braintree.setup(dataSnapshot.val().clientToken, "dropin", {
                                container: "payment-form",
                                paymentMethodNonceReceived : function (event, nonce) {
                                    blockUI.start('Processing Payment ...');

                                    var transactionData = {userId : auth.uid};
                                    transactionData.nonceFromClient = nonce;
                                    transactionData.amountToBeCharged = Math.round(Cart.getUserCart().total * 100) / 100;
                                    transactionData["_start"] = "transaction";

                                    Payment.processPayment(transactionData).then(function (checkoutQueueData) {
                                        checkoutQueueData.on('value', function (processingData) {
                                            if(processingData.val()._state === 'checkout_error'){
                                                //Implement logic to backtrack order
                                                blockUI.stop();
                                                CoreService.toastError(gettextCatalog.getString(
                                                    'Error processing order!'), gettextCatalog.getString(
                                                    'Please try again!'));
                                            }
                                            if(processingData.val()._state === 'checkout_finished'){
                                                //Update Order with transaction details
                                                if(processingData.val().result.success === true){
                                                    Cart.setUserCart(null);
                                                    var orderD = {};
                                                    orderD.status = 'paymentSuccess';
                                                    blockUI.stop();
                                                    $modalInstance.close(orderD);
                                                } else {
                                                    blockUI.stop();
                                                    CoreService.toastError(gettextCatalog.getString(
                                                        'Error processing order!'), gettextCatalog.getString(
                                                        'Please try again or contact support!'));
                                                }
                                            }
                                        })
                                    })
                                }
                            });
                        }
                    });
                });
            }


        }
    });
