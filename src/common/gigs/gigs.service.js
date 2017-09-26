/**
 * Created by TJ on 8/27/15.
 */

(function() {
    angular.module('com.ylc.gigs', [])
        .factory('Gigs',function($firebaseArray,$firebaseObject,UsersRef,GigsRef,OrdersRef){
            var gigs = $firebaseArray(GigsRef);

            var Gigs = {
                getUserGigs  : function(userId){
                    if (userId) {
                        var refGigs = new Firebase.util.NormalizedCollection(
                            [UsersRef.child(userId).child('gigs'),"userGigs"],
                            [GigsRef,"gigs"]
                        ).select(
                            "gigs.title",
                            "gigs.description",
                            "gigs.gigsDisclaimer",
                            "gigs.freeTrialAvailable",
                            "gigs.charges",
                            "gigs.type"
                        ).ref();

                        return $firebaseArray(refGigs);
                    }
                    else {
                        return null;
                    }
                },
                getOrderGigs  : function(orderId){
                    if (orderId) {
                        var refGigs = new Firebase.util.NormalizedCollection(
                            [OrdersRef.child(orderId).child('gigs'),"orderGigs"],
                            [GigsRef,"gigs"]
                        ).select(
                            "gigs.title",
                            "gigs.description",
                            "gigs.gigsDisclaimer",
                            "gigs.freeTrialAvailable",
                            "gigs.charges",
                            "gigs.type"
                        ).ref();

                        return $firebaseArray(refGigs);
                    }
                    else {
                        return null;
                    }
                },
                allGigs : gigs,
                getGigAmount : function (gigId) {
                    return $firebaseObject(GigsRef.child(gigId));
                },
                addUserGigs : function(userId,gig){
                    return $firebaseObject(UsersRef.child(userId).child('gigs').child(gig)).$save();
                },
                removeUserGig : function(userId,gig){
                    return $firebaseObject(UsersRef.child(userId).child('gigs').child(gig)).$remove();
                },
                getGig : function (gigId) {
                    return $firebaseObject(GigsRef.child(gigId));
                }
            };
            return Gigs;
        });
})();