(function() {
    'use strict';

    angular
        .module('com.ylc.payments')
        .controller('PaymentSuccessCtrl', PaymentSuccessCtrl);

    PaymentSuccessCtrl.$inject = ['$scope', '$stateParams', '$state', '$uibModal', 'CoreService', 'gettextCatalog', 'State', 'Gigs', 'Cart'];

    /* @ngInject */
    function PaymentSuccessCtrl($scope, $stateParams, $state, $uibModal,
        CoreService, gettextCatalog, State, Gigs, Cart) {

        $scope.heading = 'Your payment was successful';
        $scope.subheading = 'For customized advice please fill out your travel details next';
        $scope.continue = function() {
            Cart.setUserCart(null);
            // $modalInstance.close('successCompleted');
            $state.go('orders.newOrderConversation', {
                orderId: $stateParams.orderId
            });
        };

        $scope.cancel = function() {
            $state.go('orders.newOrderConversation', {
                orderId: $stateParams.orderId
            });
            // $modalInstance.close('successCanceled');
        };

    }
})();
