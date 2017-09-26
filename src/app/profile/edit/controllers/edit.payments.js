/**
 * Created by TJ on 8/28/15.
 */
var app = angular.module('com.ylc.profile.edit');

app.controller('EditPaymentsCTRL',function(CoreService,$state,authED,profile,$scope,gettextCatalog,Profile,User,userData,Register,notify){

    Profile.isALocal(authED.uid).$loaded().then(function (local) {

        if(local.$value === null || local.$value === false){
            CoreService.confirm(
                gettextCatalog.getString('Signup to be a Local Cousin?'),
                gettextCatalog.getString('This section is only for Local Cousins, Do you want to proceed to Signup as a Local Cousin? Click Ok else Cancel'),
                function () {
                    $state.go('create.steps');
                }, function () {
                    CoreService.toastInfo(gettextCatalog.getString('Section only for Local Cousins!'), gettextCatalog.getString('This section is only for Local Cousins, please signup as a Local cousin to access the section'));
                    $state.go('edit.settings')
                })
        } else {
            //Check if still a Noob
            Profile.localIsANoob(authED.uid).$loaded().then(function(data){
                if(data.$value || data.$value === null){
                    //Implement logic to direct to the part where they left off rather than just one single part
                    CoreService.toastInfo(gettextCatalog.getString('Local Cousin profile incomplete!'), gettextCatalog.getString('You have not completed all the steps to be a Local Cousin we will guide you, please complete your profile'));
                    $state.go('create.about');
                } else {

                }
            });
        }
    });

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

    $scope.profile = profile;

    $scope.paymentsSave = function(){

            profile.$save().then(function(data){
                User(authED.uid).localProfilePaymentsUpdatedDate(authED.uid).set(Firebase.ServerValue.TIMESTAMP);
                Profile.noobNoMore(authED.uid);
                CoreService.toastSuccess(gettextCatalog.getString('Profile Data Saved'),gettextCatalog.getString('Your Profile is safe with us!'));
            },function(error){
                CoreService.toastError(gettextCatalog.getString('Profile Data Not Saved'),gettextCatalog.getString('Your Profile is not saved please try again later!'))
            });

    };

    //profile.$bindTo($scope,"profile").then(function(){
    //
    //},function(error){
    //
    //});

});