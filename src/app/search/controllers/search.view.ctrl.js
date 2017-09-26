/**
 * Created by TJ on 8/29/15.
 */

angular.module('com.ylc.search')
    .controller('SearchViewCtrl',
        function(CoreService, $state, profile, $scope, $stateParams, gettextCatalog, Search, $uibModal,
            Profile, $sce, videos, Auth, Cart, Orders, State, UserData, SaveSearch, $timeout, selectedDates,$cookieStore
            ,testimonialsCount,ratingsCount,oldTestimonials,ngMeta
        ) {

            var profileId;
            profileId = $stateParams.id;
            $scope.userShareUrl = "https://www.yourlocalcousin.com/search/" + profileId;

            ngMeta.setTitle('Your Local Cousin ' +  profile.firstName);
            ngMeta.setTag('description','Meet our Star local ' + profile.firstName + ', '  +  profile.about.split(/\s+/).slice(0,20).join(" "));
            ngMeta.setTag('image',profile.profilePicture);
            ngMeta.setTag('url',$scope.userShareUrl);

            // $scope.averageRating = profile.ratingAvg;

            // Todo ..
            // check if Local is still available and also if the city is what user has selected from the previous state is looking to find ( bit tough to do )
            // e.g. user has searched mumbai and sees this local and while they come to the profile this local has removed Mumbai so maybe it should not
            // show but i don't think we need this real time functionality right now
            if ($stateParams.id) {
                profileId = $stateParams.id;
            } else {
                $state.go('home');
            }

            if (profileId) {

                $scope.cart = {};
                $scope.cart.gigs = {};
                $scope.cart.total = 0;
                $scope.profile = profile;

                $scope.userGigs = Search.getUserGigs(profileId);

                var specialArray = [];
                $scope.foundPhone = false;
                $scope.foundItinerary = false;

                Search.getUserSpecialGigs(profileId).$loaded(function(snap) {
                    angular.forEach(snap, function (val, key) {
                        if (val.type === 'phone') {
                            specialArray.push(snap);
                        }
                        if(val.type === 'itinerary'){
                            specialArray.push(snap);
                        }
                    });
                    $scope.userSpecialGigs = specialArray;
                });

                $scope.coverPhotos = Search.getCoverPhotos(profileId);

                $scope.profilePhotos = Search.getProfilePhotos(profileId);

                $scope.userLanguages = Profile.getUserLanguages(profileId);

                $scope.userAdvises = Profile.getUserAdvises(profileId);

                $scope.userInterests = Profile.getUserInterests(profileId);

                $scope.userCities = Profile.getUserLocations(profileId);

                $scope.photoCarousel = function () {
                    var $uibModalInstancePhotoCarousel = $uibModal.open({
                        animation: true, // Default
                        templateUrl: 'profile/view/views/photo.carousel.tpl.html',
                        controller: 'PhotoCarouselCtrl',
                        size : 'lg',
                        resolve: {
                            profileId : function () {
                                return profileId;
                            }
                        }
                    });

                    $uibModalInstancePhotoCarousel.result.then(function (status) {
                        if(status === 'successCompleted'){
                            $state.go('messages.conversation',{'orderId' : orderD.orderId});
                        } else {
                            if(status === 'successCanceled'){
                                $state.go('messages.conversation',{'orderId' : orderD.orderId});
                            }
                        }
                    })
                };

                var savedSearchMemory = SaveSearch.getUserSearch();
                var savedSearchCookies = $cookieStore.get('userSearch');
                var savedSearch = savedSearchMemory;


                //if(savedSearchMemory !== null && savedSearchMemory !== undefined
                //    && savedSearchCookies !== null && savedSearchCookies !== undefined){
                //    if(savedSearchMemory[0].place_id === savedSearchCookies[0].place_id){
                //        var savedSearch = savedSearchCookies;
                //    } else {
                //        if(savedSearchMemory === null && savedSearchMemory === undefined){
                //            var savedSearch = savedSearchCookies;
                //        } else {
                //            var savedSearch = savedSearchMemory;
                //        }
                //    }
                //} else{
                //    if(savedSearchCookies !== null && savedSearchCookies !== undefined){
                //        var savedSearch = savedSearchCookies;
                //    }
                //}


                $scope.callPlan = '30 minutes - $15';
                $scope.changeCallPlan = function(plan) {
                    $scope.callPlan = plan;
                };

                $scope.itineraryPlan = '1-3 days - $25';
                $scope.changeItineraryPlan = function(plan) {
                    $scope.itineraryPlan = plan;
                };

                //***********************VIDEO******************************//
                if (videos[0]) {
                    $scope.state = null;
                    $scope.API = null;
                    $scope.currentVideo = 0;

                    $scope.onPlayerReady = function(API) {
                        $scope.API = API;
                    };

                    $scope.onCompleteVideo = function() {
                        $scope.isCompleted = true;

                        $scope.currentVideo++;

                        if ($scope.currentVideo >= $scope.videos.length) $scope.currentVideo = 0;

                        $scope.setVideo($scope.currentVideo);
                    };

                    $scope.setVideo = function(index) {
                        $scope.API.stop();
                        $scope.currentVideo = index;
                        $scope.config.sources = $scope.videos[index].sources;
                        $timeout($scope.API.play.bind($scope.API), 100);
                    };

                    $scope.videos = [];
                    angular.forEach(videos, function(value, key) {
                        $scope.videos.push({
                            sources: [{
                                src: $sce.trustAsResourceUrl(value.url),
                                type: "video/mp4"
                            },
                                {
                                    src: $sce.trustAsResourceUrl(value.url),
                                    type: "video/mov"
                                }]
                        });
                    });
                    $scope.videoPresent = true;
                    $scope.config = {
                        preload: "none",
                        sources: $scope.videos[0].sources,
                        tracks: [{}],
                        theme: {
                            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                        }
                    };
                } else {
                    $scope.videoPresent = false;
                }

                //************************** VIDEO ************************************//

                profile.$bindTo($scope, "profile").then(function() {

                }, function(error) {

                });

                $scope.totalValue = 0;
                $scope.selectedGigs = {};

                $scope.processOrder = function() {
                    var $uibModalInstance;
                    if ($scope.totalValue > 0 && Cart.getUserCart() ) {
                        Auth.$requireAuth().then(function() {

                            var authData = Auth.$getAuth();

                            if (authData.uid === $stateParams.id) {
                                CoreService.toastError(gettextCatalog.getString('Hire Yourself?'),
                                    gettextCatalog.getString('Why would you want to hire yourself ? :) Select another account!'));
                            } else {
                                State.setUserPreviousState($state.current.name);
                                State.setUserPreviousStateParams({
                                    id: $stateParams.id
                                });
                                State.setUserNextState('payment.confirm');
                                State.setUserNextStateParams($scope.cart);
                                Cart.setUserCart($scope.cart);

                                $uibModalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'payments/views/confirm.tpl.html',
                                    controller: 'PaymentConfirmationCtrl',
                                    size : 'lg',
                                    resolve: {
                                        auth: function($state, Auth) {
                                            return Auth.$requireAuth().catch(function() {
                                                $state.go('signin');
                                            });
                                        },
                                        cartData: function($state, Cart, State, CoreService, gettextCatalog) {
                                            if (Cart.getUserCart()) {
                                                return Cart.getUserCart();
                                            } else {
                                                CoreService.toastError(gettextCatalog.getString('You need to select a product before continuing!'),
                                                    gettextCatalog.getString('Please select a product before continuing!'));
                                                $state.go(State.getUserPreviousState(), State.getUserPreviousStateParams());
                                            }
                                        },
                                        userGigs : function () {
                                            return $scope.userGigs;
                                        },
                                        userSavedSearch : function () {
                                            return savedSearch;
                                        },
                                        userLocations : function () {
                                            return  Profile.getUserLocations(profileId)
                                        },
                                        locationUnavailable : function () {
                                            if(savedSearch){
                                                return true
                                            } else {
                                                return false
                                            }

                                        }
                                    }
                                });

                                $uibModalInstance.result.then(function (confirm) {
                                    if(confirm === 'removedAllGigs'){
                                        $state.reload();
                                    }
                                    if(confirm === 'canceled'){
                                        $state.reload();
                                    } else {
                                        if(confirm === 'confirmed'){
                                            var $uibModalInstanceSecond = $uibModal.open({
                                                animation: true, // Default
                                                templateUrl: 'payments/views/process.tpl.html',
                                                controller: 'PaymentProcessingCtrl',
                                                resolve: {
                                                    auth: function($state, Auth) {
                                                        return Auth.$requireAuth().catch(function() {
                                                            $state.go('signin');
                                                        });
                                                    },
                                                    localData: ['User','Auth',function(User, Auth){
                                                        //TODO NO NEED OF REQUIREAUTH HERE
                                                        return Auth.$requireAuth().then(function(auth){
                                                            return User($scope.cart.localId).$loaded();
                                                        }).catch(function () {
                                                            return null;
                                                        });
                                                    }],
                                                    travelerData : ['User','Auth',function(User, Auth){
                                                        //TODO NO NEED OF REQUIREAUTH HERE
                                                        return Auth.$requireAuth().then(function(auth){
                                                            return User(auth.uid).$loaded();
                                                        }).catch(function () {
                                                            return null;
                                                        });
                                                    }]
                                                }
                                            });

                                            $uibModalInstanceSecond.result.then(function (orderD) {
                                                if(orderD.status === 'paymentSuccess'){
                                                    // var $uibModalInstanceSuccessful = $uibModal.open({
                                                    //     animation: true, // Default
                                                    //     templateUrl: 'payments/views/success.tpl.html',
                                                    //     controller: 'PaymentSuccessCtrl',
                                                    //     resolve: {
                                                    //         auth: function($state, Auth) {
                                                    //             return Auth.$requireAuth().catch(function() {
                                                    //             });
                                                    //         }
                                                    //     }
                                                    // });
                                                    // $state.go('payment.success',{'orderId' : orderD.orderId});

                                                    // $uibModalInstanceSuccessful.result.then(function (status) {
                                                    //     if(status === 'successCompleted'){
                                                    //         $state.go('messages.conversation',{'orderId' : orderD.orderId});
                                                    //     } else {
                                                    //         if(status === 'successCanceled'){
                                                    //             $state.go('messages.conversation',{'orderId' : orderD.orderId});
                                                    //         }
                                                    //     }
                                                    // }, function () {
                                                    //     $state.go('messages.conversation',{'orderId' : orderD.orderId});
                                                    // })
                                                    
                                                    
                                                    $state.go('payment.success', {
                                                        orderId: orderD.data.orderId
                                                    });
                                                } else {
                                                    if(orderD.status === 'cancel'){
                                                        $state.reload();
                                                    }
                                                }
                                            }, function () {
                                                $state.reload();
                                            })
                                        }
                                    }
                                }, function () {
                                    $state.reload();
                                });
                            }
                        }).catch(function() {
                            State.setUserPreviousState($state.current.name);
                            State.setUserPreviousStateParams({
                                id: $stateParams.id
                            });
                            State.setUserNextState('payment.confirm');
                            State.setUserNextStateParams($scope.cart);
                            Cart.setUserCart($scope.cart);

                            //TODO CAN THIS BE MADE INTO A FACTORY ?
                            var $uibModalInstanceRegister = $uibModal.open({
                                animation: true, // Default
                                templateUrl: 'auth/views/register.traveler.tpl.html',
                                controller: 'RegisterTravelerCtrl',
                                resolve : {
                                    registerTrue : function () {
                                        return true;
                                    },
                                    isGift: function() {
                                        return false;
                                    }
                                }
                            });

                            $uibModalInstanceRegister.result.then(function (status) {
                                if(status.stat === 'signupSuccess'){
                                    if(status.auth !== null && status.auth !== undefined && status.auth.uid !== null && status.auth.uid !== undefined){
                                        $uibModalInstance = $uibModal.open({
                                            animation: true,
                                            templateUrl: 'payments/views/confirm.tpl.html',
                                            controller: 'PaymentConfirmationCtrl',
                                            size : 'lg',
                                            resolve: {
                                                auth: function($state, Auth) {
                                                    return Auth.$requireAuth().catch(function() {
                                                        $state.go('signin');
                                                    });
                                                },
                                                cartData: function($state, Cart, State, CoreService, gettextCatalog) {
                                                    if (Cart.getUserCart()) {
                                                        return Cart.getUserCart();
                                                    } else {
                                                        CoreService.toastError(gettextCatalog.getString('You need to select a product before continuing!'),
                                                            gettextCatalog.getString('Please select a product before continuing!'));
                                                        $state.go(State.getUserPreviousState(), State.getUserPreviousStateParams());
                                                    }
                                                },
                                                userGigs : function () {
                                                    return $scope.userGigs;
                                                },
                                                userSavedSearch : function () {
                                                    return savedSearch;
                                                },
                                                userLocations : function () {
                                                    return  Profile.getUserLocations(profileId)
                                                },
                                                locationUnavailable : function () {
                                                    if(savedSearch){
                                                        return true
                                                    } else {
                                                        return false
                                                    }

                                                }
                                            }
                                        });

                                        $uibModalInstance.result.then(function (confirm) {
                                            if(confirm === 'removedAllGigs'){
                                                $state.reload();
                                            }
                                            if(confirm === 'canceled'){
                                                $state.reload();
                                            } else {
                                                if(confirm === 'confirmed'){
                                                    var $uibModalInstanceSecond = $uibModal.open({
                                                        animation: true, // Default
                                                        templateUrl: 'payments/views/process.tpl.html',
                                                        controller: 'PaymentProcessingCtrl',
                                                        resolve: {
                                                            auth: function($state, Auth) {
                                                                return Auth.$requireAuth().catch(function() {
                                                                    $state.go('signin');
                                                                });
                                                            },
                                                            localData: ['User','Auth',function(User, Auth){
                                                                //TODO NO NEED OF REQUIREAUTH HERE
                                                                return Auth.$requireAuth().then(function(auth){
                                                                    return User($scope.cart.localId).$loaded();
                                                                }).catch(function () {
                                                                    return null;
                                                                });
                                                            }],
                                                            travelerData : ['User','Auth',function(User, Auth){
                                                                //TODO NO NEED OF REQUIREAUTH HERE
                                                                return Auth.$requireAuth().then(function(auth){
                                                                    return User(auth.uid).$loaded();
                                                                }).catch(function () {
                                                                    return null;
                                                                });
                                                            }]
                                                        }
                                                    });

                                                    $uibModalInstanceSecond.result.then(function (orderD) {
                                                        if(orderD.status === 'paymentSuccess'){
                                                            // var $uibModalInstanceSuccessful = $uibModal.open({
                                                            //     animation: true, // Default
                                                            //     templateUrl: 'payments/views/success.tpl.html',
                                                            //     controller: 'PaymentSuccessCtrl',
                                                            //     resolve: {
                                                            //         auth: function($state, Auth) {
                                                            //             return Auth.$requireAuth().catch(function() {
                                                            //             });
                                                            //         }
                                                            //     }
                                                            // });
                                                            //
                                                            // $uibModalInstanceSuccessful.result.then(function (status) {
                                                            //     if(status === 'successCompleted'){
                                                            //         $state.go('messages.conversation',{'orderId' : orderD.orderId});
                                                            //     } else {
                                                            //         if(status === 'successCanceled'){
                                                            //             $state.go('messages.conversation',{'orderId' : orderD.orderId});
                                                            //         }
                                                            //     }
                                                            // }, function () {
                                                            //     $state.go('messages.conversation',{'orderId' : orderD.orderId});
                                                            // })
                                                            // $state.go('payment.success',{'orderId' : orderD.orderId});
                                                            $state.go('orders.newOrderConversation', {
                                                                orderId: orderD.data.orderId
                                                            });
                                                        } else {
                                                            if(orderD.status === 'cancel'){
                                                                $state.reload();
                                                            }
                                                        }
                                                    }, function () {
                                                        $state.reload();
                                                    })
                                                }
                                            }
                                        }, function () {
                                            $state.reload();
                                        });
                                    } else {
                                        CoreService.toastError(gettextCatalog.getString('Login before continuing'), gettextCatalog.getString('Login before continuing!'));
                                    }
                                }

                            }, function () {
                                $state.reload();
                            });
                        });
                    } else {
                        CoreService.toastError(gettextCatalog.getString('Select a service'), gettextCatalog.getString('Please select a service before continuing!'));
                        $state.go('home');
                    }
                };

                //We will handle save cart later for now just reset cart as user comes to any profile

                Cart.setUserCart(null);

                $scope.selectedDates = selectedDates;

                $scope.addToCart = function(gigId, set,type) {
                    if(type === "phone" && type !== null && type !== undefined){
                        if($scope.conversationOption !== null &&
                            $scope.conversationOption !== undefined && $scope.conversationOption !== "" ){
                            if (set) {
                                Search.getGig(gigId).$loaded().then(function(gigData) {
                                    $scope.cart.localId = $stateParams.id;
                                    $scope.cart.gigs[gigId] = true;
                                    $scope.cart.specialConversation = $scope.conversationOption;


                                    $scope.totalValue += gigData.plans[$scope.conversationOption];
                                    $scope.cart.total += gigData.plans[$scope.conversationOption];
                                    if(savedSearch){
                                        $scope.cart.location = savedSearch;
                                    }
                                    Cart.setUserCart($scope.cart);
                                    $cookieStore.remove('userCart');
                                    $cookieStore.put('userCart',$scope.cart);
                                });
                            } else {
                                Search.getGig(gigId).$loaded().then(function(gigData) {
                                    $scope.totalValue -= gigData.plans[$scope.conversationOption];
                                    $scope.cart.total -= gigData.plans[$scope.conversationOption];
                                    delete $scope.cart.gigs[gigId];
                                    delete $scope.cart.specialConversation;

                                    $cookieStore.remove('userCart');
                                    $cookieStore.put('userCart',$scope.cart);
                                    Cart.setUserCart($scope.cart);
                                });
                            }
                        } else {
                            CoreService.toastError(gettextCatalog.getString('Select an option'),gettextCatalog.getString('Please select an option and continue!'))
                            $scope.selectedGigs.selected[gigId] = false;
                            delete $scope.selectedGigs.selected[gigId];
                        }
                    } else {

                        if(type === "itinerary" && type !== null && type !== undefined){
                            if($scope.itineraryOption !== null &&
                                $scope.itineraryOption !== undefined && $scope.itineraryOption !== "" ){
                                if (set) {
                                    Search.getGig(gigId).$loaded().then(function(gigData) {
                                        $scope.cart.localId = $stateParams.id;
                                        $scope.cart.gigs[gigId] = true;
                                        $scope.cart.specialItinerary = $scope.itineraryOption;

                                        $scope.totalValue += gigData.plans[$scope.itineraryOption];
                                        $scope.cart.total += gigData.plans[$scope.itineraryOption];
                                        if(savedSearch){
                                            $scope.cart.location = savedSearch;
                                        }
                                        Cart.setUserCart($scope.cart);
                                        $cookieStore.remove('userCart');
                                        $cookieStore.put('userCart',$scope.cart);
                                    });
                                } else {
                                    Search.getGig(gigId).$loaded().then(function(gigData) {
                                        $scope.totalValue -= gigData.plans[$scope.itineraryOption];
                                        $scope.cart.total -= gigData.plans[$scope.itineraryOption];

                                        delete $scope.cart.gigs[gigId];
                                        delete $scope.cart.specialItinerary;

                                        $cookieStore.remove('userCart');
                                        $cookieStore.put('userCart',$scope.cart);
                                        Cart.setUserCart($scope.cart);
                                    });
                                }
                            } else {
                                CoreService.toastError(gettextCatalog.getString('Select an option'),gettextCatalog.getString('Please select an option and continue!'))
                                $scope.selectedGigs.selected[gigId] = false;
                                delete $scope.selectedGigs.selected[gigId];
                            }
                        } else {
                            if (set) {
                                Search.getGig(gigId).$loaded().then(function(gigData) {
                                    $scope.cart.localId = $stateParams.id;
                                    $scope.cart.gigs[gigId] = true;
                                    $scope.totalValue += gigData.charges;
                                    $scope.cart.total += gigData.charges;
                                    if(savedSearch){
                                        $scope.cart.location = savedSearch;
                                    }
                                    Cart.setUserCart($scope.cart);
                                    $cookieStore.remove('userCart');
                                    $cookieStore.put('userCart',$scope.cart);
                                });
                            } else {
                                Search.getGig(gigId).$loaded().then(function(gigData) {
                                    $scope.totalValue -= gigData.charges;
                                    $scope.cart.total -= gigData.charges;
                                    delete $scope.cart.gigs[gigId];
                                    $cookieStore.remove('userCart');
                                    $cookieStore.put('userCart',$scope.cart);
                                    Cart.setUserCart($scope.cart);
                                });
                            }
                        }
                    }
                };

                $scope.itineraryOption = '1-3days';
                $scope.previousItinerary = null;

                $scope.selectItinerary = function (optionSelected,gigId,set,type) {
                    $scope.previousItinerary = $scope.itineraryOption;
                    $scope.itineraryOption = optionSelected;

                    if (set) {
                        Search.getGig(gigId).$loaded().then(function(gigData) {
                            $scope.cart.localId = $stateParams.id;
                            $scope.cart.gigs[gigId] = true;

                            $scope.cart.specialItinerary = $scope.itineraryOption;

                            $scope.totalValue -= gigData.plans[$scope.previousItinerary];
                            $scope.cart.total -= gigData.plans[$scope.previousItinerary];

                            $scope.totalValue += gigData.plans[$scope.itineraryOption];
                            $scope.cart.total += gigData.plans[$scope.itineraryOption];

                            if(savedSearch){
                                $scope.cart.location = savedSearch;
                            }
                            Cart.setUserCart($scope.cart);
                            $cookieStore.remove('userCart');
                            $cookieStore.put('userCart',$scope.cart);

                        });
                    }
                };

                $scope.conversationOption = '30mins';
                $scope.previousSelectedConvo = null;

                $scope.selectConversation = function (optionSelected,gigId,set,type) {
                    $scope.previousSelectedConvo = $scope.conversationOption;
                    $scope.conversationOption = optionSelected;

                    if (set) {
                        Search.getGig(gigId).$loaded().then(function(gigData) {
                            $scope.cart.localId = $stateParams.id;
                            $scope.cart.gigs[gigId] = true;
                            $scope.cart.specialConversation = $scope.conversationOption;

                            $scope.totalValue -= gigData.plans[$scope.previousSelectedConvo];
                            $scope.cart.total -= gigData.plans[$scope.previousSelectedConvo];

                            $scope.totalValue += gigData.plans[$scope.conversationOption];
                            $scope.cart.total += gigData.plans[$scope.conversationOption];

                            if(savedSearch){
                                $scope.cart.location = savedSearch;
                            }
                            Cart.setUserCart($scope.cart);
                            $cookieStore.remove('userCart');
                            $cookieStore.put('userCart',$scope.cart);
                        });
                    }
                };

                $scope.selectedGigs = {
                    selected:{}
                };

                $scope.toggleMin = function() {
                    $scope.minDate = $scope.minDate ? new Date(2020, 3, 18) : new Date(2020, 3, 18);
                };

                $scope.toggleMin();
                $scope.maxDate = new Date(2020, 3, 18);


                // ******************* TESTIMONIALS ****************************
                //console.log(testimonials);
                //console.log(testimonialsCount);
                //console.log(ratings);
                //console.log(ratingsCount);
                $scope.getNumberRating = function(num) {
                    return new Array(num);
                };

                $scope.getNumber = function(num) {
                    return new Array(num);
                };

                //$scope.localsRatings = Profile.getRatings($stateParams.id);


                Profile.getRatings($stateParams.id).$loaded(function (localRankingSnap) {
                    $scope.ratCount = localRankingSnap.length;
                    $scope.ratingsPresent = true;
                    var lRating = 0;
                    angular.forEach(localRankingSnap, function (val, key) {
                        lRating += val.ratingValue;
                    });

                    var tempRemainder = lRating/localRankingSnap.length - Math.floor(lRating/localRankingSnap.length);

                    if(tempRemainder === 0){
                        $scope.localsRating = Math.floor(lRating/localRankingSnap);
                        $scope.ratingRemainder = 0;
                    } else {
                        if(tempRemainder <= 0.5 ){
                            $scope.localsRating = Math.floor(lRating/localRankingSnap.length);
                            $scope.ratingRemainder = 0.5;
                        } else {
                            if(tempRemainder > 0.5)
                                $scope.localsRating = Math.ceil(lRating/localRankingSnap.length);
                            $scope.ratingRemainder = 0;
                        }
                    }
                });

                //if(ratingsCount[0]){
                //    //$scope.ratCount = ratingsCount.length;
                //    //$scope.ratingsPresent = true;
                //    //var lRating = 0;
                //    //angular.forEach($scope.localsRatings, function (val, key) {
                //    //    lRating += val.ratingValue;
                //    //});
                //    //
                //    //var tempRemainder = lRating/$scope.localsRatings.length - Math.floor(lRating/$scope.localsRatings.length);
                //    //
                //    //if(tempRemainder === 0){
                //    //    $scope.localsRating = Math.floor(lRating/$scope.localsRatings.length);
                //    //    $scope.ratingRemainder = 0;
                //    //} else {
                //    //    if(tempRemainder <= 0.5 ){
                //    //        $scope.localsRating = Math.floor(lRating/localsRatings.length);
                //    //        $scope.ratingRemainder = 0.5;
                //    //    } else {
                //    //        if(tempRemainder > 0.5)
                //    //        $scope.localsRating = Math.ceil(lRating/localsRatings.length);
                //    //        $scope.ratingRemainder = 0;
                //    //    }
                //    //}
                //} else {
                //    $scope.ratingsPresent = false;
                //    $scope.ratCount = 0;
                //}

                $scope.localsTestimonial = Profile.getTestimonials($stateParams.id);

                if(profile.oldGold === true && profile.oldGold !== undefined && profile.oldGold !== null){
                    $scope.oldTestimonialsPresent = true;
                    $scope.oldWebsiteTestimonials = oldTestimonials;
                } else {
                    $scope.oldTestimonialsPresent = false;
                }
                //$scope.oldTestimonials = Profile.getOldTestimonials($stateParams.id);

                Profile.getTestimonials($stateParams.id).$loaded(function (localTestimonialSnap) {
                    $scope.testimonialPresent = true;
                });

                if(testimonialsCount[0]){
                    $scope.testimonialPresent = true;
                } else {
                    $scope.testimonialPresent = false;
                }

                $scope.getOrderData = function (orderId) {
                    return Profile.getOrder(orderId);
                };

                $scope.getUserData = function (uid) {
                    return Profile.getProfile(uid);
                }


            } else {
                $state.go('home');
            }

        });
