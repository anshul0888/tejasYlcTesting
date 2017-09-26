
angular.module('com.ylc.profile.create')
    .controller('CreateSuccessCtrl', function(CoreService,$state,authFB,profile,$scope,gettextCatalog,User,Profile) {

        $scope.profile = profile;


        profile.$bindTo($scope,"profile").then(function(){

        },function(error){

        });
    });
