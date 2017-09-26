/**
 * Created by TJ on 9/9/15.
 */

'use strict';
angular.module('com.ylc.dashboard')
    .controller('TravelersDashboardCtrl', function($scope, CoreService,gettextCatalog, Dashboard,auth,User,$state,Gigs,SaveSearch,userData,Register,notify) {

        if(userData){
            $scope.usersData = userData;
        } else {
        }

        $scope.autocompleteOptions = {
            types: ['(regions)']
        };

        $scope.testimonial = null;
        $scope.setOrderTestimonial = function (testimonial,orderId,localId,travelerId) {
            if(orderId){
                if(testimonial === null || testimonial === '' || testimonial === undefined){
                    CoreService.toastError(gettextCatalog.getString('Error!'),gettextCatalog.getString('Testimonial can\'t be empty!'))
                } else {
                    Dashboard.setOrderTestimonial(orderId).$save().then(function (ref) {
                        ref.set(testimonial, function (error) {
                            if(error){
                                CoreService.toastError(gettextCatalog.getString('Error!'),gettextCatalog.getString('Testimonial not saved!'))
                            } else {
                                Dashboard.setLocalTestimonial(orderId,testimonial,travelerId,localId);
                                $scope.testimonial = '';
                            }
                        })
                    });

                    Dashboard.setOrderTestimonialGiven(orderId).$save().then(function (ref) {
                        ref.set(true, function (error) {
                            if(error){
                                CoreService.toastError(gettextCatalog.getString('Error!'),gettextCatalog.getString('Testimonial not saved!'))
                            } else {
                                //TODO QUEUE TO UPDATE AVG RATING OF LOCAL
                                $scope.testimonial = '';
                                CoreService.toastSuccess(gettextCatalog.getString('Ratings Saved'),gettextCatalog.getString('Your Testimonial is safe with us!'));
                            }
                        })
                    });
                }
            } else {
                CoreService.toastError(gettextCatalog.getString('Error!'),gettextCatalog.getString('Select an Order!'))
            }
        };

        $scope.getNumber = function(num) {
            return new Array(num);
        };

        $scope.searchLocals = function (place) {
            if(SaveSearch.getUserSearch()){
                SaveSearch.setUserSearch(null);
            }
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode( { 'placeId': place.place_id}, function(results, status) {
                SaveSearch.setUserSearch(results);
                if (status == google.maps.GeocoderStatus.OK) {
                    var location = results[0].formatted_address;
                    var loc = location.replace(/\s/g,'');
                    loc = loc.split(',').join('-');
                    $state.go('locations.results',{location : loc},{reload: true});
                } else {
                    CoreService.toastError(gettextCatalog.getString('Error! Incorrect Search!'), gettextCatalog.getString('Try again after correcting place or contact us on info@yourlocalcousin.com!'));
                }
            });
        };

        $scope.hoveringLeave = function(rating,orderId,localId,travelerId) {
            if(orderId){
                if(!rating || rating < 1 || rating > 5){
                } else {
                    Dashboard.setTravelerOrderRating(orderId).$save().then(function (ref) {
                        ref.set(rating, function (error) {
                            if(error){
                                CoreService.toastError(gettextCatalog.getString('Error!'),gettextCatalog.getString('Rating not saved!'))
                            } else {
                                Dashboard.setLocalRating(localId,rating,travelerId,orderId);

                                Dashboard.setTravelerOrderRated(orderId).$save().then(function (ref) {
                                    ref.set(true, function (error) {
                                        if(error){
                                            CoreService.toastError(gettextCatalog.getString('Error!'),gettextCatalog.getString('Rating not saved!'))
                                        } else {
                                            CoreService.toastSuccess(gettextCatalog.getString('Ratings Saved'),gettextCatalog.getString('Your Rating is safe with us!'));
                                        }
                                    })
                                })
                            }
                        })
                    });
                }
            } else {
                CoreService.toastError(gettextCatalog.getString('Error!'),gettextCatalog.getString('Select an Order!'))
            }
        };


        Dashboard.tripsTaken(auth.uid).once('value', function (snapshot) {
            if(snapshot.val() !== null){
                $scope.travelerOrders = Dashboard.getTravelersOrders(auth.uid);
            }  else {
                CoreService.toastInfo(gettextCatalog.getString('Place an order!'), gettextCatalog.getString('You don\'t have an order placed, please place and order and try again'));
                $state.go('dashboard.view');
            }
        });

        $scope.getGig = function(id){
            return Gigs.getGig(id);
        };

        $scope.usersData = userData;

        $scope.getLocalsData = function (localId) {
            return User(localId);
        }
    });
