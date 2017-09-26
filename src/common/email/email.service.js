/**
 * Created by TJ on 8/27/15.
 */

(function() {
    angular.module('com.ylc.email', [])
        .factory('Email',function($firebaseArray,EmailServiceRef,UsersRef){
            var Email = {
                sendEmail : function(data){
                    return $firebaseArray(EmailServiceRef.child('tasks')).$add(data);
                },
                markEmailSent : function (orderId, type,userId) {
                    if(type === 'acceptOrder'){
                        UsersRef.child(userId).child('userContact').child(orderId).child('email').child('orderConfirmationEmailSent').set(true);
                        UsersRef.child(userId).child('userContact').child(orderId).child('email').child('orderConfirmationEmailSentTimeStamp').set(Firebase.ServerValue.TIMESTAMP);
                    }
                }
            };
            return Email;
        });
})();