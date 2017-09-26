'use strict';
angular.module('com.ylc.blog')
    .controller('BlogCtrl', function($scope, CoreService,gettextCatalog,$state,ContactUsRef,EmailContactQueueRef,$firebaseArray) {
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
                    website : $scope.website ? $scope.website : '',
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
    });
