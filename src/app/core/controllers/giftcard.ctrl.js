/**
 * Created by TJ on 7/2/15.
 */

angular.module('com.ylc.core')
    .controller('GiftCardCtrl',
        function(
            $scope,
            CoreService,
            $state,
            $stateParams,
            gettextCatalog,
            $uibModal,
            Profile,
            Auth,
            Cart,
            Orders,
            State,
            UserData,
            SaveSearch,
            $timeout,
            $cookieStore,
            $http,
            YLC_API) {



            /**==============================================
             * Custom functions                             *
             *==============================================/

            /**
             * Generic function to open  payment confirmation modal
             * @return {Promise}    Promise object of the modal state is returned
             */
            function paymentConfirmationModal() {
                return $uibModal.open({
                    animation: true,
                    templateUrl: "core/views/giftcard/giftcard_payment_confirm.tpl.html",
                    controller: "GiftcardPaymentConfirmationCtrl",
                    size: "lg",
                    resolve: {
                        auth: function($state, Auth) {
                            return Auth.$requireAuth().catch(function() {
                                $state.go("signin");
                            });
                        },
                        cartData: function($state, Cart, State, CoreService, gettextCatalog) {
                            if (Cart.getUserCart()) {
                                return Cart.getUserCart();
                            } else {

                                // only when the cart is empty
                                CoreService.toastError(gettextCatalog.getString("You need to select a product before continuing!"),
                                    gettextCatalog.getString("Please select a product before continuing!"));
                                $state.go(State.getUserPreviousState(), State.getUserPreviousStateParams());
                            }
                        }
                    }
                });
            }

            /**
             * Generic function to open payment processing modal
             * @return {Promise} Promise object of the modal state is returned
             */
            function paymentProcessingModal() {
                return $uibModal.open({
                    animation: true, // Default
                    templateUrl: "core/views/giftcard/giftcard_payment_process.tpl.html",
                    controller: "GiftcardPaymentProcessingCtrl",
                    resolve: {
                        auth: function($state, Auth) {
                            return Auth.$requireAuth().catch(function() {
                                $state.go("signin");
                            });
                        },
                        userData: ['User', 'Auth', function(User, Auth) {
                            //TODO NO NEED OF REQUIREAUTH HERE
                            return Auth.$requireAuth().then(function(auth) {
                                return User(auth.uid).$loaded();
                            }).catch(function() {
                                return null;
                            });
                        }]
                    }
                });
            }

            /**
             * Generic function to open payment success modal
             * @return {Promise} Promise object of the modal state is returned
             */
            function giftcardSuccessModal() {
                return $uibModal.open({
                    animation: true,
                    templateUrl: "core/views/giftcard_success.tpl.html",
                    size: "lg"
                });
            }

            /**
             * Generic function to open registration modal
             * @return {Promise} Promise object of the modal state is returned
             */
            function registrationModal() {
                return $uibModal.open({
                    animation: true, // Default
                    templateUrl: 'auth/views/register.traveler.tpl.html',
                    controller: 'RegisterTravelerCtrl',
                    resolve: {
                        registerTrue: function() {
                            return true;
                        },
                        isGift: function() {
                            return true;
                        }
                    }
                });
            }

            /**
             * Fucntion to send giftcard details to the feathers server once the payment is done
             * @param  {Object} data Data object which contains all the details of the users
             */
            function sendGiftCardToFeathers(data) {
                $http.post(YLC_API + "giftcards/", data).then(function(response) {

                    var $uibModalInstance = giftcardSuccessModal();
                    $scope.giftcard = null;

                    $state.reload();
                }, function(rejectionResponse) {
                    CoreService.toastError(gettextCatalog.getString("Error!"), gettextCatalog.getString("Something went wrong, please contact support!"))
                });
            }

            /**
             * Function to deal with user who are already logged in
             */
            function paymentForLoggedInUser() {

                // Retrieves the form data from the UI
                var data = $scope.giftcard;
                var authData = Auth.$getAuth();

                var $uibModalInstance = paymentConfirmationModal();

                // check the action performed in the last modal
                $uibModalInstance.result.then(function(confirm) {
                    if (confirm === "removedAllGigs") {
                        $state.reload();
                    }
                    if (confirm === "canceled") {
                        $state.reload();
                    } else {
                        if (confirm === "confirmed") {


                            // open the final modal to process payment
                            var $uibModalInstanceSecond = paymentProcessingModal();

                            $uibModalInstanceSecond.result.then(function(orderD) {
                                if (orderD.status === "paymentSuccess") {

                                    Auth.$requireAuth().then(function(something) {

                                        data.gifter = Profile.getProfile(something.uid);
                                        sendGiftCardToFeathers(data);
                                    });
                                }
                            }, function() {
                                $state.reload();
                            })
                        }
                    }
                }, function() {
                    $state.reload();
                });
            }

            /**
             * This function is to make payment for the users who are not logged in 
             * and needs to either register of login first
             * @param  {Object} exception Exception object
             */
            function paymentForNonLoggedInUser(exception) {

                // Retrieves the form data from the UI
                var data = $scope.giftcard;
                // Open the registration modal
                var $uibModalInstanceRegister = registrationModal();

                // check the registration status
                $uibModalInstanceRegister.result.then(function(status) {
                    if (status.stat === 'signupSuccess') {
                        if (status.auth !== null && status.auth !== undefined && status.auth.uid !== null && status.auth.uid !== undefined) {

                            // if signup was success open the payment confirmation modal
                            $uibModalInstance = paymentConfirmationModal();

                            // check the action performed in the last modal
                            $uibModalInstance.result.then(function(confirm) {
                                if (confirm === 'removedAllGigs') {
                                    $state.reload();
                                }
                                if (confirm === 'canceled') {
                                    $state.reload();
                                } else {
                                    if (confirm === 'confirmed') {

                                        var $uibModalInstanceSecond = paymentProcessingModal();
                                        $uibModalInstanceSecond.result.then(function(orderD) {
                                            if (orderD.status === 'paymentSuccess') {

                                                data.gifter = Profile.getProfile(status.auth.uid);
                                                sendGiftCardToFeathers(data);

                                            }
                                        }, function() {
                                            $state.reload();
                                        })
                                    }
                                }
                            }, function() {
                                $state.reload();
                            });
                        } else {

                            // if the registration fails
                            CoreService.toastError(
                                gettextCatalog.getString('Login before continuing'),
                                gettextCatalog.getString('Login before continuing!'));
                        }
                    }

                }, function() {
                    $state.reload();
                });
            }







            /**==============================================
             * Scope functions                              *
             *==============================================/


            /**
             * Function to handle form submission
             * @param  {Boolean} isValid Boolean variable to check whether the enterd form is valid or not
             */
            $scope.submitGiftCard = function(isValid) {


                /**
                 * if form is invalid raise an error toast and return
                 * @param  {Boolean} !isValid Boolean value to check the validity of form
                 */
                if (!isValid) {

                    CoreService.toastError(
                        gettextCatalog.getString('Fill out all the mandatory fields'),
                        gettextCatalog.getString('Please fill out all the mandatory fields before continuing'));

                    return;
                }

                /**
                 * checks whether the entered email id is a free gig or not
                 * @param  {String} $scope.giftcard.email Email in the input box
                 */
                if ($scope.giftcard.email === 'suryadeep10@gmail.com') {

                    /**
                     * Sets the user cart
                     */
                    Cart.setUserCart({
                        'total': Number($scope.giftcard.amount),
                        'giftedTo': $scope.giftcard.email,
                        'giftedToName': $scope.giftcard.name,
                        'isAFreeGig': true
                    });
                } else {
                    Cart.setUserCart({
                        'total': Number($scope.giftcard.amount),
                        'giftedTo': $scope.giftcard.email,
                        'giftedToName': $scope.giftcard.name
                    });
                }

                /**
                 * If entered value if less than or equal to zero then raise an error message
                 * @param  {Number} $scope.giftcard.amount Amount entered in the form
                 */
                if ($scope.giftcard.amount <= 0) {

                    CoreService.toastError(
                        gettextCatalog.getString('Enter a valid amount!'),
                        gettextCatalog.getString('Please enter an amount greater than 0.'));

                    return;
                }

                /**
                 * Checks the authentication status and calls the respective function
                 */
                Auth.$requireAuth().then(
                    paymentForLoggedInUser
                ).catch(
                    paymentForNonLoggedInUser
                );
            }
        });
