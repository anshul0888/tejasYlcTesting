/**
 * Created by TJ on 8/29/15.
 */

angular.module('com.ylc.profile.view')
    .controller('ViewCtrl', function(CoreService,$state,auth,profile,$scope,gettextCatalog,Profile,Gigs,$sce,videos,$timeout,selectedDates) {
        $scope.videoPresent = false;
        Profile.isALocal(auth.uid).$loaded().then(function (local) {
            if(local.$value === null || local.$value === false){
                CoreService.confirm(
                    gettextCatalog.getString('Signup to be a Local Cousin?'),
                    gettextCatalog.getString('This section is only for Local Cousins, Do you want to proceed to Signup as a Local Cousin? Click Ok else Cancel'),
                    function () {
                        $state.go('create.steps');
                    }, function () {
                        CoreService.toastInfo(gettextCatalog.getString('Section only for Local Cousins!'), gettextCatalog.getString('This section is only for Local Cousins, please signup as a Local cousin to access the section'));
                        $state.go('dashboard');
                    });
            } else {
                //Check if still a Noob
                Profile.localIsANoob(auth.uid).$loaded().then(function(data){
                    if(data.$value || data.$value === null){
                        //Implement logic to direct to the part where they left off rather than just one single part
                        CoreService.toastInfo(gettextCatalog.getString('Not completed Local Cousin profile!'), gettextCatalog.getString('You have not completed all the steps to be a Local Cousin we will guide you, please complete your profile'));
                        $state.go('create.about');
                    } else {

                    }
                });
            }
        });


        $scope.userShareUrl = "https://www.yourlocalcousin.com/#/search/" + auth.uid;

        $scope.selectedDates = selectedDates;

        $scope.profile = profile;

        $scope.userGigs = Gigs.getUserGigs(auth.uid);

        $scope.coverPhotos = Profile.getCoverPhotos(auth.uid);

        $scope.profilePhotos = Profile.getProfilePhotos(auth.uid);

        $scope.userLanguages = Profile.getUserLanguages(auth.uid);

        $scope.userAdvises = Profile.getUserAdvises(auth.uid);

        $scope.userInterests = Profile.getUserInterests(auth.uid);

        $scope.userCities = Profile.getUserLocations(auth.uid);
        //$scope.userCities = [];
        //Profile.getUserLocations(auth.uid).$loaded(function (snap) {
        //    angular.forEach(snap, function (val, key) {
        //        var type = val.types[0];
        //        angular.forEach(val.address_components, function (valAC, keyAC) {
        //            if(valAC.types[0] === type){
        //                $scope.userCities.push({location : valAC.long_name,livedHereFor : val.livedHereFor,relationshipToCity : val.relationshipToCity});
        //            }
        //        })
        //    })
        //});
        //***********************VIDEO******************************//
        if(videos[0]){
            $scope.state = null;
            $scope.API = null;
            $scope.currentVideo = 0;

            $scope.onPlayerReady = function(API) {
                $scope.API = API;
            };

            $scope.onCompleteVideo = function() {
                //$scope.isCompleted = true;
                //
                //$scope.currentVideo++;
                //
                //if ($scope.currentVideo >= $scope.videos.length) $scope.currentVideo = 0;
                //
                //$scope.setVideo($scope.currentVideo);
            };

            $scope.setVideo = function(index) {
                $scope.API.stop();
                $scope.currentVideo = index;
                $scope.config.sources = $scope.videos[index].sources;
                $timeout($scope.API.play.bind($scope.API), 100);
            };

            $scope.videos = [];
            angular.forEach(videos, function (value, key) {
                $scope.videos.push({
                    sources : [
                        {
                            src : $sce.trustAsResourceUrl(value.url), type: "video/mp4"
                        }
                    ]
                });
            });

            $scope.videoPresent = true;
            $scope.config = {
                preload: "none",
                sources: $scope.videos[0].sources,
                tracks : [{}],
                theme: {

                }
            };
        } else {
            $scope.videoPresent = false;
        }

        //************************** VIDEO ************************************//


        profile.$bindTo($scope,"profile").then(function(){
        },function(error){
        });

        $scope.totalValue = 0;

        $scope.processOrder = function () {
            if($scope.totalValue > 0){
                CoreService.alertSuccess(gettextCatalog.getString('Sweet!'),gettextCatalog.getString('As much as we would love to process your order of $' + $scope.totalValue + ' right away, We wouldn\'t want you to hire yourself, search and pick another local!'));
            } else {
                CoreService.toastError(gettextCatalog.getString('Select a service'),gettextCatalog.getString('Please select a service before continuing!'));
            }
        };

        $scope.getVerification = function(num) {
            return new Array(num);
        };

        $scope.addToCart = function(gigId,set){
            if(set){
                Gigs.getGigAmount(gigId).$loaded().then(function(snapshot){
                    $scope.totalValue += snapshot.charges;
                });
            } else {
                Gigs.getGigAmount(gigId).$loaded().then(function(snapshot){
                    $scope.totalValue -= snapshot.charges;
                });
            }
        };
    });
