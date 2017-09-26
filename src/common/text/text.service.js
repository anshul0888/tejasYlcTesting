/**
 * Created by TJ on 8/27/15.
 */

(function() {
    angular.module('com.ylc.text', [])
        .factory('Text',function($firebaseArray,TextServiceRef,UsersRef){

            var Text = {
                sendText : function(data){
                    return $firebaseArray(TextServiceRef.child('tasks')).$add(data);
                },
                markTextSent : function (orderId, type,userId) {
                    if(type === 'orderPlacedLocal'){
                        UsersRef.child(userId).child('userContact').child(orderId).child('text').child('orderConfirmationTextSent').set(true);
                        UsersRef.child(userId).child('userContact').child(orderId).child('text').child('orderConfirmationTextSentTimeStamp').set(Firebase.ServerValue.TIMESTAMP);
                    }
                }
            };
            return Text;
        });
})();