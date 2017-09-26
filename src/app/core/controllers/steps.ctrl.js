
angular.module('com.ylc.core')
    .controller('CreateStepsCtrl', function(CoreService,$state,$scope,gettextCatalog,Search) {
        $scope.uploadedImage = null;

        $scope.submitSearchPhotos = function () {
            var data = {};
            data.cityGeoId = btoa($scope.uploadedImage) + '_oO_DUDEDUDE_Oo_' + $scope.location.place_id;
            data.lattitude = $scope.location.geometry.location.lat();
            data.longitude = $scope.location.geometry.location.lng();
            data.photoURL = $scope.uploadedImage;
            data.place_id = $scope.location.place_id;
            console.log(data);
            Search.addLocationPhoto(data);
        };

        $scope.uploadFile = function () {
            filepicker.setKey("AFB3Ao0kOSgaTM65cLPchz");
            filepicker.pickAndStore({

            },{
                    path : "/cityPhotos/"
                },
                function(Blob){
                    console.log(Blob);
                    $scope.uploadedImage = Blob[0].url;
                }, function (error) {
                    console.log(error);
                }
            );
        }

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
    });
