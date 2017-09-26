
angular.module('com.ylc.auth')
    .controller('RegisterTravelerCtrl', function ($scope, Auth, $location, $q, Ref, $timeout,$state,Register,gettextCatalog,
                                          CoreService,$firebaseArray,$firebaseObject,State,usSpinnerService,EmailsRef,$modalInstance,Login,blockUI,registerTrue, isGift) {
        $scope.user = {
            email: '',
            signInEmail: '',
            password : '',
            signInPassword : '',
            firstName : '',
            lastName : '',
            fullName : '',
            profilePhotos : [],
            remember : true,
            tAndCSignUp : false,
            isALocal : false,
            howdidyouhearaboutus : '',
            traveler : true
        };

        var status = {};

        $scope.userEmailLogin = {
            email: '',
            password : ''
        };

        $scope.register = registerTrue;
        $scope.isGift = isGift;


        $scope.confirmPassword = '';

        $scope.passwordLogin = function(){
            EmailsRef.child(escapeEmailAddress($scope.userEmailLogin.email)).once('value', function (snapData) {
                if(snapData.val() === null || snapData.val() === undefined){
                    CoreService.toastError(gettextCatalog.getString('Account does not exist!'),gettextCatalog.getString('Please create an account'));
                } else {
                    if(snapData.val().provider === 'email'){
                        Auth.$authWithPassword($scope.userEmailLogin,{rememberMe : true}).then(function(auth){
                            CoreService.toastSuccess(gettextCatalog.getString('Signed in!'),gettextCatalog.getString('Signin successful!'));
                            status.stat = 'signupSuccess';
                            status.auth = auth;
                            $modalInstance.close(status);
                        }, function(error){
                            CoreService.toastError(gettextCatalog.getString('Signin Error!'),gettextCatalog.getString(error + ', Please correct the error and try again'))
                            $scope.error = error;
                        })
                    } else {
                        if(snapData.val().provider === 'facebook'){
                            CoreService.toastError(gettextCatalog.getString('Use Facebook to Login'),gettextCatalog.getString('This account is associated with Facebook, use Facebook to Login to your account'));
                        } else {
                            if(snapData.val() === null || snapData.val() === undefined){
                                CoreService.toastError(gettextCatalog.getString('Please create an account'),gettextCatalog.getString('Account does not exist'));
                            } else {
                                CoreService.toastError(gettextCatalog.getString('Please create an account'),gettextCatalog.getString('Account does not exist'));
                            }
                        }
                    }
                }
            }, function (error) {
                if(error){
                    Auth.$unauth();
                    CoreService.toastError(gettextCatalog.getString('There was an error'),gettextCatalog.getString('There is an error, please correct the error or contact info@yourlocalcousin.com ' + error));
                }
            })

        };

        function escapeEmailAddress(email) {
            if (!email) return false;
            // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
            email = email.toLowerCase();
            email = email.replace(/\./g, ',');
            return email;
        }

        $scope.register = function(){
            blockUI.start('Processing Request...');
            if($scope.user.email !== null && $scope.user.email !== undefined && $scope.user.email !== ''){
                if($scope.user.password !== null && $scope.user.password !== undefined && $scope.user.password !== ''){
                    if($scope.user.firstName !== null && $scope.user.firstName !== undefined && $scope.user.firstName !== ''
                        && $scope.user.lastName !== null && $scope.user.lastName !== undefined && $scope.user.lastName !== ''){
                        EmailsRef.child(escapeEmailAddress($scope.user.email)).once('value',function(snapshot){
                            if(snapshot.val() === null || snapshot.val() === undefined){
                                Auth.$createUser({  email : $scope.user.email ,
                                    password : $scope.user.password}).then(function(user){

                                    $firebaseObject(EmailsRef.child(escapeEmailAddress($scope.user.email))).$save().then(function (ref) {
                                        ref.child('provider').set('email');
                                        ref.child('createDate').set(Firebase.ServerValue.TIMESTAMP);
                                        ref.child('uid').set(user.uid);

                                        var userObject = $firebaseObject(Ref.child('users').child(user.uid));

                                        userObject.$loaded().then(function (data) {
                                            if(data.emailVerified === true || data.emailVerified === false){
                                                Auth.$authWithPassword({email : $scope.user.email, password : $scope.user.password},{rememberMe : true}).then(function (auth) {
                                                    status.stat = 'signupSuccess';
                                                    status.auth = auth;
                                                    blockUI.stop();
                                                    $modalInstance.close(status);
                                                });
                                                CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));
                                            } else {
                                                userObject.email = $scope.user.email;
                                                userObject.firstName = $scope.user.firstName;
                                                userObject.lastName = $scope.user.lastName;
                                                userObject.fullName = $scope.user.firstName + ' ' + $scope.user.lastName;
                                                userObject.howdidyouhearaboutus = $scope.user.howdidyouhearaboutus;
                                                userObject.traveler = $scope.user.traveler;


                                                filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
                                                filepicker.storeUrl(
                                                    "https://s3.amazonaws.com/yourlocalcousin/profilePhotos/OsFG5w1LRaeaFuA34HA3_photo.jpg",
                                                    {
                                                        path : "/profilePhotos/"
                                                    },
                                                    function(Blob){
                                                        userObject.profilePicture = Blob.url;
                                                        $scope.user.profilePhotos.push(Blob);
                                                        userObject.tAndCSignUp = false;
                                                        userObject.isALocal = false;
                                                        userObject.profileCreatedDate = Firebase.ServerValue.TIMESTAMP;
                                                        userObject.emailVerified = false;
                                                        userObject.facebookVerified = false;
                                                        userObject.ratingAvg = 0;
                                                        userObject.$priority = 0;

                                                        userObject.$save().then(function () {
                                                            userObject.$loaded().then(function (userData) {
                                                                addProfilePhotos(user.uid);
                                                                var queueWelcomeData = {};
                                                                queueWelcomeData.userID = user.uid;
                                                                queueWelcomeData.userData = userData;

                                                                Register.userSignupVerificationEmail(queueWelcomeData);
                                                                CoreService.toastInfo(gettextCatalog.getString('Verification Email sent!'), gettextCatalog.getString('We have sent a verification email to your email address, please verify your email account'));
                                                                CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));

                                                                Auth.$authWithPassword({email : $scope.user.email, password : $scope.user.password},{rememberMe : true}).then(function (auth) {
                                                                    status.stat = 'signupSuccess';
                                                                    status.auth = auth;
                                                                    blockUI.stop();
                                                                    $modalInstance.close(status);
                                                                })
                                                            })
                                                        }, function (error) {
                                                            blockUI.stop();
                                                            CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                                                                gettextCatalog.getString(error + ', Please login or try resetting your password'));
                                                        })

                                                    }, function (error) {
                                                        blockUI.stop();
                                                    }
                                                );
                                            }
                                        });
                                    }, function (error) {
                                        blockUI.stop();
                                    });
                                },function(error){
                                    blockUI.stop();
                                    CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                                        gettextCatalog.getString(error + ', Please login or try resetting your password'));
                                })
                            }
                            else {
                                if(snapshot.val().provider === 'email'){
                                    blockUI.stop();
                                    CoreService.toastError(gettextCatalog.getString("Account exist with this email address"),
                                        gettextCatalog.getString('Account is associated with this email, login or try resetting your password'));
                                    //MAKE THEM LOGIN
                                } else {
                                    if(snapshot.val().provider === 'facebook'){
                                        blockUI.stop();
                                        CoreService.toastError(gettextCatalog.getString("Account exist with Facebook Signin"),
                                            gettextCatalog.getString('Account exist with Facebook login, please Login using Facebook to continue'));
                                        //MAKE THEM LOGIN
                                    } else {
                                        blockUI.stop();
                                        CoreService.toastError(gettextCatalog.getString("Create account before"),
                                            gettextCatalog.getString('Account does not exist, create an account before continuing'));
                                    }
                                }
                            }
                        })
                    } else {
                        blockUI.stop();
                        CoreService.toastError(gettextCatalog.getString("Enter First and Last Name"),
                            gettextCatalog.getString('Please enter first name and last name before continuing!'));
                    }
                } else {
                    blockUI.stop();
                    CoreService.toastError(gettextCatalog.getString("Enter Password"),
                        gettextCatalog.getString('Please enter a Password before continuing!'));
                }
            } else {
                blockUI.stop();
                CoreService.toastError(gettextCatalog.getString("Enter Email"),
                    gettextCatalog.getString('Please enter an Email before continuing!'));
            }
        };

        $scope.signupWithFacebook = function(){
            Auth.$authWithOAuthPopup('facebook', {remember: true,scope: "email,public_profile"}).then(function(auth){
                if(auth.facebook.email !== null && auth.facebook.email !== undefined && auth.facebook.email !== ''){
                    EmailsRef.child(escapeEmailAddress(auth.facebook.email)).once('value',function(snapshot){
                        if(snapshot.val() === null || snapshot.val() === undefined ){
                            usSpinnerService.spin('spinner-1');

                            var userObject = $firebaseObject(Ref.child('users').child(auth.uid));

                            userObject.$loaded().then(function (data) {
                                if(data.facebookVerified === true){
                                    $firebaseObject(EmailsRef.child(escapeEmailAddress(auth.facebook.email))).$save().then(function (ref) {
                                        ref.child('provider').set('facebook');
                                        ref.child('createDate').set(Firebase.ServerValue.TIMESTAMP);
                                        ref.child('uid').set(auth.uid);

                                        status.stat = 'signupSuccess';
                                        status.auth = auth;
                                        $modalInstance.close(status);
                                    })
                                } else {
                                    userObject.email = auth.facebook.email;
                                    userObject.firstName = auth.facebook.cachedUserProfile.first_name;
                                    userObject.lastName = auth.facebook.cachedUserProfile.last_name;
                                    userObject.fullName = auth.facebook.cachedUserProfile.name;
                                    filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
                                    filepicker.storeUrl(
                                        auth.facebook.cachedUserProfile.picture.data.is_silhouette ?
                                            "https://s3.amazonaws.com/yourlocalcousin/profilePhotos/OsFG5w1LRaeaFuA34HA3_photo.jpg" :
                                            auth.facebook.profileImageURL,
                                        {
                                            path : "/profilePhotos/"
                                        },
                                        function(Blob){
                                            userObject.profilePicture = Blob.url;
                                            $scope.user.profilePhotos.push(Blob);

                                            userObject.cachedFBData = auth.facebook.cachedUserProfile;

                                            userObject.tAndCSignUp = false;
                                            userObject.isALocal = false;
                                            userObject.profileCreatedDate = Firebase.ServerValue.TIMESTAMP;
                                            userObject.emailVerified = true;
                                            userObject.facebookVerified = true;
                                            userObject.verificationStatus = true;
                                            userObject.userVerified = {};
                                            userObject.userVerified.emailVerified = true;
                                            userObject.userVerified.emailVerifiedDate = Firebase.ServerValue.TIMESTAMP;
                                            userObject.userVerified.facebookVerified = true;
                                            userObject.userVerified.facebookVerifiedDate = Firebase.ServerValue.TIMESTAMP;
                                            userObject.ratingAvg = 0;
                                            userObject.$priority = 0;

                                            $firebaseObject(EmailsRef.child(escapeEmailAddress(auth.facebook.email))).$save().then(function (ref) {
                                                ref.child('provider').set('facebook');
                                                ref.child('createDate').set(Firebase.ServerValue.TIMESTAMP);
                                                ref.child('uid').set(auth.uid);

                                                userObject.$save().then(function () {
                                                    userObject.$loaded().then(function (userData) {
                                                        addProfilePhotos(auth.uid);
                                                        var queueWelcomeData = {};
                                                        queueWelcomeData.userID = auth.uid;
                                                        queueWelcomeData.userData = userData;

                                                        usSpinnerService.stop('spinner-1');

                                                        CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));

                                                        status.stat = 'signupSuccess';
                                                        status.auth = auth;
                                                        $modalInstance.close(status);
                                                    })
                                                }, function (error) {
                                                    usSpinnerService.stop('spinner-1');
                                                    CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                                                        gettextCatalog.getString(error + ', Please login or try resetting your password'));
                                                })
                                            })

                                        }, function (error) {
                                            usSpinnerService.stop('spinner-1');
                                        }
                                    );
                                }
                            })
                        } else {
                            if(snapshot.val().provider === 'facebook'){

                                usSpinnerService.spin('spinner-1');

                                var userObject = $firebaseObject(Ref.child('users').child(auth.uid));

                                userObject.$loaded().then(function (data) {
                                    if(data.facebookVerified === true){
                                        status.stat = 'signupSuccess';
                                        status.auth = auth;
                                        $modalInstance.close(status);
                                    } else {

                                        userObject.email = auth.facebook.email;
                                        userObject.firstName = auth.facebook.cachedUserProfile.first_name;
                                        userObject.lastName = auth.facebook.cachedUserProfile.last_name;
                                        userObject.fullName = auth.facebook.cachedUserProfile.name;

                                        filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
                                        filepicker.storeUrl(
                                            auth.facebook.cachedUserProfile.picture.data.is_silhouette ?
                                                "https://s3.amazonaws.com/yourlocalcousin/profilePhotos/OsFG5w1LRaeaFuA34HA3_photo.jpg" :
                                                auth.facebook.profileImageURL,
                                            {
                                                path : "/profilePhotos/"
                                            },
                                            function(Blob){
                                                userObject.profilePicture = Blob.url;
                                                $scope.user.profilePhotos.push(Blob);

                                                userObject.cachedFBData = auth.facebook.cachedUserProfile;

                                                userObject.tAndCSignUp = false;
                                                userObject.isALocal = false;
                                                userObject.profileCreatedDate = Firebase.ServerValue.TIMESTAMP;
                                                userObject.emailVerified = true;
                                                userObject.facebookVerified = true;
                                                userObject.verificationStatus = true;
                                                userObject.userVerified = {};
                                                userObject.userVerified.emailVerified = true;
                                                userObject.userVerified.emailVerifiedDate = Firebase.ServerValue.TIMESTAMP;
                                                userObject.userVerified.facebookVerified = true;
                                                userObject.userVerified.facebookVerifiedDate = Firebase.ServerValue.TIMESTAMP;
                                                userObject.ratingAvg = 0;
                                                userObject.$priority = 0;

                                                $firebaseObject(EmailsRef.child(escapeEmailAddress(auth.facebook.email))).$save().then(function (ref) {
                                                    ref.child('provider').set('facebook');
                                                    ref.child('createDate').set(Firebase.ServerValue.TIMESTAMP);
                                                    ref.child('uid').set(auth.uid);

                                                    userObject.$save().then(function () {
                                                        userObject.$loaded().then(function (userData) {
                                                            addProfilePhotos(auth.uid);
                                                            var queueWelcomeData = {};
                                                            queueWelcomeData.userID = auth.uid;
                                                            queueWelcomeData.userData = userData;
                                                            //We don't wait here for emails to complete

                                                            usSpinnerService.stop('spinner-1');

                                                            status.stat = 'signupSuccess';
                                                            status.auth = auth;
                                                            $modalInstance.close(status);
                                                        })
                                                    }, function (error) {
                                                        usSpinnerService.stop('spinner-1');
                                                        CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                                                            gettextCatalog.getString(error + ', Please login or try resetting your password'));
                                                    })
                                                })

                                            }, function (error) {
                                                usSpinnerService.stop('spinner-1');
                                            }
                                        );
                                    }
                                })
                            } else {
                                if(snapshot.val().provider === 'email'){
                                    Auth.$unauth();
                                    CoreService.toastError(gettextCatalog.getString("Account exist with this email address"),
                                        gettextCatalog.getString('Account is associated with this email login with email and password or try resetting your password'));
                                }
                            }
                        }
                    }, function (error) {
                        if(error){
                            Auth.$unauth();
                            CoreService.toastError(gettextCatalog.getString('There was an error'),gettextCatalog.getString('There is an error, please use alternate method of signup / signin or contact info@yourlocalcousin.com ' + error));
                        }
                    })
                } else {
                    CoreService.toastError(gettextCatalog.getString('No email associated with the facebook account'),gettextCatalog.getString('No email associated with Facebook account, please user alternate method of signup or contact info@yourlocalcousin.com'));
                }
            }, function (error) {
                usSpinnerService.stop('spinner-1');
                CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                    gettextCatalog.getString(error + ', Please login or contact support'));
            });
        };

        var addProfilePhotos = function(uid){
            angular.forEach($scope.user.profilePhotos,function(value,key){
                Register.addProfilePhotoToProfile(uid,value);
            })
        };

        $scope.uploadFile = function(){
            if($scope.user.profilePhotos.length >= 3){
                CoreService.toastError(gettextCatalog.getString("Only three pictures allowed"),
                    gettextCatalog.getString('At this time we only allow three profile pictures'));
            } else {
                filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
                filepicker.pickAndStore({
                        maxFiles: 3 - $scope.user.profilePhotos.length,
                        mimetype: 'image/*',
                        multiple: true,
                        maxSize: 1024*1024*2

                    },{
                        path : "/profilePhotos/"
                    },
                    function(Blobs){
                        angular.forEach(Blobs, function (value, key) {
                            $scope.user.profilePhotos.push(value);
                        });
                        $scope.$apply();
                    }
                );
            }
        };

        $scope.deletePhoto = function (blob,index) {
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.remove(
                blob,
                function(){
                    $scope.user.profilePhotos.splice(index,1);
                    $scope.$apply();

                }
            );
        };

        $scope.resetPassword = function () {
            blockUI.start('Sending Password Reset Email ...');
            if($scope.userEmailLogin.email !== null && $scope.userEmailLogin.email !== undefined && $scope.userEmailLogin.email !== ''){
                Auth.$resetPassword({
                    email : $scope.userEmailLogin.email
                }).then(function () {
                    blockUI.stop();
                    CoreService.toastSuccess(gettextCatalog.getString('Password reset email sent!'),gettextCatalog.getString('We have sent you a password reset email, please follow the steps mentioned in the email'));
                }).catch(function (error) {
                    blockUI.stop();
                    if (error) {
                        switch (error.code) {
                            case "INVALID_USER":
                                CoreService.toastError(gettextCatalog.getString('User does not exist'),gettextCatalog.getString('The email specified does not exist, correct the email and try again'));
                                break;
                            default:
                                CoreService.toastError(gettextCatalog.getString('Error resetting password'),gettextCatalog.getString(error));
                        }
                    }
                })
            } else {
                blockUI.stop();
                CoreService.toastError(gettextCatalog.getString('Enter email'),gettextCatalog.getString('Enter your email to reset password'));
            }
        };

        $scope.registerInstead = function () {
            $scope.register = true;
        };

        $scope.loginInstead = function () {
            $scope.register = false;
        };
    });