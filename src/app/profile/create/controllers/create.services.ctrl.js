/**
 * Created by TJ on 8/28/15.
 */

var app = angular.module('com.ylc.profile.create');

app.controller('CreateServicesCTRL',function(CoreService,$state,authFB,profile,$scope,gettextCatalog,gigs,Gigs,User,Profile,userData,Register,notify){
    Profile.putUserAsALocal(authFB.uid).$save().then(function (ref) {
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
        ref.set(true,function(error){
            User(authFB.uid).localProfileComplete(authFB.uid).once('value',function (snapshot) {
                if(snapshot.val()=== true && snapshot.val() !== null && snapshot.val() !== undefined){
                    $state.go('edit.about');
                } else {
                    $scope.profile = profile;
                    $scope.allGigs = gigs;

                    $scope.ugs = Gigs.getUserGigs(authFB.uid);

                    $scope.servicesSave = function(){
                        if($scope.ugs.length){
                            profile.$save().then(function(data){
                                User(authFB.uid).localProfileServicesComplete(authFB.uid).set(true);
                                User(authFB.uid).localProfileServicesCompleteDate(authFB.uid).set(Firebase.ServerValue.TIMESTAMP);
                                User(authFB.uid).localReady(authFB.uid).set(false);
                                CoreService.toastSuccess(gettextCatalog.getString('Profile Data Saved'),gettextCatalog.getString('Your Profile is safe with us!'));
                                $state.go('create.payments');
                            },function(error){
                                CoreService.toastError(gettextCatalog.getString('Profile Data Not Saved'),gettextCatalog.getString('Your Profile is not saved please try again later!'));
                            });
                        } else {
                            CoreService.toastError(gettextCatalog.getString('Please select a service'),gettextCatalog.getString('Please select a service before continuing!'));
                        }
                    };

                    profile.$bindTo($scope,"profile").then(function(){

                    },function(error){

                    });

                    $scope.addToUserGigs = function(gigId,set){
                        if(set){
                            Gigs.addUserGigs(authFB.uid,gigId).then(function(ref){
                                ref.set(true);
                            })
                        } else {
                            Gigs.addUserGigs(authFB.uid,gigId).then(function(){
                            })
                        }
                    };
                }
            });
        });
    });
});