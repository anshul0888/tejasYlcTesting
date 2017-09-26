angular.module('com.ylc.core').controller('GiftcardPaymentConfirmationCtrl', 
    function ($scope, Cart, $modalInstance) {

        $scope.userCart = Cart.getUserCart();
        $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
        $scope.userCart.total += $scope.serviceCharge;

        $scope.processPayment = function() {
            if (Cart.getUserCart().total > 0 || ($scope.fullDiscount !== null && $scope.fullDiscount !== undefined && $scope.fullDiscount === true)) {
                $modalInstance.close('confirmed');
            } else {
                CoreService.toastError(
                    gettextCatalog.getString('Choose a service!'),
                    gettextCatalog.getString('Can\'t proceed without choosing a service!'));
            }
        };

        $scope.cancel = function() {
            $modalInstance.close('canceled');
        };

    });

