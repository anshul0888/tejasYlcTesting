/**
 * Created by TJ on 5/7/16.
 */

(function() {
    angular.module('com.ylc.discounts', [])
        .factory('Discount',function($firebaseArray,$firebaseObject,DiscountsRef,UsersRef,OrdersRef){
            var Discount = {
                checkDiscountCode : function (code) {
                    return $firebaseObject(DiscountsRef.child(code))
                },
                markDiscountForOrder : function (code,orderId) {
                    return $firebaseObject(OrdersRef.child(orderId).child('discountUsed')).$save().then(function (ref) {
                        ref.set(code);
                    })
                },
                markSpecialDiscountForOrder : function (code,orderId) {
                    return $firebaseObject(OrdersRef.child(orderId).child('discountUsed')).$save().then(function (ref) {
                        ref.set(code,function (err) {
                            DiscountsRef.child(code).child('used').set(true);
                        });
                    })
                }
            };
            return Discount;
        });
})();