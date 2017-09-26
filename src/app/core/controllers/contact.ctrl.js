/**
 * Created by TJ on 7/2/15.
 */

angular.module('com.ylc.core').controller('ContactUsCtrl', ['Auth','$scope','ContactUsRef','CoreService','gettextCatalog','EmailContactQueueRef','$firebaseArray'
    ,function (Auth,$scope,ContactUsRef,CoreService,gettextCatalog,EmailContactQueueRef,$firebaseArray) {
        $scope.contactUs = function () {
            if($scope.email !== null && $scope.email !== undefined && $scope.email !== ''
                && $scope.name !== null && $scope.name !== undefined && $scope.name !== ''
                && $scope.subject !== null && $scope.subject !== undefined && $scope.subject !== ''
                && $scope.message !== null && $scope.message !== undefined && $scope.message !== ''){
                ContactUsRef.push({
                    name : $scope.name,
                    email : $scope.email,
                    subject : $scope.subject,
                    message : $scope.message,
                    resolved : false,
                    contacted : false
                }, function (error) {
                    if(error){
                        $scope.name = '';
                        $scope.email = '';
                        $scope.subject = '';
                        $scope.message = '';
                        CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again or contact info@yourlocalcousin.com!'));
                    } else {
                        var data = {};
                        data.contactData = {};
                        data.contactData.name = $scope.name;
                        data.contactData.email = $scope.email;
                        data.contactData.subject = $scope.subject;
                        data.contactData.message = $scope.message;
                        $firebaseArray(EmailContactQueueRef.child('tasks')).$add(data);
                        $scope.name = '';
                        $scope.email = '';
                        $scope.subject = '';
                        $scope.message = '';
                        CoreService.toastSuccess(gettextCatalog.getString('Submitted!'), gettextCatalog.getString('We will contact you shortly!'));
                    }
                })
            } else {
                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Enter all your information before continuing!'))
            }
        };

        $scope.uploadWebsitePhotos = function () {
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.pickAndStore({
                },{
                    path : "/websitePhotos/"
                },
                function(Blob){
                    console.log(Blob);
                }, function (error) {
                }
            );
        }
    }]);
