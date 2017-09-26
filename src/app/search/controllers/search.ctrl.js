'use strict';
angular.module('com.ylc.search')
  .controller('SearchResultsCtrl', function($scope, CoreService,Search,$stateParams,$state,
                                            SearchLocationRef,SaveSearch,gettextCatalog,User,usSpinnerService,
                                            LocationPhotosRef,blockUI,Profile,Auth) {

        var savedSearch = SaveSearch.getUserSearch();

        $scope.searchDetails = function(localId){
            SaveSearch.setUserSearch(savedSearch);
            $state.go('search.details',{id : localId})
        };

      var coverVideos = {
          'ChIJA-2qKIt9hYARZ5N1NdUVtHE' : { id : 'oM2j_rxZNl8'},
          'ChIJQ4Ld14-UC0cRb1jb03UcZvg' : { id : '3N16mMRxMaw'},
          'ChIJi3lwCZyTC0cRkEAWZg-vAAQ' : { id : '3N16mMRxMaw'}
      };

        $scope.videoFound = null;

        if(savedSearch[0].place_id === 'ChIJA-2qKIt9hYARZ5N1NdUVtHE' || savedSearch[0].place_id === 'ChIJQ4Ld14-UC0cRb1jb03UcZvg' || savedSearch[0].place_id ===  'ChIJi3lwCZyTC0cRkEAWZg-vAAQ'){
            $scope.videoFound = true;
            $scope.video = coverVideos[savedSearch[0].place_id];
        } else {
            $scope.videoFound= false;
        }

      // id : 'oM2j_rxZNl8'


        if(SaveSearch.getUserSearch()){

            $scope.extendedSearch = true;
            savedSearch[0].types[0] === 'country' ? $scope.extendedSearch = false
                : savedSearch[0].types[0] === 'administrative_area_level_1' ? $scope.extendedSearch = false
                    : savedSearch[0].types[0] === 'administrative_area_level_2' ? $scope.extendedSearch = false
                        :  $scope.extendedSearch = true;

            $scope.searchResults = [];
            $scope.searchResultsExactMatch = [];

            $scope.localsFound = 0;
            $scope.localsFoundExactMatch = 0;

            var allLocals = [];


            var tempLocal = 0;
            var tempLocalExactMatch = 0;

            angular.forEach(savedSearch[0].address_components, function (val, key) {
                if(val.types[0] === 'locality' && val.types[0] !== null && val.types[0] !== undefined){
                    $scope.formattedAddress = val.long_name;
                }
            });
            //$scope.formattedAddress = savedSearch[0].formatted_address;

            var search = function (key) {
                var queryKey =  key.substring(0,key.indexOf("-oO-AAPDUDEHO-Oo-"));
                var found = false;
                angular.forEach(allLocals, function (value, key) {
                    if(value === queryKey){
                        found=true;
                    }
                });

                if(found === true){
                } else {
                    User(queryKey).$loaded().then(function (snapshot) {
                        //check if localIsReady and it is not null
                        if(snapshot.localIsReady === true && snapshot.localIsReady !== null && snapshot.localIsReady !== undefined){
                            $scope.searchResult = User(queryKey);

                            //var userLocations =  Profile.getUserLocations();
                            if($scope.searchResults.length === 0){
                                $scope.localsFound++;
                                $scope.searchResults.push($scope.searchResult);
                            } else {
                                var found = false;
                                angular.forEach($scope.searchResults, function (value, key) {
                                    if(!found){
                                        if($scope.searchResult.$id === value.$id){
                                            found = true;
                                        } else {
                                        }
                                    }
                                });
                                if(found){
                                }else {
                                    $scope.localsFound++;
                                    $scope.searchResults.push($scope.searchResult);
                                }
                            }
                        }
                    });
                }
            };

            var searchExactMatch = function (key) {
                var queryKeyExactMatch =  key.substring(0,key.indexOf("-oO-AAPDUDEHO-Oo-"));

                User(queryKeyExactMatch).$loaded().then(function (snapshot) {
                    //check if localIsReady and it is not null
                    if(snapshot.localIsReady === true && snapshot.localIsReady !== null && snapshot.localIsReady !== undefined){
                        $scope.searchExactResult = User(queryKeyExactMatch);
                        //TODO Search Locations
                        //var userLocations =  Profile.getUserLocations();
                        if($scope.searchResultsExactMatch.length === 0){
                            $scope.localsFoundExactMatch++;
                            $scope.searchResultsExactMatch.push($scope.searchExactResult);
                            allLocals.push(queryKeyExactMatch);
                        } else {
                            var foundExactMatch = false;
                            angular.forEach($scope.searchResultsExactMatch, function (value, key) {
                                if(!foundExactMatch){
                                    if($scope.searchExactResult.$id === value.$id){
                                        foundExactMatch = true;
                                    } else {
                                    }
                                }
                            });
                            if(foundExactMatch){
                            }else {
                                $scope.localsFoundExactMatch++;
                                $scope.searchResultsExactMatch.push($scope.searchExactResult);
                                allLocals.push(queryKeyExactMatch);
                            }
                        }
                    }
                });
            };

            var geoFire = new GeoFire(SearchLocationRef);
            var geoFirePhotos = new GeoFire(LocationPhotosRef);
            var geoFireExactMatch = new GeoFire(SearchLocationRef);

            var geoQueryPhotos = geoFirePhotos.query({
                center: [savedSearch[0].geometry.location.lat(), savedSearch[0].geometry.location.lng()],
                radius: 500000
            });

            var geoQueryExactMatch = geoFireExactMatch.query({
                center: [savedSearch[0].geometry.location.lat(), savedSearch[0].geometry.location.lng()],
                radius: 1
            });

            var onKeyEnteredExactMatchRegistration = geoQueryExactMatch.on("key_entered", function(key, location, distance) {
                tempLocalExactMatch += 1;
                SaveSearch.setUserSearch(null);
                searchExactMatch(key);
            });

            var photos = [];
            var photoDistance = [];

            var leastDistanceKey = '';

            var onKeyEntered = geoQueryPhotos.on("key_entered", function(key, location, distance) {
                photoDistance.push({dist : distance, photoKey : key});
            });


            $scope.exactMatch = false;
            $scope.closeBySearch = false;


            var onReadyRegistrationExactMatch = geoQueryExactMatch.on("ready", function() {
                blockUI.stop();
                if(tempLocalExactMatch === 0 || tempLocalExactMatch === null ){
                    //$state.go('search.coming-soon',{});
                    $scope.exactMatch = true;
                }

                //********************* 50 Mile ******************************

                setTimeout(function () {
                    var geoQuery = geoFire.query({
                        center: [savedSearch[0].geometry.location.lat(), savedSearch[0].geometry.location.lng()],
                        radius: 5
                    });

                    var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
                        tempLocal += 1;
                        //TODO have to clear Search service because otherwise user can go to Coming soon page
                        SaveSearch.setUserSearch(null);
                        search(key);
                    });

                    var onReadyRegistration = geoQuery.on("ready", function() {
                        blockUI.stop();

                        if(tempLocal === 0 || tempLocal === null){
                            $scope.closeBySearch = true;
                        }
                    });
                },2000)

            });

            var onReady = geoQueryPhotos.on("ready", function() {
                photoDistance.sort(function (val1, val2) {
                    return val1.dist - val2.dist
                });

                if(photoDistance.length > 0){
                    var keySotred = photoDistance[0].photoKey;
                    var keyStored = keySotred.substring(0,keySotred.indexOf("_oO_DUDEDUDE_Oo_"));
                    var url = atob(keyStored);
                    $scope.photoURL = url;
                } else {
                    $scope.photoURL = 'https://www.filepicker.io/api/file/DGouJ1aQTamSGERVVNhQ';
                }
                blockUI.stop();
            });

        } else {
            blockUI.stop();
            CoreService.toastError(gettextCatalog.getString('Place needed!'), gettextCatalog.getString('Pick a place and search, if the problem still persist contact us at info@yourlocalcousin.com'));
            $state.go('home');
        }


        // COMING SOON LOGIC

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

