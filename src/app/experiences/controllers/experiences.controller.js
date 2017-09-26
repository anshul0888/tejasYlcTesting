'use strict';
angular.module('com.ylc.experiences')

.directive('showMore', [function() {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            text: '=',
            limit:'='
        },

        template: '<div>\
                        <p style="font-size: 15px;" ng-show="largeText"> <span ng-bind-html="filteredText"></span>\
                            <span ng-if="isShowMore">....</span>\
                            <a href="javascript:;" ng-click="showMore()" ng-show="isShowMore" style=" transition: initial">\
                                <div ng-if="largeText"  style="text-align: right; font-size: 20px; margin-top: -30px;">+</div>\
                            </a>\
                            <a href="javascript:;" ng-click="showLess()" ng-hide="isShowMore" style=" transition: initial">\
                                <div ng-if="largeText"  style="text-align: right; font-size: 20px; margin-top: -30px;">-</div>\
                            </a>\
                        </p>\
                        <p style="font-size: 15px;" ng-hide="largeText"><span ng-bind-html="filteredText"></span></p>\
                    </div> ',

        link: function(scope, iElement, iAttrs) {

            
            scope.end = scope.limit;
            scope.filteredText = scope.text.substring(0, scope.limit);
            scope.isShowMore = true;
            scope.largeText = true;

            if (scope.text.length <= scope.limit) {
                scope.largeText = false;
            };

            scope.showMore = function() {

                scope.end = scope.text.length;
                scope.filteredText = scope.text;
                scope.isShowMore = false;
            };

            scope.showLess = function() {
                scope.filteredText = scope.text.substring(0, scope.limit);
                scope.end = scope.limit;
                scope.isShowMore = true;
            };
        }
    };
}])

.filter('subString', function() {
    return function(str, start, end) {
        if (str != undefined) {
            return str.substr(start, end);
        }
    }
})

