(function() {
    'use strict';

    angular
        .module('com.ylc.profile.view')
        .controller('PhotoCarouselCtrl', PhotoCarouselCtrl);

    PhotoCarouselCtrl.$inject = ['$scope', '$stateParams', '$state', '$uibModal', '$modalInstance', 'CoreService',
        'gettextCatalog', 'State', 'Gigs', 'Cart','profileId','Search'];

    /* @ngInject */
    function PhotoCarouselCtrl($scope, $stateParams, $state, $uibModal, $modalInstance,
                                     CoreService, gettextCatalog, State, Gigs, Cart,profileId,Search) {
        console.log(profileId);

        $scope.coverPhotos = Search.getCoverPhotos(profileId);

        $scope.cancel = function() {
            $modalInstance.close();
        };

    }
})();