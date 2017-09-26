/**
 * Created by TJ on 7/8/15.
 */

var app = angular.module('com.ylc.search');

app.factory('Search',['$firebaseArray','$firebaseObject','UsersRef','GigsRef','PhotosRef','AdvisesRef','ComingSoonQueueRef','PhotosLocRef'
            ,function($firebaseArray,$firebaseObject,UsersRef,GigsRef,PhotosRef,AdvisesRef,ComingSoonQueueRef,PhotosLocRef){
    var Search = {
        getProfile : function(uid){
            return $firebaseObject(UsersRef.child(uid));
        },
        getVideos : function(uid){
            if (uid) {
                return $firebaseArray(UsersRef.child(uid).child("videos"));
            }
            else {
                return null;
            }
        },
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
                    "gigs.type",
                    "gigs.travelerDescription",
                    "gigs.isActive"
                ).ref();

                return $firebaseArray(refGigs);
            }
            else {
                return null;
            }
        },
        getUserSpecialGigs  : function(userId){
            if (userId) {
                var refSpecialGigs = new Firebase.util.NormalizedCollection(
                    [UsersRef.child(userId).child('gigs'),"userSpecialGigs"],
                    [GigsRef,"gigs"]
                ).select(
                    "gigs.title",
                    "gigs.description",
                    "gigs.gigsDisclaimer",
                    "gigs.freeTrialAvailable",
                    "gigs.charges",
                    "gigs.type",
                    "gigs.isActive"
                ).ref();

                return $firebaseArray(refSpecialGigs);
            }
            else {
                return null;
            }
        },
        getCoverPhotos : function(uid){
            if (uid) {
                var refPhotos = new Firebase.util.NormalizedCollection(
                    [UsersRef.child(uid).child('coverPhotos'),"userPhotos"],
                    [PhotosRef,"photos"]
                ).select(
                    "photos.url"
                ).ref();

                return $firebaseArray(refPhotos);
            }
            else {
                return null;
            }
        },
        getProfilePhotos : function(uid){
            if(uid){
                var refProfilePhotos = new Firebase.util.NormalizedCollection(
                    [UsersRef.child(uid).child('profilePhotos'),"profilePhotos"],
                    [PhotosRef,"photos"]
                ).select(
                    "photos.url"
                ).ref();

                return $firebaseArray(refProfilePhotos);
            }
        },
        getGig : function (gigId) {
            return $firebaseObject(GigsRef.child(gigId));
        },
        getGigAmount : function (gigId) {
            return $firebaseObject(GigsRef.child(gigId));
        },
        saveSearch : function(userId){
            if(userId){
            }
        },
        comingSoonQueue : function (data) {
            return $firebaseArray(ComingSoonQueueRef.child('tasks')).$add(data);
        },
        //,
        //getUserAdvises : function(uid){
        //    if(uid){
        //        var refUserAdvises = new Firebase.util.NormalizedCollection(
        //            [UsersRef.child(uid).child('advises'),"userAdvises"],
        //            [AdvisesRef,"advises"]
        //        ).select(
        //            "advises.type"
        //        ).ref();
        //
        //        return $firebaseArray(refUserAdvises);
        //    }
        //}
        addLocationPhoto : function(data){
            return $firebaseArray(PhotosLocRef.child('tasks')).$add(data);
        }
    };
    return Search;

}]);
