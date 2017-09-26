angular.module('com.ylc.auth')
    .controller('LoginCtrl', function (CoreService,gettextCatalog,$scope,Auth,$state,Login,State,UserData,$firebaseObject,$firebaseArray,Ref,EmailsRef,blockUI) {

      $scope.user = {
        email : '',
        password : ''
      };

        function escapeEmailAddress(email) {
            if (!email) return false;
            // Replace '.' (not allowed in a Firebase key) with ',' (not allowed in an email address)
            email = email.toLowerCase();
            email = email.replace(/\./g, ',');
            return email;
        }

          $scope.passwordLogin = function(){
              //TODO Implement logic for Remember me session only

              EmailsRef.child(escapeEmailAddress($scope.user.email)).once('value', function (snapData) {
                  if(snapData.val() === null || snapData.val() === undefined){
                      CoreService.toastError(gettextCatalog.getString('Account does not exist!'),gettextCatalog.getString('Please create an account'));
                      $state.go('signup');
                  } else {
                      if(snapData.val().provider === 'email'){
                          Auth.$authWithPassword($scope.user,{rememberMe : $scope.remember}).then(function(auth){
                              CoreService.toastSuccess(gettextCatalog.getString('Signed in!'),gettextCatalog.getString('Signin successful!'));

                              //TODO  wrong logic, this has to be better
                              var ns = State.getUserNextState();

                              if(ns === 'user'){
                                  var nextState = State.getUserNextState();
                                  var nextStateParams = State.getUserNextStateParams();
                                  if(nextState){
                                      $state.go(nextState,nextStateParams);
                                  } else {
                                      $state.go('dashboard.view');
                                  }
                              } else {
                                  Login.isUserLocal(auth.uid).$loaded().then(function (isLocal) {
                                      if(isLocal.$value){
                                          Login.checkIfANoob(auth.uid).$loaded().then(function(data){
                                              if(data.$value || data.$value === null){
                                                  //Implement logic to direct to the part where they left off rather than just one single part
                                                  $state.go('create.about');
                                              } else {
                                                  var nextState = State.getUserNextState();
                                                  var nextStateParams = State.getUserNextStateParams();
                                                  if(nextState){
                                                      $state.go(nextState,nextStateParams);
                                                  } else {
                                                      $state.go('dashboard.view');
                                                  }
                                              }
                                          });
                                      } else {
                                          //Traveler signin and redirect to the saved state
                                          var nextState = State.getUserNextState();
                                          var nextStateParams = State.getUserNextStateParams();
                                          if(nextState){
                                              $state.go(nextState,nextStateParams);
                                          } else {
                                              $state.go('dashboard.view');
                                          }
                                      }
                                  })
                              }
                              //Implement logic to determine that user is a local then we first check if the user has
                              // finished the profile if we the local has something in cart we don't stop him/her/it and assume they trying to book service
                              //Also handle logic for first time login and also logic if the State Previous Next is empty ?

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
                                  $state.go('signup');
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

        //TODO IMPORTANT Check if data exists and user is not clicking this button without
      $scope.loginWithFacebook = function(){
          Auth.$authWithOAuthPopup('facebook', {rememberMe: true,scope: "email,public_profile"}).then(function(auth){
              if(auth.facebook.email !== null && auth.facebook.email !== undefined && auth.facebook.email !== ''){
                  EmailsRef.child(escapeEmailAddress(auth.facebook.email)).once('value', function (snapData) {
                      if(snapData.val() === null || snapData.val() === undefined){
                          Auth.$unauth();
                          CoreService.toastError(gettextCatalog.getString('Account does not exist!'),gettextCatalog.getString('Please create an account'));
                          $state.go('signup');
                      } else {
                          if(snapData.val().provider === 'facebook'){
                              console.log('auth');
                              var userObject = $firebaseObject(Ref.child('users').child(auth.uid));
                              userObject.$loaded().then(function (data) {
                                  if(data.facebookVerified === true){
                                      var ns = State.getUserNextState();

                                      if(ns === 'user'){
                                          var nextState = State.getUserNextState();
                                          var nextStateParams = State.getUserNextStateParams();
                                          if(nextState){
                                              $state.go(nextState,nextStateParams);
                                          } else {
                                              $state.go('dashboard.view');
                                          }
                                      } else {
                                          Login.isUserLocal(auth.uid).$loaded().then(function (isLocal) {
                                              if(isLocal.$value){
                                                  Login.checkIfANoob(auth.uid).$loaded().then(function(data){
                                                      if(data.$value){
                                                          //Implement logic to direct to the part where they left off rather than just one single part
                                                          $state.go('create.about');
                                                      } else {
                                                          var nextState = State.getUserNextState();
                                                          var nextStateParams = State.getUserNextStateParams();
                                                          if(nextState){
                                                              $state.go(nextState,nextStateParams);
                                                          } else {
                                                              $state.go('dashboard.view');
                                                          }
                                                      }
                                                  });
                                              } else {
                                                  //Traveler signin and redirect to the saved state
                                                  var nextState = State.getUserNextState();
                                                  var nextStateParams = State.getUserNextStateParams();
                                                  if(nextState){
                                                      $state.go(nextState,nextStateParams);
                                                  } else {
                                                      $state.go('dashboard.view');
                                                  }
                                              }
                                          })
                                      }
                                  } else {
                                      //Redirect them to signup page
                                      Auth.$unauth();
                                      CoreService.toastError(gettextCatalog.getString('Signin Error!'),gettextCatalog.getString('User not found, Signup first'));
                                      $state.go('signup');

                                  }
                              })
                          } else {
                              if(snapData.val() !== 'email'){
                                  Auth.$unauth();
                                  CoreService.toastError(gettextCatalog.getString('Use Email to Login'),gettextCatalog.getString('This account is associated with Email authentication, use Email and Password to Login to your account'));
                              } else {
                                  Auth.$unauth();
                                  CoreService.toastError(gettextCatalog.getString('Please create an account'),gettextCatalog.getString('Account does not exist'));
                                  $state.go('signup');
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
                  Auth.$unauth();
                  CoreService.toastError(gettextCatalog.getString('Email Not Found'),gettextCatalog.getString('No email associated with Facebook account, please user alternate method of signup or contact info@yourlocalcousin.com'));
              }
          });
      };

        $scope.resetPassword = function () {
            blockUI.start('Sending Password Reset Email ...');
            if($scope.user.email !== null && $scope.user.email !== undefined && $scope.user.email !== ''){
                Auth.$resetPassword({
                    email : $scope.user.email
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
        }

    });
