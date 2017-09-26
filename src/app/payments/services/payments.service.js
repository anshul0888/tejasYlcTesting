/**
 * Created by TJ on 7/8/15.
 */

/**
 * Created by TJ on 7/8/15.
 */

var app = angular.module('com.ylc.payments');

app.factory('Payment',['$firebaseArray','$firebaseObject','UsersRef','OrdersRef','CoreService','gettextCatalog','Auth','PaymentTokenQueueRef','PaymentTransactionQueueRef',
    function($firebaseArray,$firebaseObject,UsersRef,OrdersRef,CoreService,gettextCatalog,Auth,PaymentTokenQueueRef,PaymentTransactionQueueRef){

        var Payment = {
            getToken : function(data){
                return $firebaseArray(PaymentTokenQueueRef.child('tasks')).$add(data);
            },
            processPayment : function(data){
                return $firebaseArray(PaymentTransactionQueueRef.child('tasks')).$add(data);
            }
        };
        return Payment;

    }]);

