angular.module('ylc', [
        'templates-app',
        'templates-common',
        'firebase',
        'firebase.ref',
        'firebase.auth',
        'ngAnimate',
        'ui.bootstrap',
        'ui.router',
        'permission',
        'ngTouch',
        'angular-loading-bar',
        'gettext',
        'oitozero.ngSweetAlert',
        'toasty',
        'angularMoment',
        'permission',
        'ngIdle',
        'ngMeta',
        'algoliasearch',
        'updateMeta',
        'angularGeoFire',
        'djds4rce.angular-socialshare',
        'cgNotify',
        'ngSanitize',
        'ngCookies',
        'angularSpinner',
        'satellizer',
        'ngTagsInput',
        'gm.datepickerMultiSelect',
        'angular.filter',
        'angularVideoBg',
        'blockUI',
        'angularModalService',
        'angulartics',
        'angulartics.google.analytics',
        'google.places',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.poster',
        'com.2fdevs.videogular.plugins.buffering',
        'com.2fdevs.videogular.plugins.analytics',
        'api.ref',
        'com.ylc.state',
        'com.ylc.gigs',
        'com.ylc.profile',
        'com.ylc.user-data',
        'com.ylc.user',
        'com.ylc.save-search',
        'com.ylc.cart',
        'com.ylc.core',
        'com.ylc.auth',
        'com.ylc.profile.view',
        'com.ylc.profile.edit',
        'com.ylc.profile.create',
        'com.ylc.dashboard',
        'com.ylc.locations',
        'com.ylc.payments',
        'com.ylc.discounts',
        'com.ylc.giftcard',
        'com.ylc.search',
        'com.ylc.blog',
        'com.ylc.iPMessaging',
        'com.ylc.experiences',
        'com.ylc.twilio',
        'com.ylc.orders',
        'com.ylc.text',
        'com.ylc.email',
        'com.ylc.feathersEmail',
        'com.ylc.local-stories'
    ])
    .constant('SECURED_ROUTES', {})
    //TODO Remove below to appropriate env setting
    .constant('ENV', { name: 'production', apiUrl: '/api/', siteUrl: '' })


.config(function myAppConfig($stateProvider, $urlRouterProvider, ngMetaProvider) {
    $urlRouterProvider.otherwise('/');
    ngMetaProvider.setDefaultTitle('Unique experiences and travel advise by locals');
    // ngMetaProvider.setDefaultTag('description', 'Get customized itineraries & maps made by local experts in 110+ countries. You can even speak or text with them. Trip planning made authentic & hassle free!');
    ngMetaProvider.setDefaultTag('description', 'Small size and custom tours and activities, tailor-made itineraries and 1-on-1 conversations with locals in 110+ countries.');

    ngMetaProvider.setDefaultTag('image', 'https://www.filepicker.io/api/file/xMEplL43QKeyEVXincja');
    ngMetaProvider.setDefaultTag('site_name', 'Your Local Cousin');
    ngMetaProvider.setDefaultTag('app_id', '1628362000774270');
    ngMetaProvider.setDefaultTag('type', 'website');

    // ngMetaProvider.setDefaultTag('desciption','Get customized itineraries & maps made by local experts in 110+ countries. You can even speak or text with them. Trip planning made authentic & hassle free!')
})

.run(['$rootScope', '$location', 'Auth', 'SECURED_ROUTES', 'loginRedirectPath', 'Permission', 'Ref', '$firebaseObject', 'UsersRef', '$FB', 'Firebase',
        '$window', 'ngMeta', '$http',
        function($rootScope, $location, Auth, SECURED_ROUTES, loginRedirectPath, Permission, Ref, $firebaseObject, UsersRef, $FB, Firebase, $window, ngMeta, $http) {
            Auth.$onAuth(check);

            ngMeta.init();
            //Firebase.enableLogging(true);

            $FB.init('1628362000774270');

            $window.fbAsyncInit = function() {
                FB.init({
                    appId: '1628362000774270',
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.4'
                });
            };

            $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
                if (err === 'AUTH_REQUIRED') {
                    $location.path(loginRedirectPath);
                }
            });

            function check(user) {
                if (!user && authRequired($location.path())) {
                    $location.path(loginRedirectPath);
                }
            }

            function authRequired(path) {
                return SECURED_ROUTES.hasOwnProperty(path);
            }
        }
    ])
    .controller('AppCtrl', function AppCtrl($firebaseAuth, $http, $scope, $location, $rootScope) {

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | YLC';
            }
        });
    }).config(['usSpinnerConfigProvider', '$locationProvider', function(usSpinnerConfigProvider, $locationProvider) {
        usSpinnerConfigProvider.setTheme('bigBlue', { color: 'blue', radius: 20 });
        usSpinnerConfigProvider.setTheme('smallRed', { color: 'red', radius: 6 });
        $locationProvider.html5Mode(false);
    }]);
