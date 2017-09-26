'use strict';
angular.module('com.ylc.dashboard')
  .controller('DashboardCtrl', function($scope, CoreService,gettextCatalog,auth,$state,Dashboard,User,SaveSearch,
                                        userData,notify,Register,selectedDates,Profile,blockUI,$cookieStore) {
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

        $scope.autocompleteOptions = {
            types: ['(regions)']
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
            $scope.signedIn = true;
        } else {
            $scope.signedIn = false;
        }

        Dashboard.getTotalForLocal(auth.uid).$loaded(function (snap) {
            $scope.totalLocalEarned = Dashboard.getTotalForLocal(auth.uid);
            $scope.totalTravelerSpent = Dashboard.getTotalForTraveler(auth.uid);
        });

        //$scope.ordersCompleted = Dashboard.getTotalOrdersCompleted(auth.uid);
        //$scope.ordersPending = Dashboard.getTotalOrdersPending(auth.uid);

        Dashboard.getTotalOrdersCompleted(auth.uid).on('value', function (snapOC) {
            var orderCompletedCount = 0;
            var ordersPendingCount = 0;
            var ordersDeclinedCount = 0;
            angular.forEach(snapOC.val(), function(value,key){
                if(value.status === 'COMPLETED'){
                    orderCompletedCount++;
                }
                if(value.status === 'ACCEPTED' || value.status === 'REVIEW'){
                    ordersPendingCount++
                }
                if(value.status === 'DECLINED'){
                    ordersDeclinedCount++;
                }
            });

            $scope.ordersCompleted = orderCompletedCount;
            $scope.ordersPending = ordersPendingCount;
            $scope.ordersDeclined = ordersDeclinedCount;
        });

        Dashboard.getUserConversations(auth.uid).on('value', function (userConvoRef) {
            var unreadMessageCount = 0;
            angular.forEach(userConvoRef.val(), function (value, key) {
                if(value.messages){
                    angular.forEach(value.messages, function (valueMessages, keyMessages) {
                        if(valueMessages.sentTo === auth.uid && valueMessages.seen === false){
                            unreadMessageCount++;
                        }
                    })
                }
            });
            $scope.unreadMessages = unreadMessageCount;
        });


        $scope.usersData = userData;

        $scope.searchLocals = function () {
            blockUI.start('Searching ...');
            if($scope.place === null || $scope.place === undefined || $scope.place === ''){
                CoreService.toastError(gettextCatalog.getString('Enter Correct Place!'),
                    gettextCatalog.getString('Enter a location select from the drop-down and try again'));
                blockUI.stop();
            } else {
                setTimeout(function () {
                    if(SaveSearch.getUserSearch()){
                        SaveSearch.setUserSearch(null);
                    }
                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode( { 'placeId': $scope.place.place_id}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $cookieStore.put('userSearch',results);
                            SaveSearch.setUserSearch(results);
                            $state.go('search.results',{},{reload: true});
                        } else {
                            blockUI.stop();
                            CoreService.toastError(gettextCatalog.getString('Error! Incorrect Search!'), gettextCatalog.getString('Try again after correcting place or contact us on info@yourlocalcousin.com!'));
                        }
                    });
                },500);
            }
        };

        $scope.activeDate = null;

        $scope.selectedDates = selectedDates;

        $scope.addDate = function () {
            Profile.localsBusyDates(auth.uid).remove(function (error) {
                if(error){

                } else {
                    angular.forEach($scope.selectedDates, function (val, key) {
                        Profile.addLocalsBusyDate(auth.uid,val);
                    });
                }
            })
        };

        $scope.today = function() {
            //$scope.tripFromDate = MessagesConversation.getTripFromDate(questionnaireId[0].$id);
            //$scope.tripToDate = MessagesConversation.getTripToDate(questionnaireId[0].$id);
        };
        $scope.today();

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 3, 18);

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks : 'false'
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

  });
