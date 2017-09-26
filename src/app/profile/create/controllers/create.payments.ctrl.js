/**
 * Created by TJ on 8/28/15.
 */
var app = angular.module('com.ylc.profile.create');

app.controller('CreatePaymentsCTRL',function(CoreService,$state,authFB,profile,$scope,gettextCatalog,Profile,User,userData,Register,notify){
    $scope.profile = profile;

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
                } else{
                    Profile.putUserAsALocal(authFB.uid).$save().then(function (ref) {
                        ref.set(true,function(error){
                            Profile.welcomeLocalEmail($scope.profile);
                            //TODO remove below
                            var prof = {};
                            prof.profile = {};
                            prof.profile = $scope.profile;
                            Profile.informYLC(prof);
                            Profile.informTJ(prof);
                            Profile.noobNoMore(authFB.uid);
                            User(authFB.uid).localReady(authFB.uid).set(false);
                            User(authFB.uid).localProfileComplete(authFB.uid).set(true);
                            User(authFB.uid).localProfileCompleteDate(authFB.uid).set(Firebase.ServerValue.TIMESTAMP);
                        });
                    });

                    $scope.paypal = function() {
                        //auth.signin({}, function(profile, idToken, accessToken, state, refreshToken) {
                        //    store.set('profile', profile);
                        //    store.set('token', idToken);
                        //    store.set('refreshToken', refreshToken);
                        //    Profile.setPayPal(profile,authFB.uid);
                        //}, function(err) {
                        //
                        //});
                        //$auth.authenticate('paypal');
                    };

                    $scope.paymentsSave = function(){
                            profile.$save().then(function(data){
                                User(authFB.uid).localProfilePaymentsComplete(authFB.uid).set(true);
                                User(authFB.uid).localProfilePaymentsCompleteDate(authFB.uid).set(Firebase.ServerValue.TIMESTAMP);
                                User(authFB.uid).localReady(authFB.uid).set(false);
                                CoreService.toastSuccess(gettextCatalog.getString('Profile Data Saved'),gettextCatalog.getString('Your Profile is safe with us!'));
                                $state.go('create.success');
                            },function(error){
                                CoreService.toastError(gettextCatalog.getString('Profile Data Not Saved'),gettextCatalog.getString('Your Profile is not saved please try again later!'))
                            });
                    };


                    //profile.$bindTo($scope,"profile").then(function(){
                    //
                    //},function(error){
                    //
                    //});
                }
            });
        });
    });
});