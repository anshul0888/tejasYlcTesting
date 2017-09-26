(function() {
    'use strict';

    angular
        .module('com.ylc.payments')
        .controller('PaymentConfirmationCtrl', PaymentConfirmationCtrl);

    PaymentConfirmationCtrl.$inject = ['$scope', '$stateParams', '$state', '$uibModal', '$modalInstance', 'CoreService',
        'gettextCatalog', 'cartData', 'State', 'Gigs', 'Cart', 'userGigs', 'userSavedSearch', 'Search', '$cookieStore',
        'userLocations', 'Discount', 'blockUI', 'Giftcard','locationUnavailable',
    ];

    /* @ngInject */
    function PaymentConfirmationCtrl($scope, $stateParams, $state, $uibModal, $modalInstance,
        CoreService, gettextCatalog, cartData, State, Gigs, Cart, userGigs, userSavedSearch, Search, $cookieStore,
        userLocations, Discount, blockUI, Giftcard,locationUnavailable) {

        $scope.userCart = cartData;

        console.log(cartData);

        $scope.userLocations = userLocations;


        $scope.location = userSavedSearch;


        console.log(userSavedSearch);

        $scope.addMissingLocation = function (location) {
            console.log(location);

            $scope.userCart.location = [];
            $scope.userCart.location[0] = {
                address_components : location.address_components ? location.address_components : [],
                formatted_address : location.formatted_address ? location.formatted_address : 'Formatted address missing',
                place_id : location.$id ? location.$id : location.$id,
                types : location.types ? location.types : []
            };

            $scope.location = location;
            Cart.setUserCart($scope.userCart);
        };

        $scope.locationUnavailable = locationUnavailable;

        $scope.getGig = function(id) {
            return Gigs.getGig(id);
        };

        $scope.discountPresent = false;
        //
        // if($scope.userCart.discountPresent){
        //     $scope.discountPresent = $scope.userCart.discountPresent;
        //     $scope.discount = ($scope.userCart.total * $scope.userCart.discount ) / 100;
        //     $scope.userCart.total -= (($scope.userCart.total * $scope.userCart.discount ) / 100);
        //     $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
        //     $scope.userCart.total += $scope.serviceCharge;
        // } else{
        //     $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
        //     $scope.userCart.total += $scope.serviceCharge;
        // }

        $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
        $scope.userCart.total += $scope.serviceCharge;

        //PROMOCODE
        $scope.promocodePresent = false;
        $scope.popupDiscount = false;
        var applyDiscount = function(type, discountType, discountId) {
            if (discountType === 'specialFree' || discountType === 'specialMarriott') {
                $scope.fullDiscount = true;
                $scope.userCart.isAFreeGig = true;
            }

            if (discountType === 'popup1') {
                $scope.popupDiscount = true;
            }

            if ($scope.userCart.total !== null && $scope.userCart.total !== undefined && $scope.userCart.total > 0) {
                $scope.userCart.discount = type;
                $scope.userCart.discountPresent = true;
                $scope.promocodePresent = true;
                $scope.userCart.discountType = discountType;
                $scope.userCart.discountCode = discountId;

                // $scope.totalValue = $scope.totalValue - ((type * $scope.totalValue ) / 100);

                $scope.discountPresent = true;

                if ($scope.popupDiscount) {
                    $scope.userCart.total -= $scope.serviceCharge;
                    $scope.discount = $scope.userCart.discount;

                    if ($scope.userCart.total <= $scope.userCart.discount) {
                        $scope.userCart.total = 0;
                        $scope.fullDiscount = true;
                        $scope.userCart.isAFreeGig = true;
                    } else {
                        $scope.userCart.total -= $scope.userCart.discount;
                    }
                    $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
                    $scope.userCart.total += $scope.serviceCharge;
                } else {
                    $scope.userCart.total -= $scope.serviceCharge;
                    $scope.discount += ($scope.userCart.total * $scope.userCart.discount) / 100;
                    $scope.userCart.total -= (($scope.userCart.total * $scope.userCart.discount) / 100);
                    $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
                    $scope.userCart.total += $scope.serviceCharge;
                }

                Cart.setUserCart($scope.userCart);
                blockUI.stop();
            } else {
                $scope.userCart.discount = type;
                $scope.userCart.discountType = discountType;
                $scope.userCart.discountCode = discountId;
                $scope.userCart.discountPresent = true;
                $scope.discountPresent = true;
                $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
                $scope.userCart.total += $scope.serviceCharge;
                Cart.setUserCart($scope.userCart);
                blockUI.stop();
            }
        };

        $scope.applyPromoCode = function(promo) {
            blockUI.start('Applying promo code ...');

            if (promo.indexOf("-") != -1) {
                var prom = promo.toLowerCase();
                var code = prom.trim();
            } else {
                var prom = promo.toUpperCase();
                var code = prom.trim();
            }

            Discount.checkDiscountCode(code).$loaded(function(snap) {
                //TODO check the it is not expired
                if (!snap.used && snap.used !== null && snap.used !== undefined) {
                    //TODO && snap.expiredTime !== true IMplement logic for check expired time
                    if (snap.expired !== true) {
                        if ($scope.promocodePresent === false && $scope.promocodePresent !== undefined && $scope.promocodePresent !== null) {
                            $scope.promocodePresent = true;
                            applyDiscount(snap.type, snap.discountType, snap.$id);
                        } else {
                            blockUI.stop();
                            CoreService.toastError(gettextCatalog.getString('Discount Code Present'),
                                gettextCatalog.getString('Discount code present, please refresh page and try again!'));
                        }
                    } else {
                        blockUI.stop();
                        CoreService.toastError(gettextCatalog.getString('Discount Code Expired'),
                            gettextCatalog.getString('Discount code expired, please contact info@yourlocalcousin.com'));
                    }
                } else {
                    CoreService.toastError(gettextCatalog.getString('Discount Code already used'),
                        gettextCatalog.getString('Discount code already used, please contact info@yourlocalcousin.com'));
                    blockUI.stop();
                }
            })
        };

        var applyGiftCard = function(giftCardAmount, giftcardCode) {

            // if the cart amount is more than 0
            if ($scope.userCart.total !== null && $scope.userCart.total !== undefined && $scope.userCart.total > 0) {

                $scope.giftCardPresent = true;
                $scope.userCart.giftCardPresent = true;
                $scope.userCart.giftcardCode = giftcardCode;


                var userHasToPay = $scope.userCart.total - $scope.serviceCharge;
                if (userHasToPay >= giftCardAmount) {
                    // this is when the giftcard balance is less than the amount user has to pay

                    $scope.userCart.giftCardAmount = giftCardAmount;
                    $scope.userCart.total -= $scope.serviceCharge;
                    $scope.discount += giftCardAmount;
                    $scope.userCart.total -= Number(giftCardAmount);
                    $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
                    $scope.userCart.total += $scope.serviceCharge;
                    $scope.giftCardAmount = giftCardAmount;

                    console.log($scope);
                } else {


                    $scope.userCart.total -= $scope.serviceCharge;
                    $scope.userCart.giftCardAmount = $scope.userCart.total;
                    $scope.giftCardAmount = $scope.userCart.total;
                    $scope.discount = $scope.userCart.giftCardAmount;
                    $scope.userCart.total = 0;
                    $scope.fullDiscount = true;
                    $scope.userCart.isAFreeGig = true;
                }

                Cart.setUserCart($scope.userCart);
                blockUI.stop();

            } else {
                CoreService.toastError(
                    gettextCatalog.getString('Your total is already zero!'),
                    gettextCatalog.getString('The cart amount is already zero! can\'t apply anymore discount'));
                blockUI.stop();
            }
        }

        $scope.applyGiftCard = function(giftcardCode) {

            if ($scope.giftCardPresent) {
                CoreService.toastError(
                    gettextCatalog.getString('You have already applied a Gift Card'),
                    gettextCatalog.getString('You cannot apply two giftcards at the same time. Please cancel this and try again for a different giftcard'));
                return;
            }

            blockUI.start('Applying giftcard code ...');

            Giftcard.checkGiftCardCode(giftcardCode).then(function(response) {
                console.log(response);

                var balance = response.data.amount;

                if (balance <= 0) {
                    CoreService.toastError(
                        gettextCatalog.getString('Giftcard already used!'),
                        gettextCatalog.getString('The entered giftcard has been used, please try another one.'));
                    blockUI.stop();
                } else {
                    applyGiftCard(balance, giftcardCode);   
                }
            }).catch(function(errorResponse) {
                CoreService.toastError(
                    gettextCatalog.getString('No such giftcard exists!'),
                    gettextCatalog.getString('Please try again with a different giftcard number'));
                blockUI.stop();
            });
        };

        $scope.userGigs = userGigs;

        $scope.userGigs = [];



        //angular.forEach($scope.userCart.gigs, function (val, key) {
        //    angular.forEach(userGigs, function (valI, keyI) {
        //        if(key === valI.$id){
        //
        //        } else {
        //            $scope.userGigs.push(valI);
        //        }
        //    });
        //});

        function conversationGig() {
            if ($scope.userCart.specialConversation !== null && $scope.userCart.specialConversation !== undefined && $scope.userCart.specialConversation !== "") {
                $scope.phoneGig =
                    $scope.userCart.specialConversation === '120mins' ? "120 mins" :
                    $scope.userCart.specialConversation === '30mins' ? "30 mins" :
                    $scope.userCart.specialConversation === '60mins' ? "60 mins" : ""
            }
        }
        conversationGig();


        function itineraryGig() {
            if ($scope.userCart.specialItinerary !== null && $scope.userCart.specialItinerary !== undefined && $scope.userCart.specialItinerary !== "") {
                $scope.itineraryGig =
                    $scope.userCart.specialItinerary === '1-3days' ? "1-3 days" :
                    $scope.userCart.specialItinerary === '4-7days' ? "4-7 days" :
                    $scope.userCart.specialItinerary === '8-11days' ? "8-11 days" : ""
            }
        }

        itineraryGig();

        function isEmpty(obj) {
            for (var i in obj) {
                return false; }
            return true;
        }

        $scope.removeFromCart = function(key, charges) {
            delete $scope.userCart.gigs[key];

            if ($scope.userCart.discountPresent) {

                if ($scope.popupDiscount) {
                    $scope.userCart.total += $scope.discount;
                    $scope.userCart.total -= $scope.serviceCharge;
                    $scope.userCart.total -= charges;
                    $scope.discount = $scope.userCart.discount;
                    if ($scope.userCart.total <= $scope.userCart.discount) {
                        $scope.userCart.total = 0;
                        $scope.fullDiscount = true;
                        $scope.userCart.isAFreeGig = true;
                    } else {
                        $scope.userCart.total -= $scope.userCart.discount;
                    }
                    $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
                    $scope.userCart.total += $scope.serviceCharge;
                } else {
                    $scope.userCart.total += $scope.discount;
                    $scope.userCart.total -= $scope.serviceCharge;
                    $scope.userCart.total -= charges;
                    // - ((charges  * $scope.userCart.discount) / 100));
                    $scope.discount = ($scope.userCart.total * $scope.userCart.discount) / 100;
                    $scope.userCart.total -= (($scope.userCart.total * $scope.userCart.discount) / 100);
                    $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
                    $scope.userCart.total += $scope.serviceCharge;
                }
            } else {
                $scope.userCart.total -= charges;
                $scope.userCart.total -= $scope.serviceCharge;
                $scope.serviceCharge = ($scope.userCart.total * 8) / 100;
                $scope.userCart.total += $scope.serviceCharge;
            }
            Cart.setUserCart($scope.userCart);

            if (isEmpty($scope.userCart.gigs)) {
                $scope.userCart = null;
                Cart.setUserCart(null);
                $modalInstance.close('removedAllGigs');
            }

        };

        $scope.processPayment = function() {
            if (Cart.getUserCart().total > 0 ||
                ($scope.fullDiscount !== null && $scope.fullDiscount !== undefined && $scope.fullDiscount === true)

            ) {
                if($scope.userCart.location !== null && $scope.userCart.location !== undefined){
                    $modalInstance.close('confirmed');
                } else {
                    CoreService.alertError(
                        gettextCatalog.getString('Choose a location!'),
                        gettextCatalog.getString('Can\'t proceed without choosing a Location for your order!'));
                }
            } else {
                CoreService.toastError(
                    gettextCatalog.getString('Choose a service!'),
                    gettextCatalog.getString('Can\'t proceed without choosing a service!'));
            }
        };

        $scope.addToCart = function(gigId, set) {
            if (set) {
                Search.getGig(gigId).$loaded().then(function(gigData) {
                    $scope.userCart.localId = $stateParams.id;
                    $scope.userCart.gigs[gigId] = true;
                    $scope.totalValue += gigData.charges;
                    $scope.userCart.total += gigData.charges;
                    $scope.userCart.location = userSavedSearch;
                    Cart.setUserCart($scope.userCart);
                    $cookieStore.remove('userCart');
                    $cookieStore.put('userCart', $scope.userCart);
                });
            } else {
                Search.getGig(gigId).$loaded().then(function(gigData) {
                    $scope.totalValue -= gigData.charges;
                    $scope.userCart.total -= gigData.charges;
                    delete $scope.userCart.gigs[gigId];
                    $cookieStore.remove('userCart');
                    $cookieStore.put('userCart', $scope.userCart);
                    Cart.setUserCart($scope.userCart);
                });
            }
        };

        $scope.cancel = function() {
            $modalInstance.close('canceled');
        };

    }
})();
