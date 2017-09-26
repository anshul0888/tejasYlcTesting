/**
 * Created by TJ on 5/7/16.
 */

(function() {
    angular.module('com.ylc.giftcard', [])
        .factory('Giftcard',function($http,YLC_API){
            var Giftcard = {
                checkGiftCardCode : function (code) {

                    // hit the feathers service to check the amount available in this giftcode

                    return new Promise(function (resolve, reject) {
                        $http.get(YLC_API + 'giftcards/' + code).then(function(response) {
                            resolve(response);
                        }, function(rejectionResponse) {
                            reject(rejectionResponse);
                        });
                    });
                },
                markGiftCardPayment : function (code, orderId, giftCardDetails) {

                    return new Promise( function(resolve, reject) {
                        $http.put(YLC_API + 'giftcards/' + code, giftCardDetails).then(function(response) {
                            $firebaseObject(OrdersRef.child(orderId).child('giftCardUsed')).$save().then(function (ref) {
                                ref.set(code);
                                resolve(response);
                            })
                        }, function(rejectionResponse) {
                            reject(rejectionResponse);
                        });
                    });
                }
            };
            return Giftcard;
        });
})();