/**
 * Created by TJ on 10/9/15.
 */
(function() {
    angular.module('com.ylc.cart', [])
        .factory('Cart',[function(){
                var userCart;

                var Cart = {
                    setUserCart : function (cart) {
                        userCart = cart;
                    },
                    getUserCart : function () {
                        if(userCart){
                            return userCart;
                        }
                    }
                };
                return Cart;

        }]);
})();