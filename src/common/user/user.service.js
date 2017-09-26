/**
 * Created by TJ on 10/9/15.
 */
(function() {
    angular.module('com.ylc.user', [])
        .factory('User',['$firebaseObject','$firebaseArray','UsersRef','AdvisesRef', function($firebaseObject,$firebaseArray,UsersRef,AdvisesRef) {
            var User = $firebaseObject.$extend({
                getFullName: function() {
                    if(this.userType !== null && this.userType !== undefined && this.userType === 'yumigo_traveler'){
                        return this.name;
                    } else {
                        return this.firstName + " " + this.lastName;
                    }
                },
                getFirstName : function () {
                    return this.firstName
                },
                getUserEmail : function () {
                    return this.email
                },
                getUserProfilePhoto : function () {
                    if(this.userType !== null && this.userType !== undefined && this.userType === 'yumigo_traveler'){
                        return this.picture;
                    } else {
                        return this.profilePicture;
                    }
                },
                userIsALocal : function () {
                    return this.isALocal;
                },
                isLocalReady : function () {
                    return this.localIsReady;
                },
                getUserAdvises : function (uid) {
                    var refUserAdvises = new Firebase.util.NormalizedCollection(
                        [UsersRef.child(uid).child('advises'),"userAdvises"],
                        [AdvisesRef,"advises"]
                    ).select(
                        "advises.type"
                    ).ref();

                    return $firebaseArray(refUserAdvises);
                },
                getThreeUserAdvisesRandom : function (uid) {
                    var refUserAdvises = new Firebase.util.NormalizedCollection(
                        [UsersRef.child(uid).child('advises').limitToLast(3),"userAdvises"],
                        [AdvisesRef,"advises"]
                    ).select(
                        "advises.type"
                    ).ref();

                    return $firebaseArray(refUserAdvises);
                },
                localReady : function (userId) {
                    return UsersRef.child(userId).child('localIsReady');
                },
                //Local Ready
                localProfileComplete : function (userId) {
                    return UsersRef.child(userId).child('localProfileComplete');
                },
                localProfileCompleteDate : function (userId) {
                    return UsersRef.child(userId).child('localProfileCompleteDate');
                },
                //Local Create About Ready
                localProfileAboutComplete : function (userId) {
                    return UsersRef.child(userId).child('localProfileAboutComplete');
                },
                localProfileAboutCompleteDate : function (userId) {
                    return UsersRef.child(userId).child('localProfileAboutCompleteDate');
                },
                //Local Create Services Ready
                localProfileServicesComplete : function (userId) {
                    return UsersRef.child(userId).child('localProfileServicesComplete');
                },
                localProfileServicesCompleteDate : function (userId) {
                    return UsersRef.child(userId).child('localProfileServicesCompleteDate');
                },
                //Local Create Payments Ready
                localProfilePaymentsComplete : function (userId) {
                    return UsersRef.child(userId).child('localProfilePaymentsComplete');
                },
                localProfilePaymentsCompleteDate : function (userId) {
                    return UsersRef.child(userId).child('localProfilePaymentsCompleteDate');
                },

                //Local Edit About Ready
                localProfileAboutUpatedDate : function (userId) {
                    return UsersRef.child(userId).child('localProfileAboutUpatedDate');
                },
                //Local Edit Payments Ready
                localProfilePaymentsUpdatedDate: function (userId) {
                    return UsersRef.child(userId).child('localProfilePaymentsUpdatedDate');
                },
                //Local Edit Services Ready
                localProfileServicesUpatedDate : function (userId) {
                    return UsersRef.child(userId).child('localProfileServicesUpatedDate');
                },
                getUserPreferences : function(userId){
                    return this.preferences;
                },
                getUserPhoneNumber : function(userId){
                    return this.phone;
                }
            });

            return function(userId) {
                var ref = UsersRef.child(userId);
                return new User(ref);
            }

            }
        ]);
})();
