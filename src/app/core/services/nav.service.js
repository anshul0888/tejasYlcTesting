'use strict';

var app = angular.module('com.ylc.core');

app.factory('Navigation',function($firebaseArray,$firebaseObject,UsersRef,ConversationsRef,OrdersRef,UserStatusRef){

    var Navigation = {
        isUserLocal : function (userId) {
            return $firebaseObject(UsersRef.child(userId).child('isALocal'));
        },
        getUserConversations : function(userId){
            if (userId) {
                var refConversations = new Firebase.util.NormalizedCollection(
                    [UsersRef.child(userId).child('conversations'),"userConversations"],
                    [ConversationsRef,"conversations"]
                ).select(
                    "conversations.dateCreated",
                    "conversations.messages"
                ).ref();

                return refConversations;
            }
            else {
                return null;
            }
        },
        newMessages : function (uid) {
            return UserStatusRef.child(uid).child('messages');
        }


    };
    return Navigation;
});
