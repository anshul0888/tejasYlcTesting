/**
 * Created by TJ on 7/2/15.
 */

angular.module('com.ylc.core').controller('VerifyCtrl', ['Auth','$scope','$state','SaveSearch','CoreService','gettextCatalog','Profile','User','Navigation','$stateParams','State'
    ,function (Auth,$scope,$state,SaveSearch,CoreService,gettextCatalog,Profile,User,Navigation,$stateParams,State) {
        var authData = Auth.$getAuth();


        if(authData){
            Profile.isUserVerified(authData.uid).$loaded(function (isVerified) {
                if(isVerified.$value === true && isVerified.$value !== null && isVerified.$value !== undefined){
                    CoreService.toastInfo(gettextCatalog.getString('Email already verified!'),gettextCatalog.getString('Your Email is already verified, Please login to access your account'));
                    State.setUserNextState(null);
                    State.setUserNextStateParams(null);
                    Auth.$unauth();
                    $state.go('signin');
                } else {
                    Auth.$authWithCustomToken($stateParams.token).then(function (authD) {
                        if(authData.uid === authD.uid){
                            Profile.setUserEmailVerified(authD.uid);
                            CoreService.toastSuccess(gettextCatalog.getString('Email Verified!'),gettextCatalog.getString('Thanks your email has been verified!'));
                            State.setUserNextState(null);
                            State.setUserNextStateParams(null);
                            Auth.$unauth();
                            $state.go('signin');
                        } else {
                            CoreService.toastError(gettextCatalog.getString("Wrong account used to Signin"),
                                gettextCatalog.getString('Looks like this is not the account your were trying to access please signin with correct account'));
                            State.setUserNextState('user');
                            State.setUserNextStateParams($stateParams);
                            Auth.$unauth();
                            $state.go('signin');
                        }
                    }).catch(function (error) {
                        CoreService.toastError(gettextCatalog.getString("Cannot Verify Email"),
                            gettextCatalog.getString('Cannot Verify Email at this time, because of the following reason ' + error+',Goto Account Setting and ask for another confirmation email or contact info@yourlocalcousin.com'));
                        $state.go('dashboard.view');
                    })
                }
            })
        } else {
            State.setUserNextState('user');
            State.setUserNextStateParams($stateParams);
            CoreService.toastError(gettextCatalog.getString("Signin before continuing"),
                gettextCatalog.getString('Signin before continuing'));
            $state.go('signin');

        }

}]);
