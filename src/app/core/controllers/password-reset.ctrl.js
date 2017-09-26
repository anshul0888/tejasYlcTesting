/**
 * Created by TJ on 7/2/15.
 */

angular.module('com.ylc.core').controller('ResetPasswordCtrl', ['Auth','$scope','$state','SaveSearch','CoreService','gettextCatalog','Profile','User','Navigation','$stateParams','State'
    ,function (Auth,$scope,$state,SaveSearch,CoreService,gettextCatalog,Profile,User,Navigation,$stateParams,State) {

        if(Auth.$getAuth()){
            Auth.$unauth()
        }

        $scope.changeUserPassword = function () {
            if(($scope.password !== null && $scope.password !== undefined) && ($scope.confirmPassword !== null && $scope.confirmPassword !== undefined) && ($scope.oldPassword !== null && $scope.oldPassword !== undefined) && ($scope.email !== null && $scope.email !== undefined && $scope.email !== '')){
                if($scope.confirmPassword === $scope.password){
                        Auth.$changePassword(
                            {   email : $scope.email,
                                oldPassword : $scope.oldPassword,
                                newPassword : $scope.password
                            }).then(function() {
                                $scope.password = '';
                                $scope.oldPassword= '';
                                $scope.confirmPassword = '';
                                CoreService.toastSuccess(gettextCatalog.getString('Password Changed'),gettextCatalog.getString(''));
                                $state.go('signin');

                            }).catch(function(error) {
                                $scope.password = '';
                                $scope.oldPassword= '';
                                $scope.confirmPassword = '';
                                CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString(error));
                            })
                } else {
                    $scope.password = '';
                    $scope.oldPassword= '';
                    $scope.confirmPassword = '';
                    CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('Password and Confirm Password should match!'));
                }
            } else {
                $scope.password = '';
                $scope.oldPassword= '';
                $scope.confirmPassword = '';
                CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('All the fields are mandatory!'));
            }
        };

}]);
