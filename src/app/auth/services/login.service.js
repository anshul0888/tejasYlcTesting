'use strict';

var app = angular.module('com.ylc.auth');

app.factory('Login',function($firebaseArray,$firebaseObject,UsersRef){

    var Login = {
        checkIfANoob : function(userId){
            return $firebaseObject(UsersRef.child(userId).child('noob'));
        },
        isUserLocal : function (userId) {
            return $firebaseObject(UsersRef.child(userId).child('isALocal'));
        }
    };
    return Login;
});
