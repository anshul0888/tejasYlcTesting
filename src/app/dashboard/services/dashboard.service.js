/**
 * Created by TJ on 7/8/15.
 */

var app = angular.module('com.ylc.dashboard');

app.factory('Dashboard',['$firebaseArray','$firebaseObject','UsersRef','GigsRef','PhotosRef','OrdersRef','ArrayWithSum','User','ConversationsRef',
                            'EmailOrderDeclinedTravelerQueueRef','EmailOrderDeclinedYLCQueueRef','EmailOrderDeclinedTJQueueRef',
                            'RatingsRef','TestimonialsRef','$state','EmailOrderCompletedTravelerQueueRef','EmailOrderAcceptedTravelerQueueRef',
    function($firebaseArray,$firebaseObject,UsersRef,GigsRef,PhotosRef,OrdersRef,ArrayWithSum,User,ConversationsRef,
             EmailOrderDeclinedTravelerQueueRef,EmailOrderDeclinedYLCQueueRef,EmailOrderDeclinedTJQueueRef,RatingsRef,TestimonialsRef,$state,
             EmailOrderCompletedTravelerQueueRef,EmailOrderAcceptedTravelerQueueRef){
        var Dashboard = {
            tripsGiven : function (uid) {
                return UsersRef.child(uid).child('tripsGiven');
            },
            tripsTaken : function (uid) {
                return UsersRef.child(uid).child('tripsBooked');
            },
            getLocalOrders : function(userId){
                if (userId) {
                    var refOrders = new Firebase.util.NormalizedCollection(
                        [UsersRef.child(userId).child('tripsGiven'),"localTrips"],
                        [OrdersRef,"orders"]
                    ).select(
                        "orders.gigs",
                        "orders.total",
                        "orders.localId",
                        "orders.travelerId",
                        "orders.location",
                        "orders.ratings",
                        "orders.completed",
                        "orders.status",
                        "orders.timePlaced",
                        "orders.localCompletedOrder",
                        "orders.specialItinerary",
                        "orders.specialConversation"
                    ).ref();

                    return $firebaseArray(refOrders);
                }
                else {
                    return null;
                }
            },
            getTravelersOrders : function (userId) {
                if (userId) {
                    var refOrders = new Firebase.util.NormalizedCollection(
                        [UsersRef.child(userId).child('tripsBooked'),"travelerTrips"],
                        [OrdersRef,"orders"]
                    ).select(
                        "orders.gigs",
                        "orders.total",
                        "orders.localId",
                        "orders.travelerId",
                        "orders.location",
                        "orders.ratings",
                        "orders.completed",
                        "orders.timePlaced",
                        "orders.localCompletedOrder",
                        "orders.status",
                        "orders.specialItinerary",
                        "orders.specialConversation"
                    ).ref();

                    return $firebaseArray(refOrders);
                }
                else {
                    return null;
                }
            },
            getTotalForTraveler : function (userId) {
                var refOrders = new Firebase.util.NormalizedCollection(
                    [UsersRef.child(userId).child('tripsBooked'),"travelerTrips"],
                    [OrdersRef,"orders"]
                ).select(
                    {"key":"orders.total","alias":"count"}
                ).ref();

                return new ArrayWithSum(refOrders);

            },
            getTotalForLocal : function (userId) {
                if (userId) {
                    var refOrders = new Firebase.util.NormalizedCollection(
                        [UsersRef.child(userId).child('tripsGiven'),"localTrips"],
                        [OrdersRef,"orders"]
                    ).select(
                        {"key":"orders.total","alias":"count"}
                    ).ref();

                    return new ArrayWithSum(refOrders);
                }
                else {
                    return null;
                }
            },
            getTotalOrdersPending : function (userId) {
                if (userId) {
                    var refOrders = new Firebase.util.NormalizedCollection(
                        [UsersRef.child(userId).child('orders'),"localOrders"],
                        [OrdersRef,"orders"]
                    ).select(
                        "orders.$key",
                        "orders.localCompletedOrder"
                    ).ref();

                    return refOrders;
                }
                else {
                    return null;
                }
            },
            setLocalOrderRating : function (orderId) {
                return $firebaseObject(OrdersRef.child(orderId).child('ratings').child('localRatingValue'));
            },
            setTravelerOrderRating : function (orderId) {
                return $firebaseObject(OrdersRef.child(orderId).child('ratings').child('travelerRatingValue'));
            },
            setLocalRating : function (localId,rating,travelerId,orderId) {
                $firebaseArray(RatingsRef).$add({ratingValue : rating, ratedBy : travelerId, ratingDateTime : Firebase.ServerValue.TIMESTAMP,orderId : orderId}).then(function (ratingRef) {
                    $firebaseObject(UsersRef.child(localId).child('ratings').child(ratingRef.key())).$save().then(function (ref) {
                        ref.set(true);
                    })
                });
            },
            setLocalTestimonial : function (orderId,testimonial,travelerId,localId) {
                $firebaseArray(TestimonialsRef).$add({testimonialValue : testimonial, testimonialBy : travelerId, testimonialDateTime : Firebase.ServerValue.TIMESTAMP,orderId : orderId}).then(function (testimonialRef) {
                    $firebaseObject(UsersRef.child(localId).child('testimonials').child(testimonialRef.key())).$save().then(function (ref) {
                        ref.set(true);
                    })
                });
            },
            setTravelerOrderRated : function (orderId) {
                return $firebaseObject(OrdersRef.child(orderId).child('ratings').child('travelerRated'));
            },
            setLocalOrderRated : function (orderId) {
                return $firebaseObject(OrdersRef.child(orderId).child('ratings').child('localRated'));
            },
            setOrderTestimonial : function (orderId) {
                return $firebaseObject(OrdersRef.child(orderId).child('ratings').child('testimonialValue'));
            },
            setOrderTestimonialGiven : function (orderId) {
                return $firebaseObject(OrdersRef.child(orderId).child('ratings').child('testimonialGiven'));
            },
            getOrdersRating : function (orderId) {

            },
            getTotalOrdersCompleted : function (userId) {
                if (userId) {
                    var refOrders = new Firebase.util.NormalizedCollection(
                        [UsersRef.child(userId).child('orders'),"localTrips"],
                        [OrdersRef,"orders"]
                    ).select(
                        "orders.localCompletedOrder",
                        "orders.status"
                    ).ref();

                    return refOrders;
                }
                else {
                    return null;
                }
            },
            getGigs : function (orderId) {
                return $firebaseArray(OrdersRef.child(orderId).child('gigs'));
            },
            orderCompleted : function (orderId) {
               $firebaseObject(OrdersRef.child(orderId).child('localCompletedOrder')).$save().then(function (ref) {
                  ref.set(true);
               });
                $firebaseObject(OrdersRef.child(orderId).child('orderCompletedTime')).$save().then(function (refT) {
                    refT.set(Firebase.ServerValue.TIMESTAMP);

                });
                $firebaseObject(OrdersRef.child(orderId).child('status')).$save().then(function (refS) {
                    refS.set('COMPLETED');

                });
            },
            reopenOrder : function (orderId) {
                $firebaseObject(OrdersRef.child(orderId).child('localCompletedOrder')).$save().then(function (ref) {
                    ref.set(false);
                });
                $firebaseObject(OrdersRef.child(orderId).child('orderReopenedTime')).$save().then(function (refT) {
                    refT.set(Firebase.ServerValue.TIMESTAMP);

                });
                $firebaseObject(OrdersRef.child(orderId).child('status')).$save().then(function (refS) {
                    refS.set('ACCEPTED');

                });
            },
            declineOrderReason : function (reason,orderId) {
                $firebaseObject(OrdersRef.child(orderId).child('localDeclinedReason')).$save().then(function (ref) {
                    ref.set(reason);
                });
            },
            orderDeclinedSendEmailTraveler : function (data) {
                return $firebaseArray(EmailOrderDeclinedTravelerQueueRef.child('tasks')).$add(data);
            },
            orderDeclinedSendEmailYLC : function (data) {
                return $firebaseArray(EmailOrderDeclinedYLCQueueRef.child('tasks')).$add(data);
            },
            orderDeclinedSendEmailTJ : function (data) {
                return $firebaseArray(EmailOrderDeclinedTJQueueRef.child('tasks')).$add(data);
            },
            orderCompletedSendEmailTraveler : function (data) {
                return $firebaseArray(EmailOrderCompletedTravelerQueueRef.child('tasks')).$add(data);
            },
            orderAcceptedSendEmailTraveler : function (data) {
                return $firebaseArray(EmailOrderAcceptedTravelerQueueRef.child('tasks')).$add(data);
            },
            orderStatusChange : function (orderId,status) {
                $firebaseObject(OrdersRef.child(orderId).child('status')).$save().then(function (ref) {
                    ref.set(status);
                });

                $firebaseObject(OrdersRef.child(orderId).child('statusChangedTime')).$save().then(function (refC) {
                    refC.set(Firebase.ServerValue.TIMESTAMP);
                    $state.go('messages.conversation',{orderId : orderId});
                });
            },
            changeGigStatus : function (gigId, status, orderId) {
                $firebaseObject(OrdersRef.child(orderId).child('gigs').child(gigId).child('status')).$save().then(function (ref) {
                    ref.set(status);
                });

                $firebaseObject(OrdersRef.child(orderId).child('gigs').child(gigId).child('statusChangedTime')).$save().then(function (refC) {
                    refC.set(Firebase.ServerValue.TIMESTAMP);
                })
            },
            changeGigStatusText : function (gigId, statusText, orderId) {
                $firebaseObject(OrdersRef.child(orderId).child('gigs').child(gigId).child('statusText')).$save().then(function (ref) {
                    ref.set(statusText);
                })
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
            }
        };
        return Dashboard;

    }]);
