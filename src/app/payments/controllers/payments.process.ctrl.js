'use strict';
angular.module('com.ylc.payments')
    .controller('PaymentProcessingCtrl', function($scope, $stateParams, CoreService, $uibModal, $modalInstance,
        Cart, State, Payment, auth, gettextCatalog, $state, Orders, blockUI, localData,
        travelerData, Text, Email, GigsRef, Discount, Giftcard, Bookings, FeathersEmail, User, Gigs, $http, YLC_API) {


        // if(Cart.getUserCart()){
        //     var data = {userId : auth.uid};
        //     data["_start"] = "client_token";
        //
        //     $scope.total = Math.round(Cart.getUserCart().total * 100) / 100;
        //
        //     var cart = Cart.getUserCart();
        //
        //
        //
        //     if(cart.isAFreeGig === true && cart.isAFreeGig !== undefined && cart.isAFreeGig !== null){
        //         var orderData = {};
        //         //Lets not put the entire products within cart this has to change to only GigId later
        //
        //         if(cart.location !== null && cart.location !== undefined){
        //             orderData.locationGeometry = {};
        //             orderData.locationGeometry.latitude = cart.location[0].geometry.location.lat();
        //             orderData.locationGeometry.longitude = cart.location[0].geometry.location.lng();
        //
        //             delete cart.location[0].geometry.location;
        //             orderData.locationData = cart.location[0];
        //         }
        //
        //         orderData.order = cart;
        //         orderData.order.transaction = {transactionType : 'free'};
        //         orderData.travelerId = auth.uid;
        //         orderData.order.timePlaced = Firebase.ServerValue.TIMESTAMP;
        //
        //         orderData["_start"] = "START";
        //
        //         Orders.createOrder(orderData).then(function (orderProcessQueueDataRef) {
        //             orderProcessQueueDataRef.on('value', function (orderProcessingData) {
        //                 if(orderProcessingData.val()._state === 'ERROR'){
        //                     blockUI.stop();
        //                     CoreService.toastError(gettextCatalog.getString(
        //                         'Error processing order!'), gettextCatalog.getString(
        //                         'Try again!'));
        //                 }
        //                 if(orderProcessingData.val()._state === 'FINISHED'){
        //
        //                     var orderConversationData = {};
        //                     orderConversationData.orderId = orderProcessingData.val().orderId;
        //                     orderConversationData.dateCreated = Firebase.ServerValue.TIMESTAMP;
        //                     orderConversationData["_start"] = "OC_START";
        //                     orderConversationData.travelerId = auth.uid;
        //                     orderConversationData.localId = cart.localId;
        //
        //                     Orders.createOrderConversationQueue(orderConversationData).then(function (ocQueueData) {
        //                         ocQueueData.on('value', function (ocData) {
        //                             if(ocData.val()._state === 'OC_ERROR'){
        //                                 blockUI.stop();
        //                                 CoreService.toastError(gettextCatalog.getString(
        //                                     'Error processing order!'), gettextCatalog.getString(
        //                                     'Please contact support!'));
        //                             }
        //                             if(ocData.val()._state === 'OC_FINISHED'){
        //                                 var orderQuestionnaireData = {};
        //                                 orderQuestionnaireData.orderId = orderProcessingData.val().orderId;
        //                                 orderQuestionnaireData.dateCreated = Firebase.ServerValue.TIMESTAMP;
        //                                 orderQuestionnaireData["_start"] = "OQ_START";
        //                                 orderQuestionnaireData.travelerId = auth.uid;
        //                                 orderQuestionnaireData.localId = cart.localId;
        //
        //                                 Orders.createOrderQuestionnaireQueue(orderQuestionnaireData).then(function (oqQueueData) {
        //                                     oqQueueData.on('value', function (oqData) {
        //                                         if(oqData.val()._state === 'OQ_ERROR'){
        //                                             blockUI.stop();
        //                                             CoreService.toastError(gettextCatalog.getString(
        //                                                 'Error processing order!'), gettextCatalog.getString(
        //                                                 'Please contact support!'));
        //                                         }
        //                                         if(oqData.val()._state === 'OQ_FINISHED'){
        //
        //                                             blockUI.stop();
        //                                             orderData.orderId = orderProcessingData.val().orderId;
        //                                             Orders.orderCompleteInformLocal(orderData);
        //                                             Orders.orderCompleteInformTJ(orderData);
        //                                             Orders.orderCompleteInformTraveler(orderData);
        //                                             Orders.orderCompleteInformYLC(orderData);
        //                                             Orders.orderQuestionnaireInformTraveler(orderQuestionnaireData);
        //
        //                                             //TODO EMAIL CONFIRMATION SENT TO USER ABOUT PAYMENT
        //                                             Cart.setUserCart(null);
        //                                             var orderD = {};
        //                                             orderD.status = 'paymentSuccess';
        //                                             orderD.orderId = orderProcessingData.val().orderId;
        //                                             $modalInstance.close(orderD);
        //
        //                                             var textData = {};
        //
        //                                             var localPhone = localData.getUserPhoneNumber();
        //                                             if(localPhone !== null && localPhone !== undefined && localPhone !== ''){
        //                                                 textData.phoneNumber = localPhone;
        //                                                 textData.localId = cart.localId;
        //                                                 textData.textType = 'orderPlaced';
        //                                                 textData.orderId = orderProcessingData.val().orderId;
        //                                                 textData["_start"] = "text_start";
        //                                                 Text.sendText(textData).then(function (textQueueData) {
        //                                                     textQueueData.on('value', function (textDataSnap) {
        //                                                         if(textDataSnap.val()._state === 'text_error'){
        //                                                             blockUI.stop();
        //                                                         }
        //                                                         if(textDataSnap.val()._state === 'text_completed'){
        //                                                             blockUI.stop();
        //                                                             Text.markTextSent(orderProcessingData.val().orderId,'orderPlacedLocal',cart.localId);
        //                                                             if(cart.discountPresent ===true && cart.discountPresent !== undefined && cart.discountPresent !== null ) {
        //                                                                 if(cart.discountType === 'general'){
        //                                                                     // Increase count of general
        //                                                                     Discount.markDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                                 } else {
        //                                                                     if(cart.discountType === 'specialMarriott') {
        //                                                                         // We will do something later
        //                                                                     } else {
        //                                                                         // Mark the special code used
        //                                                                         Discount.markSpecialDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                                     }
        //                                                                 }
        //                                                             }
        //
        //                                                             if (cart.giftCardPresent) {
        //                                                                 Giftcard.markGiftCardPayment(cart.giftcardCode, orderProcessingData.val().orderId, {
        //                                                                     amount: cart.giftCardAmount
        //                                                                 })
        //                                                             }
        //
        //                                                             Cart.setUserCart(null);
        //                                                             var orderD = {};
        //                                                             orderD.status = 'paymentSuccess';
        //                                                             orderD.orderId = orderProcessingData.val().orderId;
        //                                                             $modalInstance.close(orderD);
        //                                                         }
        //                                                     })
        //                                                 })
        //                                             } else {
        //                                                 if(cart.discountPresent ===true && cart.discountPresent !== undefined && cart.discountPresent !== null ) {
        //
        //                                                     if(cart.discountType === 'general'){
        //                                                         // Increase count of general
        //                                                         Discount.markDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                     } else {
        //                                                         if(cart.discountType === 'specialMarriott') {
        //                                                             // We will do something later
        //                                                         } else {
        //                                                             // Mark the special code used
        //                                                             Discount.markSpecialDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                         }
        //                                                     }
        //                                                 }
        //
        //                                                 if (cart.giftCardPresent) {
        //                                                     Giftcard.markGiftCardPayment(cart.giftcardCode, orderProcessingData.val().orderId, {
        //                                                         amount: cart.giftCardAmount
        //                                                     })
        //                                                 }
        //                                                 blockUI.stop();
        //                                             }
        //                                         }
        //                                     });
        //                                 });
        //                             }
        //                         });
        //                     });
        //                 }
        //             });
        //         });
        //     } else {
        //         Payment.getToken(data).then(function (queueData) {
        //             queueData.on('value', function (dataSnapshot) {
        //                 if(dataSnapshot.val()._state === 'client_token_error'){
        //                     CoreService.toastError(gettextCatalog.getString(
        //                         'Error!'), gettextCatalog.getString(
        //                         'Try again!'));
        //                 }
        //
        //                 if(dataSnapshot.val()._state === 'client_token_finished'){
        //                     braintree.setup(dataSnapshot.val().clientToken, "dropin", {
        //                         container: "payment-form",
        //                         paymentMethodNonceReceived : function (event, nonce) {
        //                             blockUI.start('Processing Payment ...');
        //
        //                             var transactionData = {userId : auth.uid};
        //                             transactionData.nonceFromClient = nonce;
        //                             transactionData.amountToBeCharged = Math.round(Cart.getUserCart().total * 100) / 100;
        //                             transactionData["_start"] = "transaction";
        //
        //                             Payment.processPayment(transactionData).then(function (checkoutQueueData) {
        //                                 checkoutQueueData.on('value', function (processingData) {
        //                                     if(processingData.val()._state === 'checkout_error'){
        //                                         //Implement logic to backtrack order
        //                                         blockUI.stop();
        //                                         CoreService.toastError(gettextCatalog.getString(
        //                                             'Error processing order!'), gettextCatalog.getString(
        //                                             'Please try again!'));
        //                                     }
        //                                     if(processingData.val()._state === 'checkout_finished'){
        //                                         //Update Order with transaction details
        //                                         if(processingData.val().result.success === true){
        //                                             var orderData = {};
        //                                             //Lets not put the entire products within cart this has to change to only GigId later
        //
        //                                             if(cart.location !== null && cart.location !== undefined){
        //                                                 orderData.locationGeometry = {};
        //                                                 orderData.locationGeometry.latitude = cart.location[0].geometry.location.lat();
        //                                                 orderData.locationGeometry.longitude = cart.location[0].geometry.location.lng();
        //
        //                                                 delete cart.location[0].geometry.location;
        //                                                 orderData.locationData = cart.location[0];
        //                                             }
        //
        //
        //                                             orderData.order = cart;
        //                                             orderData.order.transaction = processingData.val().result;
        //                                             orderData.travelerId = auth.uid;
        //                                             orderData.order.timePlaced = Firebase.ServerValue.TIMESTAMP;
        //
        //                                             orderData["_start"] = "START";
        //
        //                                             Orders.createOrder(orderData).then(function (orderProcessQueueDataRef) {
        //                                                 orderProcessQueueDataRef.on('value', function (orderProcessingData) {
        //                                                     if(orderProcessingData.val()._state === 'ERROR'){
        //                                                         blockUI.stop();
        //                                                         CoreService.toastError(gettextCatalog.getString(
        //                                                             'Error processing order!'), gettextCatalog.getString(
        //                                                             'Try again!'));
        //                                                     }
        //                                                     if(orderProcessingData.val()._state === 'FINISHED'){
        //
        //                                                         var orderConversationData = {};
        //                                                         orderConversationData.orderId = orderProcessingData.val().orderId;
        //                                                         orderConversationData.dateCreated = Firebase.ServerValue.TIMESTAMP;
        //                                                         orderConversationData["_start"] = "OC_START";
        //                                                         orderConversationData.travelerId = auth.uid;
        //                                                         orderConversationData.localId = cart.localId;
        //
        //                                                         Orders.createOrderConversationQueue(orderConversationData).then(function (ocQueueData) {
        //                                                             ocQueueData.on('value', function (ocData) {
        //                                                                 if(ocData.val()._state === 'OC_ERROR'){
        //                                                                     blockUI.stop();
        //                                                                     CoreService.toastError(gettextCatalog.getString(
        //                                                                         'Error processing order!'), gettextCatalog.getString(
        //                                                                         'Please contact support!'));
        //                                                                 }
        //                                                                 if(ocData.val()._state === 'OC_FINISHED'){
        //                                                                     var orderQuestionnaireData = {};
        //                                                                     orderQuestionnaireData.orderId = orderProcessingData.val().orderId;
        //                                                                     orderQuestionnaireData.dateCreated = Firebase.ServerValue.TIMESTAMP;
        //                                                                     orderQuestionnaireData["_start"] = "OQ_START";
        //                                                                     orderQuestionnaireData.travelerId = auth.uid;
        //                                                                     orderQuestionnaireData.localId = cart.localId;
        //
        //                                                                     Orders.createOrderQuestionnaireQueue(orderQuestionnaireData).then(function (oqQueueData) {
        //                                                                         oqQueueData.on('value', function (oqData) {
        //                                                                             if(oqData.val()._state === 'OQ_ERROR'){
        //                                                                                 blockUI.stop();
        //                                                                                 CoreService.toastError(gettextCatalog.getString(
        //                                                                                     'Error processing order!'), gettextCatalog.getString(
        //                                                                                     'Please contact support!'));
        //                                                                             }
        //                                                                             if(oqData.val()._state === 'OQ_FINISHED'){
        //
        //                                                                                 blockUI.stop();
        //                                                                                 orderData.orderId = orderProcessingData.val().orderId;
        //                                                                                 Orders.orderCompleteInformLocal(orderData);
        //                                                                                 Orders.orderCompleteInformTJ(orderData);
        //                                                                                 Orders.orderCompleteInformTraveler(orderData);
        //                                                                                 Orders.orderCompleteInformYLC(orderData);
        //                                                                                 Orders.orderQuestionnaireInformTraveler(orderQuestionnaireData);
        //
        //                                                                                 //TODO EMAIL CONFIRMATION SENT TO USER ABOUT PAYMENT
        //                                                                                 Cart.setUserCart(null);
        //                                                                                 var orderD = {};
        //                                                                                 orderD.status = 'paymentSuccess';
        //                                                                                 orderD.orderId = orderProcessingData.val().orderId;
        //                                                                                 $modalInstance.close(orderD);
        //
        //                                                                                 var textData = {};
        //
        //                                                                                 var localPhone = localData.getUserPhoneNumber();
        //                                                                                 if(localPhone !== null && localPhone !== undefined && localPhone !== ''){
        //                                                                                     textData.phoneNumber = localPhone;
        //                                                                                     textData.localId = cart.localId;
        //                                                                                     textData.textType = 'orderPlaced';
        //                                                                                     textData.orderId = orderProcessingData.val().orderId;
        //                                                                                     textData["_start"] = "text_start";
        //                                                                                     Text.sendText(textData).then(function (textQueueData) {
        //                                                                                         textQueueData.on('value', function (textDataSnap) {
        //                                                                                             if(textDataSnap.val()._state === 'text_error'){
        //                                                                                                 blockUI.stop();
        //                                                                                             }
        //                                                                                             if(textDataSnap.val()._state === 'text_completed'){
        //                                                                                                 blockUI.stop();
        //                                                                                                 Text.markTextSent(orderProcessingData.val().orderId,'orderPlacedLocal',cart.localId);
        //                                                                                                 if(cart.discountPresent ===true && cart.discountPresent !== undefined && cart.discountPresent !== null ) {
        //                                                                                                     if(cart.discountType === 'general'){
        //                                                                                                         // Increase count of general
        //                                                                                                         Discount.markDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                                                                     } else {
        //                                                                                                         if(cart.discountType === 'specialMarriott') {
        //                                                                                                             // We will do something later
        //                                                                                                         } else {
        //                                                                                                             if(cart.discountType === 'specialMarriott') {
        //                                                                                                                 // We will do something later
        //                                                                                                             } else {
        //                                                                                                                 // Mark the special code used
        //                                                                                                                 Discount.markSpecialDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                                                                             }
        //                                                                                                         }
        //                                                                                                     }
        //                                                                                                 }
        //
        //                                                                                                 if (cart.giftCardPresent) {
        //                                                                                                     Giftcard.markGiftCardPayment(cart.giftcardCode, orderProcessingData.val().orderId, {
        //                                                                                                         amount: cart.giftCardAmount
        //                                                                                                     })
        //                                                                                                 }
        //
        //                                                                                                 Cart.setUserCart(null);
        //                                                                                                 var orderD = {};
        //                                                                                                 orderD.status = 'paymentSuccess';
        //                                                                                                 orderD.orderId = orderProcessingData.val().orderId;
        //                                                                                                 $modalInstance.close(orderD);
        //                                                                                             }
        //                                                                                         })
        //                                                                                     })
        //                                                                                 } else {
        //                                                                                     if(cart.discountPresent ===true && cart.discountPresent !== undefined && cart.discountPresent !== null ) {
        //                                                                                         if(cart.discountType === 'general'){
        //                                                                                             // Increase count of general
        //                                                                                             Discount.markDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                                                         } else {
        //                                                                                             if(cart.discountType === 'specialMarriott') {
        //                                                                                                 // We will do something later
        //                                                                                             } else {
        //                                                                                                 // Mark the special code used
        //                                                                                                 Discount.markSpecialDiscountForOrder(cart.discountCode,orderProcessingData.val().orderId);
        //                                                                                             }
        //                                                                                         }
        //                                                                                     }
        //
        //                                                                                     if (cart.giftCardPresent) {
        //                                                                                         Giftcard.markGiftCardPayment(cart.giftcardCode, orderProcessingData.val().orderId, {
        //                                                                                             amount: cart.giftCardAmount
        //                                                                                         })
        //                                                                                     }
        //                                                                                     blockUI.stop();
        //                                                                                 }
        //                                                                             }
        //                                                                         });
        //                                                                     });
        //                                                                 }
        //                                                             });
        //                                                         });
        //                                                     }
        //                                                 });
        //                                             });
        //                                         } else {
        //                                             blockUI.stop();
        //                                             CoreService.toastError(gettextCatalog.getString(
        //                                                 'Error processing order!'), gettextCatalog.getString(
        //                                                 'Please try again or contact support!'));
        //                                         }
        //                                     }
        //                                 })
        //                             })
        //                         }
        //                     });
        //                 }
        //             });
        //         });
        //     }
        //
        //
        // }

        // TO DELETE
        // Orders.createOrder(orderData).then(function(orderProcessQueueDataRef) {
        //     orderProcessQueueDataRef.on('value', function(orderProcessingData) {
        //         if (orderProcessingData.val()._state === 'ERROR') {
        //             blockUI.stop();
        //             CoreService.toastError(gettextCatalog.getString(
        //                 'Error processing order!'), gettextCatalog.getString(
        //                 'Try again!'));
        //             console.log('error')
        //         }
        //         if (orderProcessingData.val()._state === 'FINISHED') {
        //             var orderId = orderProcessingData.val().orderId;
        //             Gigs.getOrderGigs(orderId).$loaded(function(gigData) {
        //                 var location = '';
        //
        //                 try {
        //                     location = cart.location[0].formatted_address
        //                 } catch (e) {
        //
        //                 }
        //
        //                 /**
        //                  * Sending orderConfirmation Traveler
        //                  */
        //                 sendEmail({
        //                     "orderConfirmationTravelerEmail": true,
        //                     "local": localObj.firstName,
        //                     "traveler": travelerObj.firstName,
        //                     "location": location,
        //                     "gigsArray": gigData,
        //                     "serviceCharge": "0",
        //                     "total": cart.total,
        //                     "sendEmailTo": travelerObj.email || 'tejas.bhatt121@gmail.com'
        //                 }, function(error) {
        //                     if (error) {
        //                         alert('Something went wrong in sending the email to traveler')
        //                     }
        //
        //                     /**
        //                      * Sending orderConfirmationMail to local
        //                      */
        //                     sendEmail({
        //                         "orderConfirmationEmail": true,
        //                         "local": localObj.firstName,
        //                         "traveler": travelerObj.firstName,
        //                         "orderId": orderId,
        //                         "travelFrom": "Questionnaire form not yet filled",
        //                         "travelTo": "Questionnaire form not yet filled",
        //                         "gigsArray": gigData,
        //                         "sendEmailTo": localObj.email || 'tejas.bhatt121@gmail.com'
        //                     }, function(error) {
        //                         if (error) {
        //                             alert('Something went wrong in sending the email to local')
        //                         }
        //
        //                         /**
        //                          * Sending confirmation email to YLC
        //                          */
        //                         sendEmail({
        //                             "orderConfirmationYLCEmail": true,
        //                             "local": localObj.firstName,
        //                             "traveler": travelerObj.firstName,
        //                             "location": location,
        //                             "gigsArray": gigData,
        //                             "serviceCharge": "0",
        //                             "total": cart.total,
        //                             "sendEmailTo": 'tejas.bhatt121@gmail.com'
        //                         }, function(error) {
        //                             if (error) {
        //                                 alert('Something went wrong in sending email to YLC')
        //                             }
        //
        //                             sendText({
        //                                 "orderId": orderId,
        //                                 "localId": cart.localId
        //                             }, function(error) {
        //                                 if (error) {
        //                                     alert('Something went wrong in sending the text to local')
        //                                 }
        //
        //                                 if (cart.discountPresent === true && cart.discountPresent !== undefined && cart.discountPresent !== null) {
        //                                     if (cart.discountType === 'general') {
        //                                         // Increase count of general
        //                                         Discount.markDiscountForOrder(cart.discountCode, orderProcessingData.val().orderId);
        //                                     } else {
        //                                         if (cart.discountType === 'specialMarriott') {
        //                                             // We will do something later
        //                                         } else {
        //                                             // Mark the special code used
        //                                             Discount.markSpecialDiscountForOrder(cart.discountCode, orderProcessingData.val().orderId);
        //                                         }
        //                                     }
        //                                 }
        //
        //                                 if (cart.giftCardPresent) {
        //                                     Giftcard.markGiftCardPayment(cart.giftcardCode, orderProcessingData.val().orderId, {
        //                                         amount: cart.giftCardAmount
        //                                     })
        //                                 }
        //
        //                                 var orderD = {};
        //                                 orderD.status = 'paymentSuccess';
        //                                 orderD.data = orderProcessingData.val();
        //
        //                                 blockUI.stop();
        //
        //                                 $modalInstance.close(orderD);
        //                             });
        //                         })
        //                     })
        //                 });
        //             });
        //         }
        //     })
        // });

        $scope.cancel = function () {
            var orderD = {};
            orderD.status = 'cancel';
            $modalInstance.close(orderD);
        };

        if (Cart.getUserCart()) {
            var data = { userId: auth.uid };
            data["_start"] = "client_token";

            $scope.total = Math.round(Cart.getUserCart().total * 100) / 100;

            var cart = Cart.getUserCart();

            // console.log("THIS IS STRUNG");
            //
            // console.log(cart.location[0].geometry.location.lat())
            //
            // console.log(cart.location[0].geometry.location.lng())

            var localObj = User(cart.localId);
            var travelerObj = User(data.userId);

            if (cart.location === null || cart.location === undefined) {
                CoreService.toastError(gettextCatalog.getString(
                    'Please search a location!'), gettextCatalog.getString(
                    'Please search a location and try again!'));
                var orderD = {};
                orderD.status = 'noLocation';
                $modalInstance.close(orderD);
            }

            if (cart.isAFreeGig === true && cart.isAFreeGig !== undefined && cart.isAFreeGig !== null) {

                var orderData = {};
                orderData.order = cart;
                orderData.order.transaction = { transactionType: 'free' };
                orderData.travelerId = auth.uid;
                orderData.order.bookingSource = 'ylc';
                orderData.order.timePlaced = Firebase.ServerValue.TIMESTAMP;
                if(cart.location !== null && cart.location !== undefined){
                    orderData.locationGeometry = {};
                    // orderData.locationGeometry.latitude = cart.location[0].geometry.location.lat();
                    // orderData.locationGeometry.longitude = cart.location[0].geometry.location.lng();
                    // console.log(cart.location[0].geometry.location.lng())
                    orderData.locationGeometry.latitude = 19.0759837;
                    orderData.locationGeometry.longitude = 72.87765590000004;

                    // delete cart.location[0].geometry.location;
                    orderData.locationData = cart.location[0];
                }
                orderData["_start"] = "START";
                processOrder(orderData);

            } else {
                Payment.getToken(data).then(function(queueData) {
                    queueData.on('value', function(dataSnapshot) {
                        if (dataSnapshot.val()._state === 'client_token_error') {
                            CoreService.toastError(gettextCatalog.getString(
                                'Error!'), gettextCatalog.getString(
                                'Try again!'));
                        }

                        if (dataSnapshot.val()._state === 'client_token_finished') {
                            braintree.setup(dataSnapshot.val().clientToken, "dropin", {
                                container: "payment-form",
                                paymentMethodNonceReceived: function(event, nonce) {
                                    blockUI.start('Processing Payment ...');

                                    var transactionData = { userId: auth.uid };
                                    transactionData.nonceFromClient = nonce;
                                    transactionData.amountToBeCharged = Math.round(Cart.getUserCart().total * 100) / 100;
                                    transactionData["_start"] = "transaction";

                                    Payment.processPayment(transactionData).then(function(checkoutQueueData) {
                                        checkoutQueueData.on('value', function(processingData) {
                                            if (processingData.val()._state === 'checkout_error') {
                                                //Implement logic to backtrack order
                                                blockUI.stop();
                                                CoreService.toastError(gettextCatalog.getString(
                                                    'Error processing order!'), gettextCatalog.getString(
                                                    'Please try again!'));
                                            }
                                            if (processingData.val()._state === 'checkout_finished') {
                                                //Update Order with transaction details
                                                if (processingData.val().result.success === true) {
                                                    var orderData = {};
                                                    //Lets not put the entire products within cart this has to change to only GigId later
                                                    orderData.order = cart;
                                                    orderData.order.transaction = processingData.val().result;
                                                    orderData.travelerId = auth.uid;
                                                    orderData.order.bookingSource = 'ylc';
                                                    orderData.order.timePlaced = Firebase.ServerValue.TIMESTAMP;
                                                    if(cart.location !== null && cart.location !== undefined){
                                                        orderData.locationGeometry = {};
                                                        // orderData.locationGeometry.latitude = cart.location[0].geometry.location.lat();
                                                        // orderData.locationGeometry.longitude = cart.location[0].geometry.location.lng();

                                                        orderData.locationGeometry.latitude = 19.0759837;
                                                        orderData.locationGeometry.longitude = 72.87765590000004;

                                                        // delete cart.location[0].geometry.location;
                                                        orderData.locationData = cart.location[0];
                                                    }

                                                    orderData["_start"] = "START";

                                                    processOrder(orderData)

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
        } else {
            $state.go('home');
        }

        function processOrder(orderData) {
            Orders.createOrder(orderData).then(function(orderProcessQueueDataRef) {
                orderProcessQueueDataRef.on('value', function(orderProcessingData) {
                    if (orderProcessingData.val()._state === 'ERROR') {
                        blockUI.stop();
                        CoreService.toastError(gettextCatalog.getString(
                            'Error processing order!'), gettextCatalog.getString(
                            'Try again!'));
                    }
                    if (orderProcessingData.val()._state === 'FINISHED') {
                        var orderId = orderProcessingData.val().orderId;
                        Gigs.getOrderGigs(orderId).$loaded(function(gigData) {
                            var location = '';

                            try {
                                location = cart.location[0].formatted_address
                            } catch (e) {

                            }

                            /**
                             * Sending orderConfirmation Traveler
                             */
                            sendEmail({
                                "orderConfirmationTravelerEmail": true,
                                "local": localObj.firstName,
                                "traveler": travelerObj.firstName,
                                "location": location,
                                "gigsArray": gigData,
                                "serviceCharge": "0",
                                "total": cart.total,
                                "orderData" : orderData,
                                "sendEmailTo": travelerObj.email || 'tejas.bhatt121@gmail.com'
                            }, function(error) {
                                if (error) {
                                    alert('Something went wrong in sending the email to traveler')
                                }

                                /**
                                 * Sending orderConfirmationMail to local
                                 */
                                sendEmail({
                                    "orderConfirmationEmail": true,
                                    "local": localObj.firstName,
                                    "traveler": travelerObj.firstName,
                                    "orderId": orderId,
                                    "location": location,
                                    "travelFrom": "Questionnaire form not yet filled",
                                    "travelTo": "Questionnaire form not yet filled",
                                    "gigsArray": gigData,
                                    "orderData" : orderData,
                                    "sendEmailTo": localObj.email || 'tejas.bhatt121@gmail.com'
                                }, function(error) {
                                    if (error) {
                                        alert('Something went wrong in sending the email to local')
                                    }

                                    /**
                                     * Sending confirmation email to YLC
                                     */
                                    sendEmail({
                                        "orderConfirmationYLCEmail": true,
                                        "local": localObj.firstName,
                                        "traveler": travelerObj.firstName,
                                        "location": location,
                                        "gigsArray": gigData,
                                        "orderData" : orderData,
                                        "serviceCharge": "0",
                                        "total": cart.total,
                                        "sendEmailTo": 'info@yourlocalcousin.com'
                                    }, function(error) {
                                        if (error) {
                                            alert('Something went wrong in sending email to YLC')
                                        }

                                        sendText({
                                            "orderId": orderId,
                                            "localId": cart.localId
                                        }, function(error) {
                                            if (error) {
                                                blockUI.stop();
                                                alert('Something went wrong in sending the text to local')
                                            }
                                            if (cart.discountPresent === true && cart.discountPresent !== undefined && cart.discountPresent !== null) {
                                                if (cart.discountType === 'general') {
                                                    // Increase count of general
                                                    Discount.markDiscountForOrder(cart.discountCode, orderProcessingData.val().orderId);
                                                } else {
                                                    if (cart.discountType === 'specialMarriott') {
                                                        // We will do something later
                                                    } else {
                                                        // Mark the special code used
                                                        Discount.markSpecialDiscountForOrder(cart.discountCode, orderProcessingData.val().orderId);
                                                    }
                                                }
                                            }

                                            if (cart.giftCardPresent) {
                                                Giftcard.markGiftCardPayment(cart.giftcardCode, orderProcessingData.val().orderId, {
                                                    amount: cart.giftCardAmount
                                                })
                                            }
                                            var orderD = {};
                                            orderD.status = 'paymentSuccess';
                                            orderD.data = orderProcessingData.val();

                                            blockUI.stop();
                                            $modalInstance.close(orderD);
                                        })
                                    })
                                })
                            });
                        });
                    }
                })
            });
        }

        function sendEmail(data, callback) {
            FeathersEmail.create(data).then(function(response) {
                callback(null, response);
            }).catch(function(error) {
                callback(error);
            })
        }

        function sendText(data, callback) {
            var req = {
                method: 'POST',
                url: YLC_API + 'texts',
                data: data
            };
            $http(req).then(function(response) {
                callback(null, response);
            }).catch(function(error) {
                callback(error)
            });
        }


    });
