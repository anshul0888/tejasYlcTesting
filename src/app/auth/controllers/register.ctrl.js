
angular.module('com.ylc.auth')
    .controller('RegisterCtrl', function ($scope, Auth, $location, $q, Ref, $timeout,$state,Register,gettextCatalog,
                                          CoreService,$firebaseArray,$firebaseObject,State,usSpinnerService,EmailsRef,$uibModal) {
        $scope.user = {
            email: '',
            password : '',
            firstName : '',
            lastName : '',
            fullName : '',
            profilePhotos : [],
            remember : true,
            tAndCSignUp : false,
            isALocal : false,
            howdidyouhearaboutus : ''
        };

        $scope.confirmPassword = '';

        function escapeEmailAddress(email) {
            if (!email) return false;
            // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
            email = email.toLowerCase();
            email = email.replace(/\./g, ',');
            return email;
        }

        $scope.animationsEnabled = true;

        $scope.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'auth/views/termsofuse.tpl.html',
                size: size
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

        //TODO HANDLE CASE WHEN USER CAN UPLOAD MULTIPLE PHOTOS WITHOUT SIGNING UP AND KEEP DOING IT

        $scope.register = function(){
            if($scope.user.password === $scope.confirmPassword){
                if($scope.user.tAndCSignUp){
                    if($scope.user.profilePhotos.length >= 1){
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
                                                CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));
                                                $state.go('dashboard.view');
                                            } else {
                                                userObject.email = $scope.user.email;
                                                userObject.firstName = $scope.user.firstName;
                                                userObject.lastName = $scope.user.lastName;
                                                userObject.fullName = $scope.user.firstName + ' ' + $scope.user.lastName;
                                                userObject.profilePicture = $scope.user.profilePhotos[0].url;
                                                userObject.tAndCSignUp = $scope.user.tAndCSignUp;
                                                userObject.isALocal = false;
                                                userObject.profileCreatedDate = Firebase.ServerValue.TIMESTAMP;
                                                userObject.emailVerified = false;
                                                userObject.facebookVerified = false;
                                                userObject.ratingAvg = 0;
                                                userObject.$priority = 0;
                                                userObject.howdidyouhearaboutus = $scope.user.howdidyouhearaboutus;

                                                userObject.$save().then(function () {
                                                    addProfilePhotos(user.uid);

                                                    userObject.$loaded().then(function (userData) {
                                                        var queueWelcomeData = {};
                                                        queueWelcomeData.userID = user.uid;
                                                        queueWelcomeData.userData = userData;
                                                        //We don't wait here for emails to complete

                                                        //Register.userSignupWelcomeEmail(queueWelcomeData);
                                                        Register.userSignupVerificationEmail(queueWelcomeData);
                                                        CoreService.toastInfo(gettextCatalog.getString('Verification Email sent!'), gettextCatalog.getString('We have sent a verification email to your email address, please verify your email account'));
                                                        usSpinnerService.stop('spinner-1');
                                                        CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));
                                                        var nextState = State.getUserNextState();
                                                        var nextStateParams = State.getUserNextStateParams();
                                                        if(nextState){
                                                            $state.go(nextState,nextStateParams);
                                                        } else {
                                                            $state.go('create.about');
                                                        }
                                                    })
                                                }, function (error) {
                                                    usSpinnerService.stop('spinner-1');
                                                    CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                                                        gettextCatalog.getString(error + ', Please login or try resetting your password'));
                                                })
                                            }
                                        });
                                    }, function (error) {

                                    });
                                },function(error){
                                    usSpinnerService.stop('spinner-1');
                                    CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                                        gettextCatalog.getString(error + ', Please login or try resetting your password'));
                                })
                            }
                            else {
                                if(snapshot.val().provider === 'email'){
                                    CoreService.toastError(gettextCatalog.getString("Account exist with this email address"),
                                        gettextCatalog.getString('Account is associated with this email, login or try resetting your password'));
                                    $state.go('signin');
                                } else {
                                    if(snapshot.val().provider === 'facebook'){
                                        CoreService.toastError(gettextCatalog.getString("Account exist with Facebook Signin"),
                                            gettextCatalog.getString('Account exist with Facebook login, please Login using Facebook to continue'));
                                        $state.go('signin');
                                    } else {
                                        CoreService.toastError(gettextCatalog.getString("Create account before"),
                                            gettextCatalog.getString('Account does not exist, create an account before continuing'));
                                    }
                                }
                            }
                        })
                    } else {
                        usSpinnerService.stop('spinner-1');
                        CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                            gettextCatalog.getString('Please add one profile picture before continuing'));
                    }
                } else {
                    usSpinnerService.stop('spinner-1');
                    CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                        gettextCatalog.getString('Please please accept Terms of Services before continuing'));
                }
            } else {
                usSpinnerService.stop('spinner-1');
                CoreService.toastError(gettextCatalog.getString("Can't Signup"),
                    gettextCatalog.getString('Password and Confirm password must match'));
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
                                console.log(data);
                                if(data.facebookVerified === true){
                                    $firebaseObject(EmailsRef.child(escapeEmailAddress(auth.facebook.email))).$save().then(function (ref) {
                                        ref.child('provider').set('facebook');
                                        ref.child('createDate').set(Firebase.ServerValue.TIMESTAMP);
                                        ref.child('uid').set(auth.uid);
                                        CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));
                                        var nextState = State.getUserNextState();
                                        var nextStateParams = State.getUserNextStateParams();
                                        usSpinnerService.stop('spinner-1');
                                        if(nextState){
                                            $state.go(nextState,nextStateParams);
                                        } else {
                                            $state.go('create.about');
                                        }
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
                                                        //We don't wait here for emails to complete

                                                        //Register.userSignupWelcomeEmail(queueWelcomeData);
                                                        usSpinnerService.stop('spinner-1');

                                                        //We don't wait here for emails to complete and We don't do email verification for facebook assuming facebook will do for us

                                                        //Register.userSignupWelcomeEmail(queueWelcomeData);

                                                        CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));
                                                        var nextState = State.getUserNextState();
                                                        var nextStateParams = State.getUserNextStateParams();
                                                        if(nextState){
                                                            $state.go(nextState,nextStateParams);
                                                        } else {
                                                            $state.go('create.about');
                                                        }
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
                                        CoreService.toastSuccess(gettextCatalog.getString('Account exist!'),gettextCatalog.getString('There is an account associated with this facebook login!'));
                                        var nextState = State.getUserNextState();
                                        var nextStateParams = State.getUserNextStateParams();
                                        usSpinnerService.stop('spinner-1');
                                        if(nextState){
                                            $state.go(nextState,nextStateParams);
                                        } else {
                                            $state.go('create.about');
                                        }
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

                                                            //Register.userSignupWelcomeEmail(queueWelcomeData);
                                                            usSpinnerService.stop('spinner-1');

                                                            //We don't wait here for emails to complete and We don't do email verification for facebook assuming facebook will do for us

                                                            //Register.userSignupWelcomeEmail(queueWelcomeData);

                                                            CoreService.toastSuccess(gettextCatalog.getString('Signup Success!'),gettextCatalog.getString('Signup was successful please Signin to access your account!'));
                                                            var nextState = State.getUserNextState();
                                                            var nextStateParams = State.getUserNextStateParams();
                                                            if(nextState){
                                                                $state.go(nextState,nextStateParams);
                                                            } else {
                                                                $state.go('create.about');
                                                            }
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
                                        gettextCatalog.getString('Account is associated with this email login or try resetting your password'));
                                    $state.go('signin');
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

        //TODO Filters

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
            console.log(index);
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.remove(
                blob,
                function(){
                    $scope.user.profilePhotos.splice(index,1);
                    $scope.$apply();

                }
            );
        };

        $scope.uploadEmailFile = function(){
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.pickAndStore({
                    multiple: true
                },{
                    path : "/YLCSamples/"
                },
                function(Blobs){
                    angular.forEach(Blobs, function (value, key) {
                        console.log(Blobs);
                    });

                }
            );
        };
    });