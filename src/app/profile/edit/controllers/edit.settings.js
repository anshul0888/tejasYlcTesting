/**
 * Created by TJ on 8/28/15.
 */

var app = angular.module('com.ylc.profile.edit');

app.controller('EditSettingsCTRL',function(CoreService,$state,authED,profile,$scope,gettextCatalog,gigs,Gigs,
                                           Profile,User,Auth,userData,Register,notify,
                                           LocationPhotosRef,CitiesRef,$firebaseArray,PhotosLocationQueueRef,
                                            selectedDates,EmailsRef,UsersRef,blockUI){

    $scope.profile = profile;
    $scope.uploadedImages = [];


    profile.$loaded(function (data) {
        $scope.phone = data.phone;
    });

    //$scope.link = function (provider) {
    //   //$auth.authenticate(provider);
    //    auth.signin({}, function (profile, token) {
    //        // Success callback
    //        store.set('profile', profile);
    //        store.set('token', token);
    //        $state.go('edit.settings');
    //    }, function () {
    //        // Error callback
    //    });
    //
    //};

    function escapeEmailAddress(email) {
        if (!email) return false;
        // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
        email = email.toLowerCase();
        email = email.replace(/\./g, ',');
        return email;
    }

    $scope.changeUserEmail = function () {
        blockUI.start('Working on it ...');
        UsersRef.child(authED.uid).once('value', function (snap) {
            if(snap.val() !== null){
                if(snap.val().email.toLowerCase() !== $scope.oldEmail.toLowerCase() ){
                    blockUI.stop();
                    $scope.oldEmail = '';
                    $scope.newEmail = '';
                    $scope.currentPassword = '';
                    CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('Email not associated with this account, please contact support at info@yourlocalcousin.com'));
                } else {
                    if($scope.oldEmail !== null && $scope.oldEmail !== undefined && $scope.newEmail !== null && $scope.newEmail !== undefined && $scope.currentPassword !== null && $scope.currentPassword !== undefined ){
                        EmailsRef.child(escapeEmailAddress($scope.oldEmail)).once('value', function (snapshot) {
                            if(snapshot.val() !== null && snapshot.val() !== undefined){
                                if(snapshot.val().provider !== null && snapshot.val().provider !== undefined){
                                    if(snapshot.val().provider === 'facebook'){
                                        blockUI.stop();
                                        $scope.oldEmail = '';
                                        $scope.newEmail = '';
                                        $scope.currentPassword = '';
                                        CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('You have used Facebook to signup for this account, if you want to change the email please contact support at info@yourlocalcousin.com'));
                                    } else {
                                        EmailsRef.child(escapeEmailAddress($scope.newEmail)).once('value', function (newSnapshot) {
                                            if(newSnapshot.val() === null || newSnapshot.val() === undefined){
                                                Auth.$changeEmail({
                                                    oldEmail : $scope.oldEmail,
                                                    newEmail : $scope.newEmail,
                                                    password : $scope.currentPassword
                                                }).then(function () {
                                                    EmailsRef.child(escapeEmailAddress($scope.newEmail)).set({
                                                        createDate : Firebase.ServerValue.TIMESTAMP,
                                                        provider : 'email',
                                                        uid : authED.uid
                                                    }, function (error) {
                                                        EmailsRef.child(escapeEmailAddress($scope.oldEmail)).remove(function (error) {
                                                            UsersRef.child(authED.uid).child('verificationStatus').set(false, function (error) {
                                                                UsersRef.child(authED.uid).child('userVerified').child('emailVerified').set(false, function (error) {
                                                                    UsersRef.child(authED.uid).child('email').set($scope.newEmail, function (error) {
                                                                        UsersRef.child(authED.uid).child('emailVerified').set(false, function (error) {
                                                                            blockUI.stop();
                                                                            var queueWelcomeData = {};
                                                                            queueWelcomeData.userID = authED.uid;
                                                                            queueWelcomeData.userData = snap.val();
                                                                            //Register.userSignupWelcomeEmail(queueWelcomeData);
                                                                            Register.userSignupVerificationEmail(queueWelcomeData);
                                                                            $scope.oldEmail = '';
                                                                            $scope.newEmail = '';
                                                                            $scope.currentPassword = '';
                                                                            Auth.$unauth();
                                                                            CoreService.toastSuccess(gettextCatalog.getString('Email Changed'),gettextCatalog.getString('We have sent a confirmation email to the new email address, please verify the new email address, please use the new email address to login going forward'));
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    });
                                                }).catch(function (error) {
                                                    blockUI.stop();
                                                    $scope.oldEmail = '';
                                                    $scope.newEmail = '';
                                                    $scope.currentPassword = '';
                                                    CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString(error));
                                                })

                                            } else {
                                                blockUI.stop();
                                                $scope.oldEmail = '';
                                                $scope.newEmail = '';
                                                $scope.currentPassword = '';
                                                CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('The new email you\'re trying to add already exists in our system, contact info@yourlocalcousin.com for help'));
                                            }
                                        })
                                    }
                                } else {
                                    blockUI.stop();
                                    $scope.oldEmail = '';
                                    $scope.newEmail = '';
                                    $scope.currentPassword = '';
                                    CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('The email doesn\'t exist in the system contact info@yourlocalcousin.com for more details'));
                                }
                            } else {
                                blockUI.stop();
                                $scope.oldEmail = '';
                                $scope.newEmail = '';
                                $scope.currentPassword = '';
                                CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('The email doesn\'t exist in the system contact info@yourlocalcousin.com for more details'));
                            }
                        });
                    } else {
                        blockUI.stop();
                        $scope.oldEmail = '';
                        $scope.newEmail = '';
                        $scope.currentPassword = '';
                        CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('Enter Old Email, New Email and Password before continuing'));
                    }
                }
            } else {
                blockUI.stop();
                $scope.oldEmail = '';
                $scope.newEmail = '';
                $scope.currentPassword = '';
                CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('User does not exist'));

            }
        })
    };

    $scope.changeUserPassword = function () {
        if($scope.password !== null && $scope.confirmPassword !== null && $scope.oldPassword){
            if($scope.confirmPassword === $scope.password){
                profile.$loaded(function(data){
                    Auth.$changePassword(
                        {   email : data.email,
                            oldPassword : $scope.oldPassword,
                            newPassword : $scope.password
                        }).then(function() {
                            $scope.password = '';
                            $scope.oldPassword= '';
                            $scope.confirmPassword = '';
                            CoreService.toastSuccess(gettextCatalog.getString('Password Changed'),gettextCatalog.getString(''));
                        }).catch(function(error) {
                            $scope.password = '';
                            $scope.oldPassword= '';
                            $scope.confirmPassword = '';
                            CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString(error));
                        })
                })
            } else {
                $scope.password = '';
                $scope.oldPassword= '';
                $scope.confirmPassword = '';
                CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('Password and Confirm Password should match!'));
            }
        } else {
            $scope.password = '';
            $scope.oldPassword= '';
            $scope.confirmPassword = '';
            CoreService.toastError(gettextCatalog.getString('Error'),gettextCatalog.getString('Please Enter Old Password, Password and Confirm Password !'));
        }
    };

    notify.closeAll();
    $scope.sendVerificationEmail = function(){
        var verificationData = {};
        if(userData){
            verificationData.userID = userData.$id;
            verificationData.userData = {};
            verificationData.userData.email = userData.email;
            verificationData.userData.firstName = userData.firstName;
            Register.userSignupVerificationEmail(verificationData);
            notify.closeAll();
        } else {
            CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Login before continuing!'));
            notify.closeAll();
            $state.go('signin');
        }
    };

    if(userData){
        if(userData.verificationStatus === null || userData.verificationStatus === undefined || userData.verificationStatus === false){
            var messageTemplate = '<span>Looks like you have not verified your email address, please click on the link to get a verification email. '+
                '<a href="" ng-click="sendVerificationEmail()">CLICK HERE</a></span>';

            // notify({
            //     messageTemplate : messageTemplate,
            //     duration : 3000000,
            //     templateUrl : '',
            //     scope : $scope
            // });
        }
        $scope.usersData = userData;
    } else {
    }

    $scope.localListed = Profile.isLocalReady(authED.uid);

    $scope.usersData = User(authED.uid);


    $scope.unlistLocal = function () {
        User(authED.uid).localReady(authED.uid).set(false, function (error) {
            if(error){
                CoreService.toastError(gettextCatalog.getString('Error UnListing'),gettextCatalog.getString('Please contact support!'));
            } else {
                CoreService.toastSuccess(gettextCatalog.getString('UnListed Successfully'),gettextCatalog.getString('Local Listed Successfully!'));
            }
        });
    };

    $scope.listLocal = function () {
        User(authED.uid).localReady(authED.uid).set(true, function (error) {
            if(error){
                CoreService.toastError(gettextCatalog.getString('Error Listing'),gettextCatalog.getString('Please contact support!'));
            } else {
                CoreService.toastSuccess(gettextCatalog.getString('Listed Successfully'),gettextCatalog.getString('Local Listed Successfully!'));
            }
        });
    };

    profile.$bindTo($scope,"profile").then(function(){

    },function(error){

    });

    $scope.savePhoneNumber = function () {
        if($scope.phone){
            Profile.savePhoneNumber(authED.uid,$scope.phone);
        } else {
            CoreService.toastError(gettextCatalog.getString('Enter a phone number'),gettextCatalog.getString('Please enter a phone number before saving!'));
        }
    };

    $scope.profilePhotos = Profile.getProfilePhotos(authED.uid);

    $scope.deleteProfilePhoto = function (blob) {
        filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
        filepicker.remove(
            blob,
            function(){
                Profile.deleteProfilePhoto(blob.$id,authED.uid);
            }
        );
    };

    $scope.setMainProfilePicture = function (blob) {
        Profile.setMainProfilePicture(blob.$id,blob.url,authED.uid);
    };

    $scope.uploadProfilePhotoFile = function(){
        if($scope.profilePhotos.length >= 3){
            CoreService.toastError(gettextCatalog.getString('Only 3 profile photos allowed'),gettextCatalog.getString('Please delete few and try again!'));
        } else {
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.pickAndStore({
                    maxFiles: 3 - $scope.profilePhotos.length,
                    mimetype: 'image/*',
                    multiple: true,
                    maxSize: 1024*1024*2
                },{
                    path : "/profilePhotos/"
                },
                function(Blobs){
                    angular.forEach(Blobs, function (value, key) {
                        $scope.uploadedImages.push(value.url);
                        Profile.addProfilePhotoToProfile(authED.uid,value).then(function( ){
                        },function(){
                        })
                    });
                }, function (error) {
                    CoreService.toastError(gettextCatalog.getString('Photos not be saved'),gettextCatalog.getString('Photos not saved, Please try again!'));
                }
            );
        }
    };

    $scope.activeDate = null;

    $scope.selectedDates = selectedDates;

    $scope.addDate = function () {
        Profile.localsBusyDates(authED.uid).remove(function (error) {
            if(error){

            } else {
                angular.forEach($scope.selectedDates, function (val, key) {
                    Profile.addLocalsBusyDate(authED.uid,val);
                });
            }
        })
    };

    var yesDelete = function () {
        CoreService.toastInfo(gettextCatalog.getString('Sorry still working on this!'),gettextCatalog.getString('Meanwhile contact info@yourlocalcousin.com to get your account deleted!'));
    };

    var noDelete = function () {
        CoreService.toastSuccess(gettextCatalog.getString('We are glad we did not loose you!'),gettextCatalog.getString('Please contact info@yourlocalcousin.com if you need help!'));
    };

    $scope.deleteLocal = function () {
        CoreService.confirm(gettextCatalog.getString('Are you Sure?'),gettextCatalog.getString('This action is permanent and cannot be reversed, please contact info@yourlocalcousin.com if you have any questions'),yesDelete,noDelete);
    }

});