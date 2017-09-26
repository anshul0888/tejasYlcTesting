/**
 * Created by TJ on 7/2/15.
 */

var flipperAnimationInterval, bannerAnimationInterval, scrollEventAttached = false;
angular.module('com.ylc.core').controller('HomeCtrl', ['Auth', '$scope', '$timeout', '$interval', '$state', 'SaveSearch', 'CoreService', 'gettextCatalog', 'Profile', 'User',
    'Navigation', 'State', 'Cart', 'UserData', 'userData', 'notify', 'Register', 'blockUI', '$cookieStore', 'ExperienceListing','$rootScope','hotelDetails',
    function (Auth, $scope, $timeout, $interval, $state, SaveSearch, CoreService, gettextCatalog, Profile, User, Navigation, State, Cart, UserData, userData,
        notify, Register, blockUI, $cookieStore, ExperienceListing,$rootScope,hotelDetails) {
        $scope.home = true;


        //ANSHULS CODE STARTS

        console.log(hotelDetails);
        $scope.experienceCardData = hotelDetails.data;
        // Card click
        $scope.cardClick = function (data) {
            console.log("Data "+data);
            $state.go('experiences.detail',{experienceId : data})
        };

        //ANSHULS CODE ENDS
        SaveSearch.setUserSearch(null);

        var BANNER_FADE_DELAY = 1000;

        var bannerWords = [
            'family travel',
            'money-saving tips',
            'wine tasting',
            'guided tours',
            'nightlife',
            'solo travel',
            'hotels',
            'transportation',
            'college life',
            'museums',
            'relocation tips',
            'shopping',
            'kids activities',
            'travel hacks',
            'restaurants'
        ];
        $scope.$on('$viewContentLoaded', function () {
            var wordCount = 0;

            function changeBannerText() {
                var word = bannerWords[wordCount];
                $('#bannerChangingtext').addClass('fade-out');
                $timeout(function () {
                    $('#bannerChangingtext').text(word);
                    $('#bannerChangingtext').removeClass('fade-out');
                }, 500);
                wordCount = wordCount >= bannerWords.length - 1 ? 0 : wordCount + 1;
            }

            $interval.cancel(bannerAnimationInterval);
            bannerAnimationInterval = $interval(changeBannerText, 1000 + BANNER_FADE_DELAY);
        });

        $scope.changeShowMe = function (showMe) {
            $rootScope.showme = showMe;
        }


        $scope.backgroundColors = [
            '#5f24b8',
            '#f5529f',
            '#60dfc5',
            '#7f5da8',
            '#5195ee',
            '#ff992c'
        ];
        var colorIndex = 0;
        $scope.locals = [{
                name: 'Amanda',
                city: 'Paris',
                title: 'Pastry hunter & Museum Expert',
                profileLink: 'https://www.yourlocalcousin.com/#/search/4de253b1-777f-4079-b7b7-710ab6778e6d',
                profilePicture: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:295,fit:crop,align:faces/https://cdn.filepicker.io/api/file/20Ak5uAoQ7y6CGQJf3jo?cache=true',
                backgroundImage: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:640,fit:crop,align:faces/https://cdn.filepicker.io/api/file/GE9dPFeQVyDjnZt2wphA?cache=true'
            },
            {
                name: 'Duysal',
                city: 'Istanbul',
                title: 'Queen of Turkish Bazaars',
                profileLink: 'https://www.yourlocalcousin.com/#/search/4ad0019e-bb5c-4860-b2ae-6615d1c68380',
                profilePicture: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:295,fit:crop,align:faces/https://cdn.filepicker.io/api/file/8gRCJvrRNKkiNAXIaFAS?cache=true',
                backgroundImage: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:640,fit:crop,align:faces/https://cdn.filepicker.io/api/file/Zq6Z6DIdRLKzZWGM4ufA?cache=true'
            },
            {
                name: 'MJ',
                city: 'Tokyo',
                title: 'Private Jet Cabin Crew',
                profileLink: 'https://www.yourlocalcousin.com/search/8fafb72d-bae4-4626-92d3-d51da84d896b',
                profilePicture: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:295,fit:crop,align:faces/https://cdn.filepicker.io/api/file/rwGcXPjvRIaMYmk9rOj9?cache=true',
                backgroundImage: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:640,fit:crop,align:faces/https://cdn.filepicker.io/api/file/CgCD0ddwTBG6LeVKtBcq?cache=true'
            }, {
                name: 'Alberta',
                city: 'Naples',
                title: 'Italian Cheese Farmer',
                profileLink: 'https://www.yourlocalcousin.com/search/facebook:10156435025720010',
                profilePicture: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:295,fit:crop,align:faces/https://cdn.filepicker.io/api/file/aTgJwaiTVyEfuDcIY96A?cache=true',
                backgroundImage: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:640,fit:crop,align:faces/https://cdn.filepicker.io/api/file/FtbU9zp8Sw2bI8PRAryE?cache=true'
            }, {
                name: 'Lynton',
                city: 'Cape Town',
                title: 'Footie fan & Tax man',
                profileLink: 'https://www.yourlocalcousin.com/search/facebook:10208002429091673',
                profilePicture: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:295,fit:crop,align:faces/https://cdn.filepicker.io/api/file/KLwjzj5LTg6BXuFwqluG?cache=true',
                backgroundImage: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:640,fit:crop,align:faces/https://cdn.filepicker.io/api/file/H0T2nJ72Rda0iI4XNbxN?cache=true'
            }, {
                name: 'Valerio',
                city: 'Rome',
                title: 'Vegetarian, Wine loving Journalist',
                profileLink: 'https://www.yourlocalcousin.com/search/facebook:10208078270585684',
                profilePicture: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:295,fit:crop,align:faces/https://cdn.filepicker.io/api/file/9SoQQyiUTvCvZyWAn8Ko?cache=true',
                backgroundImage: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:640,fit:crop,align:faces/https://cdn.filepicker.io/api/file/Iy9f8lIaShKcL703m47e?cache=true'
            }, {
                name: 'Christine',
                city: 'New York',
                title: 'Broadway show hacker',
                profileLink: 'https://www.yourlocalcousin.co/search/90bbd423-1d51-497b-b3fe-469c2c5512c3',
                profilePicture: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:295,fit:crop,align:faces/https://cdn.filepicker.io/api/file/wGbi768TQ2K9iGPo8ZyS?cache=true',
                backgroundImage: 'https://process.filestackapi.com/AFB3Ao0kOSgaTM65cLPchz/resize=width:640,fit:crop,align:faces/https://cdn.filepicker.io/api/file/fuoTS08BQumK5gNiO49o?cache=true'
            }
        ];
        $scope.currentLocal = {
            data: $scope.locals[0],
            front: $scope.locals[0],
            index: 0
        };
        $scope.flipBackLocal = null;
        var flipRotation = 0;
        var countTransition = 0; // For auto transitions
        var getNextLocalIndex = function () {
            var index = $scope.currentLocal.index;
            return index >= $scope.locals.length - 1 ? 0 : index + 1;
        };
        var getPrevLocalIndex = function () {
            var index = $scope.currentLocal.index;
            var locals = $scope.locals;
            return index <= 0 ? locals.length - 1 : index - 1;
        };
        var changeBackgroundColor = function () {
            colorIndex = colorIndex >= $scope.backgroundColors.length - 1 ? 0 : colorIndex + 1;
            $('.mob-back').css('background-color', $scope.backgroundColors[colorIndex]);
        };
        var changeImageBehindFlipCoin = function (index) {
            // if the flip is at front change the back and vice-versa
            if (flipRotation % 360 == 0) {
                $scope.flipBackLocal = $scope.locals[index];
            } else {
                $scope.currentLocal.front = $scope.locals[index];
            }
        };
        var flipTheCoin = function (degrees) {
            $('.flipper').css('-webkit-transform', 'rotateY(' + degrees + 'deg)');
            $('.flipper').css('transform', 'rotateY(' + degrees + 'deg)');
        };
        var afterAnimation = function (index) {
            $scope.currentLocal.index = index;
            $scope.currentLocal.data = $scope.locals[index];
        };
        var animateSliderContent = function () {
            $('.slider-content').addClass('fade-out');
            $timeout(function () {
                $('.slider-content').removeClass('fade-out');
            }, 800);
        };
        var animateBackgroundImage = function () {
            $('.locals-banner-image').addClass('fade-out');
            $timeout(function () {
                $('.locals-banner-image').removeClass('fade-out');
            }, 800);
        };
        $scope.nextLocal = function () {
            animateSliderContent();
            animateBackgroundImage();
            changeBackgroundColor();
            var index = getNextLocalIndex();
            changeImageBehindFlipCoin(index);

            flipRotation += 180;
            flipTheCoin(flipRotation);

            // Reseting count
            countTransition = 1;
            $timeout(function () {
                afterAnimation(index);
            }, 800);
        };
        $scope.prevLocal = function () {
            animateSliderContent();
            animateBackgroundImage();
            changeBackgroundColor();
            var index = getPrevLocalIndex();
            changeImageBehindFlipCoin(index);

            flipRotation -= 180;
            flipTheCoin(flipRotation);

            // Reseting count
            countTransition = 1;
            $timeout(function () {
                afterAnimation(index);
            }, 800);
        };
        /**
         * Auto transition
         */
        $interval.cancel(flipperAnimationInterval);
        flipperAnimationInterval = $interval(function () {
            if (countTransition % 5 == 0) {
                $scope.nextLocal();
            } else {
                if (flipRotation % 72000 == 0) {
                    if (countTransition == 2) {
                        $('.flipper').css('-webkit-transition', 'none');
                        $('.flipper').css('transition', 'none');
                    }
                    if (countTransition == 3) {
                        flipRotation = 0;
                        flipTheCoin(flipRotation);
                    }
                    if (countTransition == 4) {
                        $('.flipper').css('-webkit-transition', '2.4s');
                        $('.flipper').css('transition', '2.4s');
                    }
                }
            }
            countTransition++;
        }, 1000); // every 5 Seconds


        var autoScrollHappened = false;
        var END_SCROLL_AT = 715;
        $scope.$on('$viewContentLoaded', function () {

            // Banner bouncing down arrow
            $('#scrollDownArrow').on('click', function (event) {
                $('html').animate({ scrollTop: END_SCROLL_AT }, 2000);
            });

            // $(window).load(function(){
            $('.pdf-preview').stop();
            $('.pdf-preview').scrollTop(0);
            if (!scrollEventAttached) {
                scrollEventAttached = true;
                $(window).scroll(function () {
                    var halfScreenHeight = window.screen.height / 2;
                    var animationStartPoint = '';
                    try {
                        animationStartPoint = $('.bg-third-section').position().top - halfScreenHeight;
                    } catch (e) {

                    }
                    if (!autoScrollHappened && Math.abs($(window).scrollTop() - animationStartPoint) <= 100) {
                        autoScrollHappened = true;
                        var TOTAL_SCROLL_TIME = 40000;
                        var wrapper = $('.pdf-preview'),
                            wrapperHeight = wrapper.height();

                        function getScrollHeight() {
                            var insideElements = wrapper.find('img');
                            var totalHeight = 0;
                            for (var i = 0; i < insideElements.length; i++) {
                                totalHeight += insideElements[i].height;
                            }
                            return totalHeight - wrapperHeight;
                        }

                        var scrollHeight = getScrollHeight();
                        var goingDown = true;

                        function startAutoScroll(scrollAmount, scrollTime) {
                            goingDown = !(scrollAmount === 0);
                            wrapper.animate({
                                scrollTop: scrollAmount
                            }, scrollTime, 'swing', function () {
                                if (goingDown) {
                                    // Go Up
                                    startAutoScroll(0, TOTAL_SCROLL_TIME);
                                } else {
                                    // Go Down
                                    scrollHeight = getScrollHeight();
                                    startAutoScroll(scrollHeight, TOTAL_SCROLL_TIME);
                                }
                            });
                        }
                        startAutoScroll(scrollHeight, TOTAL_SCROLL_TIME);

                        wrapper.on('mouseenter', function () {
                            wrapper.stop();
                        });
                        wrapper.on('mouseleave', function () {
                            var lastScrollTop = wrapper.scrollTop();
                            if (goingDown) {
                                var whatsLeftToScroll = scrollHeight - lastScrollTop;
                                var timeLeft = TOTAL_SCROLL_TIME * (whatsLeftToScroll / scrollHeight);
                                startAutoScroll(scrollHeight, timeLeft);
                            } else {
                                var timeLeft = TOTAL_SCROLL_TIME * (lastScrollTop / scrollHeight);
                                startAutoScroll(0, timeLeft);
                            }
                        });
                    }

                });
            }
        });





        //$scope.video = {
        //    id : 'KPqLbH0pQTE'
        //};

        notify.closeAll();
        $scope.sendVerificationEmail = function () {
            var verificationData = {};
            if (userData) {
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

        if (userData) {
            if (userData.verificationStatus === null || userData.verificationStatus === undefined || userData.verificationStatus === false) {
                var messageTemplate = '<span>Looks like you have not verified your email address, please click on the link to get a verification email. ' +
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

        $scope.searchTopDestination = function (location) {
            blockUI.start('Searching ...');
            if (location === null || location === undefined || location === '') {
                CoreService.toastError(gettextCatalog.getString('Enter Correct Place!'), gettextCatalog.getString('Enter a location select from the drop-down and try again'));
                blockUI.stop();
            } else {
                setTimeout(function () {
                    if (SaveSearch.getUserSearch()) {
                        SaveSearch.setUserSearch(null);
                    }
                    var geocoder = new google.maps.Geocoder();

                    geocoder.geocode({ 'placeId': location }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            // $cookieStore.put('userSearch',results);
                            SaveSearch.setUserSearch(results);
                            var location = results[0].formatted_address;
                            var loc = location.replace(/\s/g, '');
                            loc = loc.split(',').join('-');
                            $state.go('locations.results', { location: loc }, { reload: true });
                        } else {
                            blockUI.stop();
                            CoreService.toastError(gettextCatalog.getString('Error! Incorrect Search!'), gettextCatalog.getString('Try again after correcting place or contact us on info@yourlocalcousin.com!'));
                        }
                    });
                }, 500);
            }
        }

        $scope.logout = function () {
            Auth.$unauth();
            State.setUserCurrentState(null);
            State.setUserNextState(null);
            State.setUserPreviousState(null);
            State.setUserCurrentStateParams(null);
            State.setUserNextStateParams(null);
            State.setUserPreviousStateParams(null);
            Cart.setUserCart(null);
            UserData.setUserData(null);
            $cookieStore.remove('userSearch');
            $cookieStore.remove('userCart');

            Auth.$requireAuth().then(function (auth) {
                $scope.signedIn = true;
                CoreService.toastError(gettextCatalog.getString('Logout failed'), gettextCatalog.getString('Logout failed, Please try again!'));
            }, function (error) {
                $scope.signedIn = false;
                CoreService.toastSuccess(gettextCatalog.getString('Logged out'), gettextCatalog.getString('Logout Successful!'));
            })
        };

        $scope.$on('g-places-autocomplete:select', function (event, param) {
            $scope.place = param;
            $scope.searchLocals();
        });

        $scope.searchLocals = function () {
            blockUI.start('Searching ...');
            if ($scope.place === null || $scope.place === undefined || $scope.place === '') {
                CoreService.toastError(gettextCatalog.getString('Enter Correct Place!'), gettextCatalog.getString('Enter a location select from the drop-down and try again'));
                blockUI.stop();
            } else {
                setTimeout(function () {
                    if (SaveSearch.getUserSearch()) {
                        SaveSearch.setUserSearch(null);
                    }
                    var geocoder = new google.maps.Geocoder();


                    geocoder.geocode({ 'placeId': $scope.place.place_id }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $cookieStore.put('userSearch', results);
                            SaveSearch.setUserSearch(results);
                            var location = results[0].formatted_address;
                            var loc = location.replace(/\s/g, '');
                            loc = loc.split(',').join('-');
                            $state.go('locations.results', { location: loc }, { reload: true });
                        } else {
                            blockUI.stop();
                            CoreService.toastError(gettextCatalog.getString('Error! Incorrect Search!'), gettextCatalog.getString('Try again after correcting place or contact us on info@yourlocalcousin.com!'));
                        }
                    });
                }, 500);
            }
        };

        $scope.autocompleteOptions = {
            types: ['(regions)']
        };

        $scope.$watch('experience_list', function (newValue, oldValue) {
            console.log('-------------------')
            console.log(newValue);
            console.log('-------------------')

        }, true);

        /**
         * Submits the experience listing form and triggers a backend email service
         */
        $scope.submitExperienceListingForm = function () {
            console.log('need to submit the form here');
            ExperienceListing.create($scope.experience_list).then(function (response) {
                console.log(response);
                $scope.experience_list = {};
                CoreService.alertSuccess('Your request has been submitted, we\'ll get back to you shortly.');
            }).catch(function (error) {
                console.log(error);
                CoreService.alertError('Something went wrong, please try again after sometime.');
            });
        }
    }
]).controller("FilterCtrl",function ($scope) {
    $scope.categoryStatus = {
        isopen: false
    };
    //Category Menu
    $scope.categoryMenu = [
        "Walking tour",
        "Cooking",
        "Food",
        "Shopping",
        "Traditional",
        "Anshul",
        "Testing",
        "Category Test",
        "Manhattan"
    ];
    $scope.boroughMenu = [
        "Manhattan",
        "Brooklyn",
        "Bronx",
        "Queens",
        "Borough Test"
    ];

})

    .controller("FilterSearchCtrl",function($scope){
        $scope.categoryItemSelected = function(categoryItems){
            $scope.categoryFilter= categoryItems;
            $scope.categoryFilterDisplay = "Results: ";
            $scope.filterClicked = true;
        };
        $scope.boroughItemSelected = function(boroughItems){
            $scope.boroughFilter= boroughItems;
            $scope.categoryFilterDisplay = "Results: ";
            $scope.boroughFilterDisplay = " ";
            $scope.filterClicked = true;
        };
        $scope.removeFilter=function(){
            $scope.categoryFilter="";
            $scope.categoryFilterDisplay="";
            $scope.boroughFilterDisplay= "";
            $scope.boroughFilter="";
            $scope.filterClicked = false;
        };

    }).controller("HotelDescCtrl", function($scope){
    $scope.hotelDescHeadline = "Book unique tours and activities from NYC Locals";
    $scope.hotelDescData = "The Bernic Hotel offers a number of unique experiences from actual locals through our partner, Your Local Cousin. Don't just walk through Times Square, take a tour with a Broadway actor and get a behind the scenes look at the costume closet of the Lion King. Celebrating a special occasion? Take a dessert tour of the West Village and get your sugar fix! You can even take a street art tour of Williamsburg or explore DUMBO with some of the best views of the city. If you don't see an experience you want, just ask! We can also make recommendations.";
}) .controller("NavBarCtrl",function($scope){
    $scope.isNavCollapsed = true;
    $scope.ylcLogo = 'https://www.filepicker.io/api/file/OGBrveXRSICsd7tOPLMX';

    //Logo Variable
    $scope.logo = "https://www.filepicker.io/api/file/Hw9bQE9zTjmIrPVSMGJB";
    // Page Title Variable
    // $rootScope.title = "Your Local Cousin";
});
