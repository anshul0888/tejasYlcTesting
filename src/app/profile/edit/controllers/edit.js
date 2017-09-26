/**
 * Created by TJ on 8/28/15.
 */

var app = angular.module('com.ylc.profile.edit');

app.controller('EditCTRL',function(CoreService,$state,authED,profile,userIsALocal,$scope,gettextCatalog,gigs,Gigs,Profile){
    $scope.userIsALocal = userIsALocal;
});