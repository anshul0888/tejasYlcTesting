var app = angular.module('com.ylc.auth');

app.factory('Register',function($firebaseArray,$firebaseObject,UsersRef,PhotosRef,EmailSignupWelcomeQueueRef,EmailSignupVerificationQueueRef,FaqsRef){

    var Register = {
        addProfilePhotoToProfile : function(uid,photoMeta){
            return $firebaseArray(PhotosRef).$add(photoMeta).then(function(ref){
                $firebaseObject(UsersRef.child(uid).child("profilePhotos").child(ref.key())).$save().then(function(dataRef){
                    dataRef.set(true);
                })
            });
        },
        userSignupWelcomeEmail : function (queueData) {
            return $firebaseArray(EmailSignupWelcomeQueueRef.child('tasks')).$add(queueData);
        },
        userSignupVerificationEmail : function (queueData) {
            return $firebaseArray(EmailSignupVerificationQueueRef.child('tasks')).$add(queueData);
        },
        addFAQ : function (type,subtype, question, answer) {
            $firebaseArray(FaqsRef.child(type).child(subtype)).$add({question : question, answer : answer})
        }
    };
    return Register;
});