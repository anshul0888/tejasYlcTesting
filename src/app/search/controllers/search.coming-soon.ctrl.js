'use strict';
angular.module('com.ylc.search')
  .controller('SearchComingSoonCtrl', function($scope, CoreService,$geofire,Search,$stateParams,$state,SearchLocationRef,SaveSearch,gettextCatalog,
                                               Auth,User) {
        var savedSearch = SaveSearch.getUserSearch();

        var searchedLocation = {};
        $scope.signUpEmail = null;
        $scope.notifyBefore = null;
        $scope.iDontCareWhen = null;
        /// DATE VARIABLES

        $scope.today = function() {
            $scope.dateBefore = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dateBefore = null;
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 3, 18);

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dateBefore = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.status = {
            opened: false
        };

        // DATE VARIABLES END


        if(savedSearch){
            angular.forEach(savedSearch[0].address_components, function (value, key) {
                if(value.types[0] === 'locality' && value.types[1] === 'political'){
                    searchedLocation.cityName = value.long_name;
                }

                if(value.types[0] === 'administrative_area_level_1' && value.types[1] === 'political'){
                    searchedLocation.stateName = value.long_name;
                }

                if(value.types[0] === 'country' && value.types[1] === 'political'){
                    searchedLocation.countryName = value.long_name;
                }
            });

            $scope.searchedLocation = searchedLocation;

        } else {
            Auth.$requireAuth().then(function (auth) {
                CoreService.toastError(gettextCatalog.getString('Search invalid!'), gettextCatalog.getString('You have an invalid search!'));
                $state.go('dashboard.view');
            }).catch(function () {
                CoreService.toastError(gettextCatalog.getString('Search invalid!'), gettextCatalog.getString('You have an invalid search! Try again'));
                $state.go('home');
            })
        }

        $scope.signupForLocation = function () {
            if($scope.signUpEmail !== null && $scope.signUpEmail.trim() !== '' && savedSearch && ($scope.dateBefore !== null || $scope.dateBefore !== undefined)){
                //TODO check if city or state or country maybe later for now not super important and don't see much importance besides storing it seperate
                Auth.$requireAuth().then(function (auth) {
                    var locationDataObj = {};
                    locationDataObj.userData = {};
                    locationDataObj["_state"]  = "comingSoon_start";
                    locationDataObj.userId = auth.uid;
                    locationDataObj.userData.email = btoa($scope.signUpEmail);
                    locationDataObj.userData.dateCreated = Firebase.ServerValue.TIMESTAMP;
                    locationDataObj.userData.notifyBefore = new Date(new Date($scope.dateBefore).toDateString()).getTime();

                    //if(!$scope.iDontCareWhen){
                    //    locationDataObj.notifyBefore = null;
                    //} else {
                    //    locationDataObj.notifyBefore = $scope.notifyBefore;
                    //}
                    //locationDataObj.iDontCareWhen = $scope.iDontCareWhen;

                    locationDataObj.locationGeometry = {};
                    locationDataObj.locationGeometry.latitude = savedSearch[0].geometry.location.lat();
                    locationDataObj.locationGeometry.longitude = savedSearch[0].geometry.location.lng();

                    delete savedSearch[0].geometry.location;
                    locationDataObj.locationData = savedSearch[0];

                    Search.comingSoonQueue(locationDataObj).then(function (locationQueueData) {
                        locationQueueData.on('value', function (locationQueueDataSnapshot) {
                            if (locationQueueDataSnapshot.val()._state === 'comingSoon_error') {
                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                            }

                            if(locationQueueDataSnapshot.val()._state === 'comingSoon_finished'){
                                SaveSearch.setUserSearch(null);
                                locationQueueData.off();
                                locationQueueData.ref().remove();
                                CoreService.toastSuccess(gettextCatalog.getString('Email added Successfully'),gettextCatalog.getString('We will contact you shortly!'));
                                $state.go('dashboard.view');
                            }
                        })
                    })
                }).catch(function () {
                    var locationDataObj = {};
                    locationDataObj.userData = {};
                    locationDataObj["_state"]  = "comingSoon_start";

                    locationDataObj.userData.email = btoa($scope.signUpEmail);
                    locationDataObj.userData.dateCreated = Firebase.ServerValue.TIMESTAMP;
                    locationDataObj.userData.notifyBefore = new Date(new Date($scope.dateBefore).toDateString()).getTime();

                    //if(!$scope.iDontCareWhen){
                    //    locationDataObj.notifyBefore = null;
                    //} else {
                    //    locationDataObj.notifyBefore = $scope.notifyBefore;
                    //}
                    //locationDataObj.iDontCareWhen = $scope.iDontCareWhen;

                    locationDataObj.locationGeometry = {};
                    locationDataObj.locationGeometry.latitude = savedSearch[0].geometry.location.lat();
                    locationDataObj.locationGeometry.longitude = savedSearch[0].geometry.location.lng();

                    delete savedSearch[0].geometry.location;
                    locationDataObj.locationData = savedSearch[0];

                    Search.comingSoonQueue(locationDataObj).then(function (locationQueueData) {
                        locationQueueData.on('value', function (locationQueueDataSnapshot) {
                            if (locationQueueDataSnapshot.val()._state === 'comingSoon_error') {
                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                            }

                            if(locationQueueDataSnapshot.val()._state === 'comingSoon_finished'){
                                SaveSearch.setUserSearch(null);
                                locationQueueData.off();
                                locationQueueData.ref().remove();
                                CoreService.toastSuccess(gettextCatalog.getString('Email added Successfully'),gettextCatalog.getString(''));
                                $state.go('dashboard.view');
                            }
                        })
                    })
                });

                //TODO Clear SaveSearch when user exits page


            } else {
                CoreService.toastError(gettextCatalog.getString('Invalid Fields!'), gettextCatalog.getString('Please provide a valid email address and a date!'));
            }
        }
    });