.controller('ExperiencesCtrl',

    function (
        $scope,
        CoreService,
        gettextCatalog,
        $state,
        ContactUsRef,
        EmailContactQueueRef,
        $firebaseArray,
        experienceDetails,
        $uibModal,
        $stateParams,
        ngMeta
    ) {
        $scope.contactUs = function () {
            if ($scope.email !== null && $scope.email !== undefined && $scope.email !== '' && $scope.name !== null && $scope.name !== undefined && $scope.name !== '' && $scope.subject !== null && $scope.subject !== undefined && $scope.subject !== '' && $scope.message !== null && $scope.message !== undefined && $scope.message !== '') {
                ContactUsRef.push({
                    name: $scope.name,
                    email: $scope.email,
                    subject: $scope.subject,
                    message: $scope.message,
                    website: $scope.website ? $scope.website : '',
                    resolved: false,
                    contacted: false
                }, function (error) {
                    if (error) {
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

        // experienceDetails.$loaded().then(function(loadedExperience) {

        // });

        $scope.experienceId = $stateParams.experienceId;
        $scope.experience = experienceDetails;

        console.log($scope.experience)

        var photoCollection = $scope.experience.experience_photos;
        $scope.firstPhoto = photoCollection.splice(0, 1);
        $scope.photos = photoCollection;

        var splittedLocation = $scope.experience.experience_location.split(/,(.+)/);
        $scope.place = splittedLocation[0];
        $scope.country = splittedLocation[1];
        $scope.selectedPerson = 1;
        $scope.selectedPersonPrice = $scope.experience.experience_pricing['price_1_person'];

        $scope.$watch('selectedPerson', function (newValue) {
            console.log(newValue)
            console.log($scope.selectedPerson)
            if (newValue == 1) {
                $scope.selectedPersonPrice = $scope.experience.experience_pricing['price_1_person'];
            } else if (newValue == 2) {
                $scope.selectedPersonPrice = $scope.experience.experience_pricing['price_2_people'];
            } else {
                $scope.selectedPersonPrice = 'Invalid Selection';
            }
        })


        $scope.checkAvailability = function () {
            var $uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'experiences/views/checkAvailability.tpl.html',
                controller: 'ExperiencesAvailabilityCtrl',
                size: 'lg',
                resolve: {experience_data : function () {
                    return $scope.experience;
                }}
            });
        }


        // function setMetaTags(title, description,photoUrl,experienceId) {
        //     ngMeta.setTitle($scope.experience.experience_title);
        //     ngMeta.setTag('description', $scope.experience.experience_short_description);
        //     ngMeta.setTag('image',$scope.photos[0]);
        //     ngMeta.setTag('url','https://www.yourlocalcousin.com/experiences/' + $stateParams.experienceId);
        // }

        function setMetaTags(title, description,photoUrl,experienceId) {
            ngMeta.setTitle(title);
            ngMeta.setTag('description', description);
            ngMeta.setTag('image',photoUrl);
            ngMeta.setTag('url','https://www.yourlocalcousin.com/experiences/' + experienceId);
        }

        function experienceMeta() {
            switch ($stateParams.experienceId) {
                case 'ancient-vietnamese-knife-making-workshop' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/DIEvLhHDTZ2MzjTuE4DY','ancient-vietnamese-knife-making-workshop')
                    break;
                case 'cape-town-on-a-tri-motorcycle' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/ysThmYdWReKhXtQmTV8O','cape-town-on-a-tri-motorcycle')
                    break;
                case 'contemporary-art-tours-of-barcelona' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/Xp31GveHT0a98PdfdtRz','contemporary-art-tours-of-barcelona')
                    break;
                case 'georgian-culture-and-wine' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/2wUcit5ORdGVz6tBMJtR','georgian-culture-and-wine')
                    break;
                case 'custom-segway-tours-around-oakland-and-san-francisco' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/NuvlHqgsQmCRme5OzUb2','custom-segway-tours-around-oakland-and-san-francisco')
                    break;
                case 'custom-street-food-tours-lucha-libre-wrestling' :
                    setMetaTags('Sample Mexico City Street Food and Lucha Libre',$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/UdCCVlrQ7mS2RttFoOhS','custom-street-food-tours-lucha-libre-wrestling')
                    break;
                case 'explore-dumbo-brooklyn-with-nancy' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/VuLDvnHpTEGojVCRiZv1','explore-dumbo-brooklyn-with-nancy')
                    break;
                case 'explore-jewish-heritage-in-marrakech' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/GN0i5bmVS06gbP96SDsw','explore-jewish-heritage-in-marrakech')
                    break;
                case 'explore-paris-and-sample-sweet-treats' :
                    setMetaTags($scope.experience.experience_title,'Get a custom tour from Amanda on Paris\'s best kept secrets for French sweets and pastries','https://www.filepicker.io/api/file/hncUsThITzlni7aXF844','explore-paris-and-sample-sweet-treats')
                    break;
                case 'haggis-six-ways-with-whiskey' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/NM5vlJ6MSJqAEp76k3Fi','haggis-six-ways-with-whiskey')
                    break;
                case 'iceland-tour-and-whale-watching' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/0ZnlCq7Q5Oqdjif7xRBa','iceland-tour-and-whale-watching')
                    break;
                case 'italian-cooking-classes-from-a-certified-personal-chef' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/g2MMJe8LSEqUGjOwsLPj','italian-cooking-classes-from-a-certified-personal-chef')
                    break;
                case 'jaipur-heritage-walk-and-street-food-tour' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/9IWx2O0JSNinh3VfWub3','jaipur-heritage-walk-and-street-food-tour')
                    break;
                case 'lemon-tour-and-cooking-classes' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/dvPpHYNQ3WROysyQ5SXv','lemon-tour-and-cooking-classes')
                    break;
                case 'madrid-farm-fresh-tour' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/E8B5SzBIRXyoSDNXl3gB','madrid-farm-fresh-tour')
                    break;
                case 'market-tour-and-cooking-class-in-jaipur' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/TLnXJhMUScCIA9UmsUx3','market-tour-and-cooking-class-in-jaipur')
                    break;
                case 'private-photo-tours-around-new-york-city' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/TF5bTgNRnyQg2CIudL4C','private-photo-tours-around-new-york-city')
                    break;
                case 'street-foods-of-palermo' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/uzSDIQeQOWoSdLMWgsW6','street-foods-of-palermo')
                    break;
                case 'vegetarian-and-vegan-delicacies-with-an-impassioned-local-foodie' :
                    setMetaTags($scope.experience.experience_title,'Get a custom tour from Amanda on Paris\'s hard to locate and best vegan and vegetarian food','https://www.filepicker.io/api/file/8824Xy8pSiiPWMvKwb3N','vegetarian-and-vegan-delicacies-with-an-impassioned-local-foodie')
                    break;
                case 'vietnamese-local-market-shopping-and-cooking-classes' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/PlVFqp3SHa5OAwOwQQl5','vietnamese-local-market-shopping-and-cooking-classes')
                    break;
                case 'yogyakarta-temples-and-traditions' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/hGniZEALSPqvxaKycjAO','yogyakarta-temples-and-traditions')
                    break;
                case 'truffle-hunting-and-cooking-classes-in-tuscany' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/qx9hfmvOS3C4tuJc5aww','truffle-hunting-and-cooking-classes-in-tuscany')
                    break;
                case 'food-tour-in-rome-medieval-neighborhood' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/wYzYqyukRYClToTXhuOQ','food-tour-in-rome-medieval-neighborhood')
                    break;
                case 'graffiti-and-street-art-walking-tour-in-brooklyn' :
                    setMetaTags($scope.experience.experience_title,$scope.experience.experience_short_description,'https://www.filepicker.io/api/file/ntV3zD0Sb2F1dAExtTWD','graffiti-and-street-art-walking-tour-in-brooklyn')
                    break;

                default:


            }
        }

        experienceMeta()

    });


//
// {
//
//     experience_title : "Explore temples at sunrise",
//
//         experience_location : "Yogyakarta,Indonesia",
//
//     experience_short_description : "Are you curious to see how beautiful the sunrise looks from inside the biggest Buddhist temple in the world and how exotic",
//
//     experience_length : {
//     length_type : "HOURS",
//         length_value : "15"
// },
//
//     experience_pricing : {
//         price_1_person : 167,
//             price_2_people : 244
//     },
//
//     experience_languages : [
//         "English" , "Indonesian"
//     ],
//
//         experience_start_time : "3:30 AM",
//
//     experience_long_description : {
//     description_by_day : {},
//     description_by_hour : "Are you curious to see how beautiful the sunrise looks from the inside of the biggest Buddhist temple in the world and how exotic the sunset looks from the highest Hindu temple in Indonesia? This private tour will show you just that.Your tour will start before the crack of dawn but it will truly be an unforgettable experience. After visiting Borobudur, we will continue our journey to Mendut Temple and Ulensentalu museum (a private museum about the royal family near Merapi mountain). Then we will visit Plaosan Temple (the twin temple which is surrounded by rice fields), Prambanan Temple and finally Sewu Temple until sunset. Prambanan is the most beautiful Hindu temple in South East Asia. If you are lucky, you can see Jatilan dance where the dancers are possessed by the spirits at the Prambanan park."
// },
//
//     experience_included : {
//         "All entrance tickets",
//             "Pick up service from hotel",
//             "Drop off to hotel or airport",
//             "Breakfast",
//             "Breakfast",
//             "Breakfast",
//             "Lunch",
//             "Seasoned local fruits",
//             "1.5 litre mineral water",
//             "Air conditioned car",
//             "Private guide",
//             "Driver",
//             "Souvenir"
//     },
//
//     experience_excluded : {
//         "Personal expenses",
//             "medical insurance"
//     },
//
//     experience_host_information : {
//         about : "My name is Didot, I'm 32 years old. My wife Nurul and I love travelling and it's our pleasure to be your travelling buddy and share unforgettable experience with you. We are fun and open minded couple and we will show you the hidden beauty of Yogyakarta because we are originally from this city. In our packages, we will give you complete Yogyakarta atmosphere, temples, tradition, food, adventure and nature. Furthermore, along the journey we will accompany you, so you can experience the place like locals do, share our stories and tradition with you and in the end put a great cultural footprint in your heart. Both of us are certified local guides and qualified as competence tour guides by Indonesian Professional Certification Authority.",
//             name : "Didot"
//     },
//
//     experience_cancelation_policy : "Your Local Cousin cancellation policy",
//
//         experience_group_size : "Up to 4 people, more than that then please contact us."
//
// },
//
//
// //ENTER BELOW FOR EXPERIENCE - 2
//
