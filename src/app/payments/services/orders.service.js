/**
 * Created by TJ on 7/8/15.
 */

var app = angular.module('com.ylc.payments');

app.factory('Orders',['$firebaseArray','$firebaseObject','UsersRef','GigsRef','PhotosRef','OrdersRef','CoreService','gettextCatalog','OrdersCreateQueueRef','OrdersUpdateQueueRef','OrdersConversationCreateQueueRef','OrdersQuestionnaireCreateQueueRef',
    'EmailOrderConfirmationYLCQueueRef','EmailOrderConfirmationTJQueueRef','EmailOrderConfirmationTravelerQueueRef','EmailOrderConfirmationLocalQueueRef',
    'EmailQuestionnaireLocalQueueRef','EmailQuestionnaireTravelerQueueRef','QuestionnairesRef',
    function($firebaseArray,$firebaseObject,UsersRef,GigsRef,PhotosRef,OrdersRef,CoreService,gettextCatalog,OrdersCreateQueueRef,OrdersUpdateQueueRef,OrdersConversationCreateQueueRef,OrdersQuestionnaireCreateQueueRef,
             EmailOrderConfirmationYLCQueueRef,EmailOrderConfirmationTJQueueRef,
             EmailOrderConfirmationTravelerQueueRef,EmailOrderConfirmationLocalQueueRef,EmailQuestionnaireLocalQueueRef
            ,EmailQuestionnaireTravelerQueueRef,QuestionnairesRef){
    var Orders = {
        createOrder : function(data){
            return $firebaseArray(OrdersCreateQueueRef.child('tasks')).$add(data);
        },
        updateOrder : function (data) {
            return $firebaseArray(OrdersUpdateQueueRef.child('tasks')).$add(data);
        },
        orderCompleteInformLocal : function (data) {
            return $firebaseArray(EmailOrderConfirmationLocalQueueRef.child('tasks')).$add(data);
        },
        orderCompleteInformTraveler : function (data) {
            return $firebaseArray(EmailOrderConfirmationTravelerQueueRef.child('tasks')).$add(data);
        },
        orderCompleteInformYLC : function (data) {
            return $firebaseArray(EmailOrderConfirmationYLCQueueRef.child('tasks')).$add(data);
        },
        orderCompleteInformTJ : function (data) {
            return $firebaseArray(EmailOrderConfirmationTJQueueRef.child('tasks')).$add(data);
        },
        orderQuestionnaireInformLocal : function (data) {
            return $firebaseArray(EmailQuestionnaireLocalQueueRef.child('tasks')).$add(data);
        },
        orderQuestionnaireInformTraveler : function (data) {
            return $firebaseArray(EmailQuestionnaireTravelerQueueRef.child('tasks')).$add(data);
        },
        createOrderConversationQueue : function (data) {
            return $firebaseArray(OrdersConversationCreateQueueRef.child('tasks')).$add(data);
        },
        createOrderQuestionnaireQueue : function (data) {
            return $firebaseArray(OrdersQuestionnaireCreateQueueRef.child('tasks')).$add(data);
        },
        getGigsData : function (orderId) {
            if (orderId) {
                var refGigs = new Firebase.util.NormalizedCollection(
                    [OrdersRef.child(orderId).child('gigs'),"selectedGigs"],
                    [GigsRef,"gigs"]
                ).select(
                    "gigs.charges",
                    "gigs.title",
                    "gigs.type",
                    "gigs.plans"
                ).ref();

                return $firebaseArray(refGigs);
            }
            else {
                return null;
            }
        }
    };
    return Orders;

}]);
