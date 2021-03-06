/**
 * Created by TJ on 8/28/15.
 */

var app = angular.module('com.ylc.profile.create');

app.controller('CreateAboutCTRL',function(CoreService,$state,authFB,profile,$scope,gettextCatalog,Profile,User,userData,Register,notify,blockUI){
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
                    $scope.uploadedImages = [];
                    $scope.uploadedVideos = [];

                    $scope.autocompleteOptions = {
                        types: ['(regions)']
                    };

        //****************************Interest ****************************************
        $scope.selectedInterests = Profile.getUserInterests(authFB.uid);
        var userInterestsCount = 0;
        Profile.getUserInterests(authFB.uid).$loaded(function (userInterests) {
            userInterestsCount = userInterests.length;
        });

        $scope.interestTagAdded = function (interest) {
            if(interest.$id){
                Profile.addInterestToProfile(interest,authFB.uid);
                userInterestsCount++;
            } else {

            }
        };

        $scope.interestTagRemoved = function ($interestTag) {
            if($interestTag.$id){
                Profile.removeInterestFromProfile($interestTag.$id,authFB.uid).then(function () {
                    $scope.selectedInterests = Profile.getUserInterests(authFB.uid);
                    userInterestsCount--;
                }, function (error) {

                });
            } else {

            }
        };

        $scope.loadInterestsTags = function ($query) {
            return Profile.getInterests().$loaded().then(function (listOfInterests) {
                return listOfInterests.filter(function (interest) {
                    return interest.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
                })
            });
        };

        $scope.interestTagAdding = function (interest) {
            if(interest.$id){
                if(userInterestsCount < 7){
                    return true;
                } else {
                    CoreService.toastError(gettextCatalog.getString('On 7 Interests allowed!'), gettextCatalog.getString('Only 7 interests allowed, try removing some and try again'));
                    return false;
                }
            } else {
                CoreService.toastError(gettextCatalog.getString('Select Interest from the dropdown menu!'), gettextCatalog.getString('Please select Interest from the dropdown menu, if you can\'t find the interest you looking for please contact info@yourlocalcousin.com and we will add it for you'));
                return false;
            }
        };

        $scope.invalidInterestTag = function ($tag) {

        };

        //****************************Language ****************************************

        $scope.selectedLanguages = Profile.getUserLanguages(authFB.uid);

        $scope.languageTagAdded = function (language) {
            if(language.$id){
                Profile.addLanguageToProfile(language,authFB.uid);
            } else {

            }
        };

        $scope.languageTagRemoved = function ($languageTag) {
            if($languageTag.$id){
                Profile.removeLanguageFromProfile($languageTag.$id,authFB.uid).then(function () {
                    $scope.selectedLanguages = Profile.getUserLanguages(authFB.uid);
                }, function (error) {

                });
            } else {

            }
        };
        $scope.invalidLanguageTag = function ($tag) {
            //CoreService.alertError(gettextCatalog.getString('Error! \n Please select a language from the drop down!'), gettextCatalog.getString($tag.name + ' is an incorrect Language,' + ' \nPlease select a language from the drop down'));
            CoreService.toastError(gettextCatalog.getString('Select a language from the drop-down options!'), gettextCatalog.getString('Please select Language from the drop-down, if you can\'t find the language you looking for please contact info@yourlocalcousin.com and we will add it for you'));
        };

        $scope.languageTagAdding = function (language) {
            if(language.$id){
                return true;
            } else {
                return false;
            }
        };

        $scope.loadLanguagesTags = function ($query) {
            return Profile.getLanguages().$loaded().then(function (listOfLanguages) {
                return listOfLanguages.filter(function (language) {
                    return language.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
                })
            });
        };

        //****************************Advise ****************************************

        $scope.selectedAdvise = Profile.getUserAdvises(authFB.uid);

        var userAdviseCount = 0;
        Profile.getUserAdvises(authFB.uid).$loaded(function (userAdvise) {
            userAdviseCount = userAdvise.length;
        });

        $scope.adviseTagAdded = function (advise) {
            if(advise.$id){
                Profile.addAdviseToProfile(advise,authFB.uid);
                userAdviseCount++;
            } else {
                //CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
            }
        };

        $scope.adviseTagRemoved = function ($adviseTag) {
            if($adviseTag.$id) {
                Profile.removeAdviseFromProfile($adviseTag.$id, authFB.uid).then(function () {
                    $scope.selectedAdvise = Profile.getUserAdvises(authFB.uid);
                    userAdviseCount--;
                }, function (error) {
                });
            } else {

            }
        };

        $scope.adviseTagAdding = function (advise) {
            if(advise.$id){
                if(userAdviseCount < 6){
                    return true;
                } else {
                    CoreService.toastError(gettextCatalog.getString('Only 5 types of advise allowed!'), gettextCatalog.getString('Only 5 types of advise allowed, try removing some and try again'));
                    return false;
                }
            } else {
                CoreService.toastError(gettextCatalog.getString('Select Advise from the drop-down options!'), gettextCatalog.getString('Please select Advise from the drop-down options, if you can\'t find the advise you looking for please contact info@yourlocalcousin.com and we will add it for you'));
                return false;
            }
        };

        $scope.loadAdvisesTags = function ($query) {
            return Profile.getAdvises().$loaded().then(function (listOfAdvises) {
                return listOfAdvises.filter(function (advise) {
                    return advise.type.toLowerCase().indexOf($query.toLowerCase()) != -1;
                })
            });
        };

        $scope.invalidAdviseTag = function ($tag) {
            //CoreService.alertError(gettextCatalog.getString('Error! \n Please select an advise from the drop down!'), gettextCatalog.getString($tag.type + ' is an incorrect advise,' + ' \nPlease select an advise from the drop down'));
        };

        //**************************** Advise End****************************************

        $scope.coverPhotos = Profile.getCoverPhotos(authFB.uid);

        $scope.videoUploaded = Profile.getVideos(authFB.uid);

        $scope.uploadFile = function(){
            if($scope.coverPhotos.length >= 5){
                CoreService.toastError(gettextCatalog.getString('Only 5 photos allowed'),gettextCatalog.getString('Please delete few and try again!'));
            } else {
                filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
                filepicker.pickAndStore({
                        maxFiles: 5 - $scope.coverPhotos.length,
                        mimetype: 'image/*',
                        multiple: true,
                        maxSize: 1024*1024*5
                    },{
                        path : "/coverPhotos/"
                    },
                    function(Blobs){
                        angular.forEach(Blobs, function (value, key) {
                            $scope.uploadedImages.push(value.url);
                            Profile.addCoverPhotoToProfile(authFB.uid,value).then(function( ){
                            },function(){
                            })
                        });
                    }, function (error) {
                        CoreService.toastError(gettextCatalog.getString('Photo not be saved'),gettextCatalog.getString('Photo not saved, Please try again!'));
                    }
                );
            }
        };

        $scope.deletePhoto = function (blob) {
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.remove(
                blob,
                function(){
                    Profile.deleteCoverPhoto(blob.$id,authFB.uid);
                }
            );
        };

        $scope.uploadVideoFile = function(){
            if($scope.videoUploaded.length >= 1){
                CoreService.toastError(gettextCatalog.getString('Only 1 video allowed'),gettextCatalog.getString('Please delete and try again!'));
            } else {
                filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
                filepicker.pickAndStore({
                        maxFiles: 1-$scope.videoUploaded.length,
                        mimetype: 'video/avi, video/quicktime, video/mpeg, video/mp4, video/ogg,video/webm, video/x-ms-wmv, video/x-flv, video/x-matroska,video/x-msvideo, video/x-dv',
                        maxSize: 10485760
                    },{
                        path : "/videos/"
                    },
                    function(Blobs){
                        angular.forEach(Blobs, function (value, key) {
                            $scope.uploadedVideos.push(value.url);
                            Profile.addVideoToProfile(authFB.uid,value).then(function(){
                            },function(){
                            })
                        });
                    }, function (error) {
                        CoreService.toastError(gettextCatalog.getString('Video not saved'),gettextCatalog.getString('Video not saved, Please try again!'));
                    }
                );
            }
        };

        $scope.deleteVideo = function (blob) {
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.remove(
                blob,
                function(){
                    Profile.deleteVideo(blob.$id,authFB.uid);
                }
            );
        };

        //$scope.profilePoo = [{advise : 'Business traveler'},{advise : 'Study abroad'},{advise : 'Backpacker'},{advise : 'Mobility challenge'}];
        //
        //angular.forEach($scope.profilePoo, function (value,key) {
        //    Profile.addAdvises(value.advise);
        //});

        $scope.locations = Profile.getLocalLocations(authFB.uid);

        var addedLocations = 0;
        $scope.locations.$loaded(function (data) {
            addedLocations = data.length;
        });
        console.log($scope.locations);


        //TODO implement logic of remove city which is simpler if it fits
        //TODO tell user they have unsaved city

        $scope.saveLocation = function (city,index) {
            if(city){
                blockUI.start('Saving Location ...');
                if(city.address_components[0].types[0] === 'country'){
                    blockUI.stop();
                    CoreService.toastError(gettextCatalog.getString('Cannot add country!'), gettextCatalog.getString('Please add a city instead!'));
                    return;
                }
                if(index){
                    Profile.getLocation(index,authFB.uid).$loaded().then(function (data) {
                        var removeCountryObject = {};
                        var removeCCountry = false;

                        if(data.country !== null && data.country !== undefined && data.country !== ''){
                            removeCCountry = true;
                            removeCountryObject.countryPlaceId = data.country;
                        }

                        removeCountryObject.locationType = data.locationType;
                        removeCountryObject.localId = authFB.uid;
                        removeCountryObject.removeCCountry = removeCCountry;
                        removeCountryObject._state = "removeCountryLocation_start";

                        Profile.removeExistingUserCountry(removeCountryObject).then(function (queueRemoveCountryData) {
                            queueRemoveCountryData.on('value', function (queueRemoveCountryDataSnap) {
                                if(queueRemoveCountryDataSnap.val()._state === 'removeCountryLocation_error'){
                                    //TODO Error removing location to be handled
                                    blockUI.stop();
                                }
                                if(queueRemoveCountryDataSnap.val()._state === 'removeCountryLocation_finished'){
                                    var removeStateObject = {};
                                    var removeSState = false;
                                    var removeSCountry = false;

                                    if(data.state !== null && data.state !== undefined && data.state !== ''){
                                        removeSState = true;
                                        removeStateObject.statePlaceId = data.state;
                                    }

                                    if(data.country !== null && data.country !== undefined && data.country !== ''){
                                        removeSCountry = true;
                                        removeStateObject.countryPlaceId = data.country;
                                    }

                                    removeStateObject.localId = authFB.uid;
                                    removeStateObject._state = "removeStateLocation_start";
                                    removeStateObject.removeSState = removeSState;

                                    Profile.removeExistingUserState(removeStateObject).then(function (queueRemoveStateData) {
                                        queueRemoveStateData.on('value', function (queueRemoveStateDataSnap) {
                                            if(queueRemoveStateDataSnap.val()._state === 'removeStateLocation_error'){
                                                blockUI.stop();
                                            }
                                            if(queueRemoveStateDataSnap.val()._state === 'removeStateLocation_finished'){
                                                var removeCityObject = {};

                                                if(data.$id !== null && data.$id !== undefined){
                                                    removeCityObject.cityPlaceId = data.$id;
                                                }

                                                removeCityObject.localId = authFB.uid;
                                                removeCityObject._state = "removeCityLocation_start";

                                                Profile.removeExistingUserLocation(removeCityObject).then(function (queueRemoveCityData) {
                                                    queueRemoveCityData.on('value', function (queueRemoveCityDataSnap) {
                                                        if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_error'){
                                                            blockUI.stop();
                                                        }
                                                        ///---------------------------------REMOVE CITY STATE AND COUNTRY FINISHED HERE--------------------------------------
                                                        if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_finished'){
                                                            var geocoder = new google.maps.Geocoder();
                                                            var locationDataObj = {};
                                                            var locationAdded = false;
                                                            locationDataObj.userData = {};
                                                            //locationDataObj.userData.livedHereFor = years;
                                                            //locationDataObj.userData.relationshipToCity = relationship;
                                                            locationDataObj.userData.dateCreated = Firebase.ServerValue.TIMESTAMP;

                                                            geocoder.geocode({'placeId' : city.place_id}, function (locationResults, status) {
                                                                if(status == google.maps.GeocoderStatus.OK){
                                                                    angular.forEach(locationResults, function (valueLocation, keyLocation) {
                                                                        if((valueLocation.types[0] === 'locality')
                                                                            || (valueLocation.types[0] === 'administrative_area_level_1' )
                                                                            || (valueLocation.types[0] === 'country' )
                                                                            || (valueLocation.types[0] === 'administrative_area_level_2' )
                                                                            || (valueLocation.types[0] === 'sublocality_level_1' )
                                                                            || (valueLocation.types[0] === 'sublocality_level_2' )
                                                                            || (valueLocation.types[0] === 'sublocality_level_3' )
                                                                            || (valueLocation.types[0] === 'sublocality_level_4' )
                                                                            || (valueLocation.types[0] === 'sublocality_level_5' )){

                                                                            switch (valueLocation.types[0]){
                                                                                case 'locality' : locationDataObj.userData.locationType = 'locality';
                                                                                    break;
                                                                                case 'administrative_area_level_1' : locationDataObj.userData.locationType = 'administrative_area_level_1';
                                                                                    break;
                                                                                case 'administrative_area_level_2' : locationDataObj.userData.locationType = 'administrative_area_level_2';
                                                                                    break;
                                                                                case 'country' : locationDataObj.userData.locationType = 'country';
                                                                                    break;
                                                                                case 'sublocality_level_1' : locationDataObj.userData.locationType = 'sublocality_level_1';
                                                                                    break;
                                                                                case 'sublocality_level_2' : locationDataObj.userData.locationType = 'sublocality_level_2';
                                                                                    break;
                                                                                case 'sublocality_level_3' : locationDataObj.userData.locationType = 'sublocality_level_3';
                                                                                    break;
                                                                                case 'sublocality_level_4' : locationDataObj.userData.locationType = 'sublocality_level_4';
                                                                                    break;
                                                                                case 'sublocality_level_5' : locationDataObj.userData.locationType = 'sublocality_level_5';
                                                                                    break;
                                                                                case 'sublocality' : locationDataObj.userData.locationType = 'sublocality';
                                                                                    break;
                                                                                case 'postal_code' : locationDataObj.userData.locationType = 'postal_code';
                                                                                    break;
                                                                                default : locationDataObj.userData.locationType = 'default';

                                                                            }

                                                                            locationDataObj.localId = authFB.uid;
                                                                            locationDataObj["_state"] = 'addPlaceLocation_start';

                                                                            locationDataObj.placeLocationGeometry = {};
                                                                            locationDataObj.placeLocationGeometry.latitude = locationResults[keyLocation].geometry.location.lat();
                                                                            locationDataObj.placeLocationGeometry.longitude = locationResults[keyLocation].geometry.location.lng();

                                                                            var locLat1 = locationResults[keyLocation].geometry.location.lat();
                                                                            var locLng1 = locationResults[keyLocation].geometry.location.lng();
                                                                            delete locationResults[keyLocation].geometry.location;

                                                                            locationResults[keyLocation].geometry.location = {};
                                                                            locationResults[keyLocation].geometry.location.lattitude = locLat1;
                                                                            locationResults[keyLocation].geometry.location.longitude = locLng1;

                                                                            locationDataObj.placeLocationData = locationResults[keyLocation];

                                                                            var country;
                                                                            var state;
                                                                            angular.forEach(locationResults[keyLocation].address_components, function (valueS, keyS) {
                                                                                if(valueS.types[0] === "administrative_area_level_1"){
                                                                                    state = valueS.long_name;
                                                                                }
                                                                                if(valueS.types[0] === "country"){
                                                                                    country = valueS.long_name;
                                                                                }
                                                                            });

                                                                            Profile.saveLocation(locationDataObj).then(function (queueCityData) {
                                                                                queueCityData.on('value', function (queueCityDataSnapshot) {
                                                                                    if (queueCityDataSnapshot.val()._state === 'addPlaceLocation_error' || queueCityDataSnapshot.val()._state === 'addLocation_error') {
                                                                                        CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                        blockUI.stop();
                                                                                    }

                                                                                    if(queueCityDataSnapshot.val()._state === 'addLocation_finished'){
                                                                                        locationAdded = true;
                                                                                        CoreService.toastSuccess(gettextCatalog.getString('Location Saved'),gettextCatalog.getString(''));
                                                                                        if(state && country){
                                                                                            var stateDataObj = {};
                                                                                            stateDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                                                            stateDataObj.localId = authFB.uid;
                                                                                            stateDataObj["_state"] = 'addStateLocation_start';
                                                                                            var stateAdded = false;

                                                                                            var countryDataObj = {};
                                                                                            countryDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                                                            countryDataObj.localId = authFB.uid;
                                                                                            countryDataObj["_state"] = 'addCountryLocation_start';
                                                                                            var countryAdded = false;

                                                                                            geocoder.geocode({'address' : state + ',' + country}, function (stateResults, status) {
                                                                                                if(status == google.maps.GeocoderStatus.OK){
                                                                                                    angular.forEach(stateResults, function (valueState, keyState) {
                                                                                                        if(valueState.types[0] === 'administrative_area_level_1' && !stateAdded){
                                                                                                            stateDataObj.stateGeometry = {};
                                                                                                            stateDataObj.stateGeometry.latitude = stateResults[keyState].geometry.location.lat();
                                                                                                            stateDataObj.stateGeometry.longitude = stateResults[keyState].geometry.location.lng();

                                                                                                            var stateLat1 = stateResults[keyState].geometry.location.lat();
                                                                                                            var stateLng1 = stateResults[keyState].geometry.location.lng();

                                                                                                            delete stateResults[keyState].geometry.location;
                                                                                                            stateResults[keyState].geometry.location = {};

                                                                                                            stateResults[keyState].geometry.location.lattitude = stateLat1;
                                                                                                            stateResults[keyState].geometry.location.longitude = stateLng1;

                                                                                                            stateDataObj.stateData = stateResults[keyState];

                                                                                                            Profile.saveState(stateDataObj).then(function (stateQueueData) {
                                                                                                                stateQueueData.on('value', function (stateQueueDataSnapshot) {
                                                                                                                    if (stateQueueDataSnapshot.val()._state === 'addStateLocation_error' || stateQueueDataSnapshot.val()._state === 'addState_error') {
                                                                                                                        CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                                                        blockUI.stop();
                                                                                                                    }

                                                                                                                    if(stateQueueDataSnapshot.val()._state === 'addState_finished'){
                                                                                                                        stateAdded = true;
                                                                                                                        stateQueueData.off();
                                                                                                                        stateQueueData.ref().remove(function (error) {
                                                                                                                            if(error){
                                                                                                                            } else {
                                                                                                                                CoreService.toastSuccess(gettextCatalog.getString('State Saved'),gettextCatalog.getString(''));
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }
                                                                                                                })
                                                                                                            })
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    //blockUI.stop();
                                                                                                }
                                                                                            });

                                                                                            geocoder.geocode({'address' : country}, function (countryResults, status) {
                                                                                                if(status == google.maps.GeocoderStatus.OK){
                                                                                                    angular.forEach(countryResults, function (valueCountry, keyCountry) {
                                                                                                        if(valueCountry.types[0] === 'country' && !countryAdded){
                                                                                                            countryDataObj.countryGeometry = {};
                                                                                                            countryDataObj.countryGeometry.latitude = countryResults[keyCountry].geometry.location.lat();
                                                                                                            countryDataObj.countryGeometry.longitude = countryResults[keyCountry].geometry.location.lng();

                                                                                                            var countryLat1 = countryResults[keyCountry].geometry.location.lat();
                                                                                                            var countryLng1 = countryResults[keyCountry].geometry.location.lng();

                                                                                                            delete countryResults[keyCountry].geometry.location;
                                                                                                            countryResults[keyCountry].geometry.location = {};

                                                                                                            countryResults[keyCountry].geometry.location.lattitude = countryLat1;
                                                                                                            countryResults[keyCountry].geometry.location.longitude = countryLng1;

                                                                                                            countryDataObj.countryData = countryResults[keyCountry];

                                                                                                            Profile.saveCountry(countryDataObj).then(function (countryQueueData) {
                                                                                                                countryQueueData.on('value', function (countryQueueDataSnapshot) {
                                                                                                                    if (countryQueueDataSnapshot.val()._state === 'addCountryLocation_error' || countryQueueDataSnapshot.val()._state === 'addCountry_error') {
                                                                                                                        CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                                                        blockUI.stop();
                                                                                                                    }

                                                                                                                    if(countryQueueDataSnapshot.val()._state === 'addCountry_finished'){
                                                                                                                        countryAdded = true;
                                                                                                                        blockUI.stop();
                                                                                                                        countryQueueData.off();
                                                                                                                        countryQueueData.ref().remove(function (error) {
                                                                                                                            if(error){

                                                                                                                            } else {
                                                                                                                                queueCityData.off();
                                                                                                                                queueCityData.ref().remove(function (error) {
                                                                                                                                    if(error){

                                                                                                                                    } else {
                                                                                                                                        addedLocations++;
                                                                                                                                        console.log(addedLocations);
                                                                                                                                        //$scope.locations.splice($scope.locations.indexOf(city), 1);
                                                                                                                                        CoreService.toastSuccess(gettextCatalog.getString('Country Saved'),gettextCatalog.getString(''));
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }
                                                                                                                })
                                                                                                            })
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    blockUI.stop();
                                                                                                }
                                                                                            });
                                                                                        }

                                                                                        if(country && !state){
                                                                                            var countryDataObj = {};
                                                                                            countryDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                                                            countryDataObj.localId = authFB.uid;
                                                                                            countryDataObj["_state"] = 'addCountryLocation_start';
                                                                                            var countryAdded = false;

                                                                                            geocoder.geocode({'address' : country}, function (countryResults, status) {
                                                                                                if(status == google.maps.GeocoderStatus.OK){
                                                                                                    angular.forEach(countryResults, function (valueCountry, keyCountry) {
                                                                                                        if(valueCountry.types[0] === 'country' && !countryAdded){
                                                                                                            countryDataObj.countryGeometry = {};
                                                                                                            countryDataObj.countryGeometry.latitude = countryResults[keyCountry].geometry.location.lat();
                                                                                                            countryDataObj.countryGeometry.longitude = countryResults[keyCountry].geometry.location.lng();

                                                                                                            var countryLat2 = countryResults[keyCountry].geometry.location.lat();
                                                                                                            var countryLng2 = countryResults[keyCountry].geometry.location.lng();

                                                                                                            delete countryResults[keyCountry].geometry.location;

                                                                                                            countryResults[keyCountry].geometry.location = {};
                                                                                                            countryResults[keyCountry].geometry.location.lattitude = countryLat2;
                                                                                                            countryResults[keyCountry].geometry.location.longitude = countryLng2;

                                                                                                            countryDataObj.countryData = countryResults[keyCountry];

                                                                                                            Profile.saveCountry(countryDataObj).then(function (countryQueueData) {
                                                                                                                countryQueueData.on('value', function (countryQueueDataSnapshot) {
                                                                                                                    if (countryQueueDataSnapshot.val()._state === 'addCountryLocation_error' || countryQueueDataSnapshot.val()._state === 'addCountry_error') {
                                                                                                                        CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                                                        blockUI.stop();
                                                                                                                    }

                                                                                                                    if(countryQueueDataSnapshot.val()._state === 'addCountry_finished'){
                                                                                                                        blockUI.stop();
                                                                                                                        countryAdded = true;
                                                                                                                        countryQueueData.off();
                                                                                                                        countryQueueData.ref().remove(function (error) {
                                                                                                                            if(error){

                                                                                                                            } else {
                                                                                                                                queueCityData.off();
                                                                                                                                queueCityData.ref().remove(function (error) {
                                                                                                                                    if(error){

                                                                                                                                    }
                                                                                                                                    else{
                                                                                                                                        addedLocations++;
                                                                                                                                        console.log(addedLocations);
                                                                                                                                        //$scope.locations.splice($scope.locations.indexOf(city), 1);
                                                                                                                                        CoreService.toastSuccess(gettextCatalog.getString('Country Saved'),gettextCatalog.getString(''));
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                })
                                                                                                            })
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    blockUI.stop();
                                                                                                }
                                                                                            });
                                                                                        }

                                                                                        if(!country && state){
                                                                                            var stateDataObj = {};
                                                                                            stateDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                                                            stateDataObj.localId = authFB.uid;
                                                                                            stateDataObj["_state"] = 'addStateLocation_start';
                                                                                            var stateAdded = false;

                                                                                            geocoder.geocode({'address' : state}, function (stateResults, status) {
                                                                                                if(status == google.maps.GeocoderStatus.OK){
                                                                                                    angular.forEach(stateResults, function (valueState, keyState) {
                                                                                                        if(valueState.types[0] === 'administrative_area_level_1' && !stateAdded){
                                                                                                            stateDataObj.stateGeometry = {};
                                                                                                            stateDataObj.stateGeometry.latitude = stateResults[keyState].geometry.location.lat();
                                                                                                            stateDataObj.stateGeometry.longitude = stateResults[keyState].geometry.location.lng();

                                                                                                            var stateLat2 = stateResults[keyState].geometry.location.lat();
                                                                                                            var stateLng2 = stateResults[keyState].geometry.location.lng();

                                                                                                            delete stateResults[keyState].geometry.location;
                                                                                                            stateResults[keyState].geometry.location = {};

                                                                                                            stateResults[keyState].geometry.location.lattitude = stateLat2;
                                                                                                            stateResults[keyState].geometry.location.longitude = stateLng2;

                                                                                                            stateDataObj.stateData = stateResults[keyState];

                                                                                                            Profile.saveState(stateDataObj).then(function (stateQueueData) {
                                                                                                                stateQueueData.on('value', function (stateQueueDataSnapshot) {
                                                                                                                    if (stateQueueDataSnapshot.val()._state === 'addStateLocation_error' || stateQueueDataSnapshot.val()._state === 'addStateLocation_error') {
                                                                                                                        CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                                                        blockUI.stop();
                                                                                                                    }

                                                                                                                    if(stateQueueDataSnapshot.val()._state === 'addState_finished'){
                                                                                                                        blockUI.stop();
                                                                                                                        stateAdded = true;
                                                                                                                        stateQueueData.off();
                                                                                                                        stateQueueData.ref().remove(function (error) {
                                                                                                                            if(error){
                                                                                                                            } else {
                                                                                                                                queueCityData.off();
                                                                                                                                queueCityData.ref().remove(function (error) {
                                                                                                                                    if(error){
                                                                                                                                    }
                                                                                                                                    else{
                                                                                                                                        addedLocations++;
                                                                                                                                        console.log(addedLocations);
                                                                                                                                        //$scope.locations.splice($scope.locations.indexOf(city), 1);
                                                                                                                                        CoreService.toastSuccess(gettextCatalog.getString('State Saved'),gettextCatalog.getString(''));
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                })
                                                                                                            })
                                                                                                        }
                                                                                                    })
                                                                                                } else {
                                                                                                    blockUI.stop();
                                                                                                }
                                                                                            });
                                                                                        }

                                                                                        if(!country && !state){
                                                                                            addedLocations++;
                                                                                            console.log(addedLocations);
                                                                                            blockUI.stop();
                                                                                        }
                                                                                    }
                                                                                })
                                                                            })
                                                                        }
                                                                    });
                                                                } else {
                                                                    blockUI.stop();
                                                                }
                                                            });
                                                        }
                                                    })
                                                })

                                            }
                                        })
                                    })
                                }
                            })
                        })
                    }).catch(function (error) {
                        blockUI.stop();
                    })
                } else {
                    var geocoder = new google.maps.Geocoder();
                    var locationDataObj = {};
                    var locationAdded = false;
                    locationDataObj.userData = {};
                    //locationDataObj.userData.livedHereFor = years;
                    //locationDataObj.userData.relationshipToCity = relationship;
                    locationDataObj.userData.dateCreated = Firebase.ServerValue.TIMESTAMP;

                    geocoder.geocode({'placeId' : city.place_id}, function (locationResults, status) {
                        if(status == google.maps.GeocoderStatus.OK){
                            angular.forEach(locationResults, function (valueLocation, keyLocation) {
                                if((valueLocation.types[0] === 'locality')
                                    || (valueLocation.types[0] === 'administrative_area_level_1' )
                                    || (valueLocation.types[0] === 'country' )
                                    || (valueLocation.types[0] === 'administrative_area_level_2' )
                                    || (valueLocation.types[0] === 'sublocality_level_1' )
                                    || (valueLocation.types[0] === 'sublocality_level_2' )
                                    || (valueLocation.types[0] === 'sublocality_level_3' )
                                    || (valueLocation.types[0] === 'sublocality_level_4' )
                                    || (valueLocation.types[0] === 'sublocality_level_5' )){

                                    switch (valueLocation.types[0]){
                                        case 'locality' : locationDataObj.userData.locationType = 'locality';
                                            break;
                                        case 'administrative_area_level_1' : locationDataObj.userData.locationType = 'administrative_area_level_1';
                                            break;
                                        case 'administrative_area_level_2' : locationDataObj.userData.locationType = 'administrative_area_level_2';
                                            break;
                                        case 'country' : locationDataObj.userData.locationType = 'country';
                                            break;
                                        case 'sublocality_level_1' : locationDataObj.userData.locationType = 'sublocality_level_1';
                                            break;
                                        case 'sublocality_level_2' : locationDataObj.userData.locationType = 'sublocality_level_2';
                                            break;
                                        case 'sublocality_level_3' : locationDataObj.userData.locationType = 'sublocality_level_3';
                                            break;
                                        case 'sublocality_level_4' : locationDataObj.userData.locationType = 'sublocality_level_4';
                                            break;
                                        case 'sublocality_level_5' : locationDataObj.userData.locationType = 'sublocality_level_5';
                                            break;
                                        case 'sublocality' : locationDataObj.userData.locationType = 'sublocality';
                                            break;
                                        case 'postal_code' : locationDataObj.userData.locationType = 'postal_code';
                                            break;
                                        default : locationDataObj.userData.locationType = 'default';

                                    }
                                    locationDataObj.localId = authFB.uid;
                                    locationDataObj["_state"] = 'addPlaceLocation_start';

                                    locationDataObj.placeLocationGeometry = {};
                                    locationDataObj.placeLocationGeometry.latitude = locationResults[keyLocation].geometry.location.lat();
                                    locationDataObj.placeLocationGeometry.longitude = locationResults[keyLocation].geometry.location.lng();

                                    var locLat1 = locationResults[keyLocation].geometry.location.lat();
                                    var locLng1 = locationResults[keyLocation].geometry.location.lng();

                                    delete locationResults[keyLocation].geometry.location;
                                    locationResults[keyLocation].geometry.location = {};

                                    locationResults[keyLocation].geometry.location.lattitude = locLat1;
                                    locationResults[keyLocation].geometry.location.longitude = locLng1;

                                    locationDataObj.placeLocationData = locationResults[keyLocation];

                                    var country;
                                    var state;
                                    angular.forEach(locationResults[keyLocation].address_components, function (valueS, keyS) {
                                        if(valueS.types[0] === "administrative_area_level_1"){
                                            state = valueS.long_name;
                                        }
                                        if(valueS.types[0] === "country"){
                                            country = valueS.long_name;
                                        }
                                    });

                                    Profile.saveLocation(locationDataObj).then(function (queueCityData) {
                                        queueCityData.on('value', function (queueCityDataSnapshot) {
                                            if (queueCityDataSnapshot.val()._state === 'addPlaceLocation_error' || queueCityDataSnapshot.val()._state === 'addLocation_error') {
                                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                blockUI.stop();
                                            }

                                            if(queueCityDataSnapshot.val()._state === 'addLocation_finished'){
                                                locationAdded = true;
                                                CoreService.toastSuccess(gettextCatalog.getString('Location Saved'),gettextCatalog.getString(''));
                                                if(state && country){
                                                    var stateDataObj = {};
                                                    stateDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                    stateDataObj.localId = authFB.uid;
                                                    stateDataObj["_state"] = 'addStateLocation_start';
                                                    var stateAdded = false;

                                                    var countryDataObj = {};
                                                    countryDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                    countryDataObj.localId = authFB.uid;
                                                    countryDataObj["_state"] = 'addCountryLocation_start';
                                                    var countryAdded = false;

                                                    geocoder.geocode({'address' : state + ',' + country}, function (stateResults, status) {
                                                        if(status == google.maps.GeocoderStatus.OK){
                                                            angular.forEach(stateResults, function (valueState, keyState) {
                                                                if(valueState.types[0] === 'administrative_area_level_1' && !stateAdded){
                                                                    stateDataObj.stateGeometry = {};
                                                                    stateDataObj.stateGeometry.latitude = stateResults[keyState].geometry.location.lat();
                                                                    stateDataObj.stateGeometry.longitude = stateResults[keyState].geometry.location.lng();

                                                                    var stateLat1 = stateResults[keyState].geometry.location.lat();
                                                                    var stateLng1 = stateResults[keyState].geometry.location.lng();

                                                                    delete stateResults[keyState].geometry.location;
                                                                    stateResults[keyState].geometry.location = {};

                                                                    stateResults[keyState].geometry.location.lattitude = stateLat1;
                                                                    stateResults[keyState].geometry.location.longitude = stateLng1;

                                                                    stateDataObj.stateData = stateResults[keyState];

                                                                    Profile.saveState(stateDataObj).then(function (stateQueueData) {
                                                                        stateQueueData.on('value', function (stateQueueDataSnapshot) {
                                                                            if (stateQueueDataSnapshot.val()._state === 'addStateLocation_error' || stateQueueDataSnapshot.val()._state === 'addState_error') {
                                                                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                blockUI.stop();
                                                                            }

                                                                            if(stateQueueDataSnapshot.val()._state === 'addState_finished'){
                                                                                stateAdded = true;
                                                                                stateQueueData.off();
                                                                                stateQueueData.ref().remove(function (error) {
                                                                                    if(error){
                                                                                    } else {
                                                                                        CoreService.toastSuccess(gettextCatalog.getString('State Saved'),gettextCatalog.getString(''));
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            //blockUI.stop();
                                                        }
                                                    });

                                                    geocoder.geocode({'address' : country}, function (countryResults, status) {
                                                        if(status == google.maps.GeocoderStatus.OK){
                                                            angular.forEach(countryResults, function (valueCountry, keyCountry) {
                                                                if(valueCountry.types[0] === 'country' && !countryAdded){
                                                                    countryDataObj.countryGeometry = {};
                                                                    countryDataObj.countryGeometry.latitude = countryResults[keyCountry].geometry.location.lat();
                                                                    countryDataObj.countryGeometry.longitude = countryResults[keyCountry].geometry.location.lng();

                                                                    var countryLat1 = countryResults[keyCountry].geometry.location.lat();
                                                                    var countryLng1 = countryResults[keyCountry].geometry.location.lng();

                                                                    delete countryResults[keyCountry].geometry.location;
                                                                    countryResults[keyCountry].geometry.location = {};

                                                                    countryResults[keyCountry].geometry.location.lattitude = countryLat1;
                                                                    countryResults[keyCountry].geometry.location.longitude = countryLng1;

                                                                    countryDataObj.countryData = countryResults[keyCountry];

                                                                    Profile.saveCountry(countryDataObj).then(function (countryQueueData) {
                                                                        countryQueueData.on('value', function (countryQueueDataSnapshot) {
                                                                            if (countryQueueDataSnapshot.val()._state === 'addCountryLocation_error' || countryQueueDataSnapshot.val()._state === 'addCountry_error') {
                                                                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                blockUI.stop();
                                                                            }

                                                                            if(countryQueueDataSnapshot.val()._state === 'addCountry_finished'){
                                                                                countryAdded = true;
                                                                                blockUI.stop();
                                                                                countryQueueData.off();
                                                                                countryQueueData.ref().remove(function (error) {
                                                                                    if(error){

                                                                                    } else {
                                                                                        queueCityData.off();
                                                                                        queueCityData.ref().remove(function (error) {
                                                                                            if(error){

                                                                                            } else {
                                                                                                addedLocations++;
                                                                                                console.log(addedLocations);
                                                                                                CoreService.toastSuccess(gettextCatalog.getString('Country Saved'),gettextCatalog.getString(''));
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            blockUI.stop();
                                                        }
                                                    });
                                                }

                                                if(country && !state){
                                                    var countryDataObj = {};
                                                    countryDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                    countryDataObj.localId = authFB.uid;
                                                    countryDataObj["_state"] = 'addCountryLocation_start';
                                                    var countryAdded = false;

                                                    geocoder.geocode({'address' : country}, function (countryResults, status) {
                                                        if(status == google.maps.GeocoderStatus.OK){
                                                            angular.forEach(countryResults, function (valueCountry, keyCountry) {
                                                                if(valueCountry.types[0] === 'country' && !countryAdded){
                                                                    countryDataObj.countryGeometry = {};
                                                                    countryDataObj.countryGeometry.latitude = countryResults[keyCountry].geometry.location.lat();
                                                                    countryDataObj.countryGeometry.longitude = countryResults[keyCountry].geometry.location.lng();

                                                                    var countryLat2 = countryResults[keyCountry].geometry.location.lat();
                                                                    var countryLng2 = countryResults[keyCountry].geometry.location.lng();

                                                                    delete countryResults[keyCountry].geometry.location;
                                                                    countryResults[keyCountry].geometry.location = {};

                                                                    countryResults[keyCountry].geometry.location.lattitude = countryLat2;
                                                                    countryResults[keyCountry].geometry.location.longitude = countryLng2;


                                                                    countryDataObj.countryData = countryResults[keyCountry];

                                                                    Profile.saveCountry(countryDataObj).then(function (countryQueueData) {
                                                                        countryQueueData.on('value', function (countryQueueDataSnapshot) {
                                                                            if (countryQueueDataSnapshot.val()._state === 'addCountryLocation_error' || countryQueueDataSnapshot.val()._state === 'addCountry_error') {
                                                                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                blockUI.stop();
                                                                            }

                                                                            if(countryQueueDataSnapshot.val()._state === 'addCountry_finished'){
                                                                                blockUI.stop();
                                                                                countryAdded = true;
                                                                                countryQueueData.off();
                                                                                countryQueueData.ref().remove(function (error) {
                                                                                    if(error){

                                                                                    } else {
                                                                                        queueCityData.off();
                                                                                        queueCityData.ref().remove(function (error) {
                                                                                            if(error){

                                                                                            }
                                                                                            else{
                                                                                                addedLocations++;
                                                                                                console.log(addedLocations);
                                                                                                CoreService.toastSuccess(gettextCatalog.getString('Country Saved'),gettextCatalog.getString(''));
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                });
                                                                            }
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            blockUI.stop();
                                                        }
                                                    });
                                                }

                                                if(!country && state){
                                                    var stateDataObj = {};
                                                    stateDataObj.placeLocationPlaceId = locationDataObj.placeLocationData.place_id;
                                                    stateDataObj.localId = authFB.uid;
                                                    stateDataObj["_state"] = 'addStateLocation_start';
                                                    var stateAdded = false;

                                                    geocoder.geocode({'address' : state}, function (stateResults, status) {
                                                        if(status == google.maps.GeocoderStatus.OK){
                                                            angular.forEach(stateResults, function (valueState, keyState) {
                                                                if(valueState.types[0] === 'administrative_area_level_1' && !stateAdded){
                                                                    stateDataObj.stateGeometry = {};
                                                                    stateDataObj.stateGeometry.latitude = stateResults[keyState].geometry.location.lat();
                                                                    stateDataObj.stateGeometry.longitude = stateResults[keyState].geometry.location.lng();

                                                                    var stateLat2 = stateResults[keyState].geometry.location.lat();
                                                                    var stateLng2 = stateResults[keyState].geometry.location.lng();

                                                                    delete stateResults[keyState].geometry.location;

                                                                    stateResults[keyState].geometry.location = {};

                                                                    stateResults[keyState].geometry.location.lattitude = stateLat2;
                                                                    stateResults[keyState].geometry.location.longitude = stateLng2;

                                                                    stateDataObj.stateData = stateResults[keyState];

                                                                    Profile.saveState(stateDataObj).then(function (stateQueueData) {
                                                                        stateQueueData.on('value', function (stateQueueDataSnapshot) {
                                                                            if (stateQueueDataSnapshot.val()._state === 'addStateLocation_error' || stateQueueDataSnapshot.val()._state === 'addStateLocation_error') {
                                                                                CoreService.toastError(gettextCatalog.getString('Error!'), gettextCatalog.getString('Try again!'));
                                                                                blockUI.stop();
                                                                            }

                                                                            if(stateQueueDataSnapshot.val()._state === 'addState_finished'){
                                                                                blockUI.stop();
                                                                                stateAdded = true;
                                                                                stateQueueData.off();
                                                                                stateQueueData.ref().remove(function (error) {
                                                                                    if(error){
                                                                                    } else {
                                                                                        queueCityData.off();
                                                                                        queueCityData.ref().remove(function (error) {
                                                                                            if(error){
                                                                                            }
                                                                                            else{
                                                                                                addedLocations++;
                                                                                                console.log(addedLocations);
                                                                                                CoreService.toastSuccess(gettextCatalog.getString('State Saved'),gettextCatalog.getString(''));
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                });
                                                                            }
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        } else {
                                                            blockUI.stop();
                                                        }
                                                    });
                                                }

                                                if(!country && !state){
                                                    blockUI.stop();
                                                }
                                            }
                                        })
                                    })
                                }
                            });
                        } else {
                            blockUI.stop();
                        }
                    });
                    $scope.locations.splice($scope.locations.indexOf(city), 1);
                }
            } else {
                blockUI.stop();
                if (typeof city === 'undefined'){
                    CoreService.toastError(gettextCatalog.getString('Select a city!'), gettextCatalog.getString('Please select a city before continuing!'));
                }
            }
        };

        $scope.saveLivedHereFor = function (years,locationId) {
            if(locationId){
                Profile.updateLocalCityYears(locationId,authFB.uid,years).$save().then(function(ref){
                    ref.set(years);
                    CoreService.toastSuccess(gettextCatalog.getString('Number of years saved'),gettextCatalog.getString(''));
                })
            } else {
                CoreService.toastError(gettextCatalog.getString('Number of years missing!'), gettextCatalog.getString('Please select number of years before continuing!'));
            }
        };

        $scope.saveRelationship = function (relationship,locationId) {
            if(locationId){
                Profile.updateLocalCityRelationship(locationId,authFB.uid,relationship).$save().then(function(ref){
                    ref.set(relationship);
                    CoreService.toastSuccess(gettextCatalog.getString('Relationship Saved'),gettextCatalog.getString(''));
                })
            } else {
                CoreService.toastError(gettextCatalog.getString('Relationship to a city missing!'), gettextCatalog.getString('Please select relationship to a city before continuing!'));
            }
        };

        $scope.removeLocation = function (location,index) {
            blockUI.start('Removing ...');
            if($scope.locations.indexOf(location) == -1){
                blockUI.stop();
                return;
            }
            if(!location.$id){
                $scope.locations.splice(index,1);
                blockUI.stop();
                return
            }
            Profile.getLocation(location.$id,authFB.uid).$loaded().then(function (data) {
                Profile.userLocationCountry(authFB.uid,location.$id).once('value', function (snapshot) {
                    if(snapshot.val() !== null){
                        Profile.userLocationState(authFB.uid,location.$id).once('value', function (snapshot) {
                            if(snapshot.val() !== null){
                                var removeCountryObject = {};
                                var removeCCountry = false;

                                if(data.country !== null && data.country !== undefined && data.country !== ''){
                                    removeCCountry = true;
                                    removeCountryObject.countryPlaceId = data.country;
                                }

                                removeCountryObject.locationType = data.locationType;
                                removeCountryObject.localId = authFB.uid;
                                removeCountryObject.removeCCountry = removeCCountry;
                                removeCountryObject._state = "removeCountryLocation_start";

                                Profile.removeExistingUserCountry(removeCountryObject).then(function (queueRemoveCountryData) {
                                    queueRemoveCountryData.on('value', function (queueRemoveCountryDataSnap) {
                                        if(queueRemoveCountryDataSnap.val()._state === 'removeCountryLocation_error'){
                                            blockUI.stop();
                                        }
                                        if(queueRemoveCountryDataSnap.val()._state === 'removeCountryLocation_finished'){
                                            var removeStateObject = {};
                                            var removeSState = false;
                                            var removeSCountry = false;

                                            if(data.state !== null && data.state !== undefined && data.state !== ''){
                                                removeSState = true;
                                                removeStateObject.statePlaceId = data.state;
                                            }

                                            if(data.country !== null && data.country !== undefined && data.country !== ''){
                                                removeSCountry = true;
                                                removeStateObject.countryPlaceId = data.country;
                                            }

                                            removeStateObject.localId = authFB.uid;
                                            removeStateObject._state = "removeStateLocation_start";
                                            removeStateObject.removeSState = removeSState;

                                            Profile.removeExistingUserState(removeStateObject).then(function (queueRemoveStateData) {
                                                queueRemoveStateData.on('value', function (queueRemoveStateDataSnap) {
                                                    if(queueRemoveStateDataSnap.val()._state === 'removeStateLocation_error'){
                                                        blockUI.stop();
                                                    }
                                                    if(queueRemoveStateDataSnap.val()._state === 'removeStateLocation_finished'){
                                                        var removeCityObject = {};
                                                        //removeCityObject.statePlaceId = data.state;
                                                        //removeCityObject.countryPlaceId = data.country;
                                                        removeCityObject.localId = authFB.uid;
                                                        removeCityObject.cityPlaceId = data.$id;
                                                        removeCityObject._state = "removeCityLocation_start";
                                                        Profile.removeExistingUserLocation(removeCityObject).then(function (queueRemoveCityData) {
                                                            queueRemoveCityData.on('value', function (queueRemoveCityDataSnap) {
                                                                if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_error'){
                                                                    blockUI.stop();
                                                                }
                                                                if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_finished'){
                                                                    blockUI.stop();
                                                                    queueRemoveCityData.off();
                                                                    queueRemoveCityData.ref().remove(function (error) {
                                                                        if(error){

                                                                        } else {
                                                                            queueRemoveStateData.off();
                                                                            queueRemoveStateData.ref().remove(function (error) {
                                                                                queueRemoveCountryData.off();
                                                                                queueRemoveCountryData.ref().remove(function (error) {
                                                                                    if(error){

                                                                                    } else {
                                                                                        addedLocations--;
                                                                                        console.log(addedLocations);
                                                                                        CoreService.toastSuccess(gettextCatalog.getString('Location Deleted'),gettextCatalog.getString(''));
                                                                                    }
                                                                                })
                                                                            })
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                        })

                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            }  else {
                                var removeCountryObject = {};
                                var removeCCountry = false;

                                if(data.country !== null && data.country !== undefined && data.country !== ''){
                                    removeCCountry = true;
                                    removeCountryObject.countryPlaceId = data.country;
                                }

                                removeCountryObject.locationType = data.locationType;
                                removeCountryObject.localId = authFB.uid;
                                removeCountryObject.removeCCountry = removeCCountry;
                                removeCountryObject._state = "removeCountryLocation_start";

                                Profile.removeExistingUserCountry(removeCountryObject).then(function (queueRemoveCountryData) {
                                    queueRemoveCountryData.on('value', function (queueRemoveCountryDataSnap) {
                                        if(queueRemoveCountryDataSnap.val()._state === 'removeCountryLocation_error'){
                                            blockUI.stop();
                                        }
                                        if(queueRemoveCountryDataSnap.val()._state === 'removeCountryLocation_finished'){
                                            var removeCityObject = {};
                                            //removeCityObject.countryPlaceId = data.country;
                                            removeCityObject.localId = authFB.uid;
                                            removeCityObject.cityPlaceId = data.$id;
                                            removeCityObject._state = "removeCityLocation_start";

                                            Profile.removeExistingUserLocation(removeCityObject).then(function (queueRemoveCityData) {
                                                queueRemoveCityData.on('value', function (queueRemoveCityDataSnap) {
                                                    if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_error'){
                                                        blockUI.stop();
                                                    }
                                                    if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_finished'){
                                                        blockUI.stop();
                                                        queueRemoveCityData.off();
                                                        queueRemoveCityData.ref().remove(function (error) {
                                                            if(error){

                                                            } else {
                                                                queueRemoveCountryData.off();
                                                                queueRemoveCountryData.ref().remove(function (error) {
                                                                    if(error){

                                                                    } else {
                                                                        addedLocations--;
                                                                        console.log(addedLocations);
                                                                        CoreService.toastSuccess(gettextCatalog.getString('Location Deleted'),gettextCatalog.getString(''));
                                                                    }
                                                                })
                                                            }
                                                        });
                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            }
                        });
                    }  else {
                        Profile.userLocationState(authFB.uid,location.$id).once('value', function (snapshot) {
                            if(snapshot.val() !== null){
                                var removeStateObject = {};
                                var removeSState = false;
                                var removeSCountry = false;

                                if(data.state !== null && data.state !== undefined && data.state !== ''){
                                    removeSState = true;
                                    removeStateObject.statePlaceId = data.state;
                                }

                                if(data.country !== null && data.country !== undefined && data.country !== ''){
                                    removeSCountry = true;
                                    removeStateObject.countryPlaceId = data.country;
                                }

                                removeStateObject.localId = authFB.uid;
                                removeStateObject._state = "removeStateLocation_start";
                                removeStateObject.removeSState = removeSState;

                                Profile.removeExistingUserState(removeStateObject).then(function (queueRemoveStateData) {
                                    queueRemoveStateData.on('value', function (queueRemoveStateDataSnap) {
                                        if(queueRemoveStateDataSnap.val()._state === 'removeStateLocation_error'){
                                            blockUI.stop();
                                        }
                                        if(queueRemoveStateDataSnap.val()._state === 'removeStateLocation_finished'){
                                            var removeCityObject = {};
                                            //removeCityObject.statePlaceId = data.state;
                                            removeCityObject.localId = authFB.uid;
                                            removeCityObject.cityPlaceId = data.$id;
                                            removeCityObject._state = "removeCityLocation_start";

                                            Profile.removeExistingUserLocation(removeCityObject).then(function (queueRemoveCityData) {

                                                queueRemoveCityData.on('value', function (queueRemoveCityDataSnap) {
                                                    if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_error'){
                                                        blockUI.stop();
                                                    }
                                                    if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_finished'){
                                                        blockUI.stop();
                                                        queueRemoveCityData.off();
                                                        queueRemoveCityData.ref().remove(function (error) {
                                                            if(error){

                                                            } else {
                                                                queueRemoveStateData.off();
                                                                queueRemoveStateData.ref().remove(function (error) {
                                                                    if(error){

                                                                    }
                                                                    addedLocations--;
                                                                    console.log(addedLocations);
                                                                    CoreService.toastSuccess(gettextCatalog.getString('Location Deleted'),gettextCatalog.getString(''));
                                                                })
                                                            }
                                                        });
                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            }  else {
                                var removeCityObject = {};
                                //removeCityObject.statePlaceId = data.state;
                                removeCityObject.localId = authFB.uid;
                                removeCityObject.cityPlaceId = data.$id;
                                removeCityObject._state = "removeCityLocation_start";

                                Profile.removeExistingUserLocation(removeCityObject).then(function (queueRemoveCityData) {
                                    queueRemoveCityData.on('value', function (queueRemoveCityDataSnap) {
                                        if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_error'){
                                            blockUI.stop();
                                        }
                                        if(queueRemoveCityDataSnap.val()._state === 'removeCityLocation_finished'){
                                            blockUI.stop();
                                            queueRemoveCityData.off();
                                            queueRemoveCityData.ref().remove(function (error) {
                                                if(error){

                                                } else {
                                                    addedLocations--;
                                                    console.log(addedLocations);
                                                    CoreService.toastSuccess(gettextCatalog.getString('Location Deleted'),gettextCatalog.getString(''));
                                                }
                                            });
                                        }
                                    })
                                })
                            }
                        });
                    }
                });
            }).catch(function () {

            })
        };

        $scope.addAnotherCity = function(){
            if(addedLocations >= 3 ){
                console.log(addedLocations);
                CoreService.toastError(gettextCatalog.getString('Only 3 locations allowed'),gettextCatalog.getString('You are only allowed three locations to your profile!'))
            } else {
                $scope.locations.push({});
            }

        };

        Profile.localLocations(authFB.uid).on('value', function (snapshot) {
            if(snapshot.numChildren() < 1){
                $scope.locations.push({});
            }
        });

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.aboutSave = function(){
            if($scope.uploadedImages.length >= 1 || $scope.coverPhotos.length >=1){
                if($scope.profile.tAndC){
                    if($scope.selectedLanguages.length >= 1){
                        if($scope.selectedInterests.length >= 3){
                            if($scope.selectedAdvise.length >= 3){
                                Profile.localLocations(authFB.uid).once('value', function (snapshot) {
                                    if(snapshot.numChildren() >= 1){
                                        profile.$save().then(function(data){
                                            User(authFB.uid).localProfileAboutComplete(authFB.uid).set(true);
                                            User(authFB.uid).localProfileAboutCompleteDate(authFB.uid).set(Firebase.ServerValue.TIMESTAMP);
                                            CoreService.toastSuccess(gettextCatalog.getString('Profile Data Saved'),gettextCatalog.getString('Your Profile is safe with us!'));
                                            $state.go('create.services');
                                        },function(error){
                                            CoreService.toastError(gettextCatalog.getString('Profile Data Not Saved'),gettextCatalog.getString('Your Profile is not saved please try again!' + error))
                                        });
                                    } else {
                                        CoreService.toastError(gettextCatalog.getString('Enter and Save City'),gettextCatalog.getString('Please enter and save one city before continuing!'))
                                    }
                                });
                            } else {
                                CoreService.toastError(gettextCatalog.getString('Add 3 advise'),gettextCatalog.getString('Please add 3 advise to your profile!'))
                            }
                        } else {
                            CoreService.toastError(gettextCatalog.getString('Add 3 interests'),gettextCatalog.getString('Please add 3 interests to your profile!'))
                        }
                    } else {
                        CoreService.toastError(gettextCatalog.getString('Add Language'),gettextCatalog.getString('Please add language to your profile!'))
                    }
                } else {
                    CoreService.toastError(gettextCatalog.getString('Agree to Terms of Services'),gettextCatalog.getString('Please agree to Terms of Services before proceeding!'))
                }
            } else {
                CoreService.toastError(gettextCatalog.getString('Select a photo'),gettextCatalog.getString('Please select one photo before continuing!'))
            }
        };

        profile.$bindTo($scope,"profile").then(function(){

        },function(error){

        });
                }
            });
        });
    });



});
