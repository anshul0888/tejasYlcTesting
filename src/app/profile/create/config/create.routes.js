'use strict';
var app = angular.module('com.ylc.profile.create');

app.config(function($stateProvider) {
    $stateProvider.state('create', {
        url: '/create',
        abstract : true,
        resolve: {
            authFB: function($state, Auth,State){
                return Auth.$requireAuth().catch(function(){
                    State.setUserNextState('create.about');
                    State.setUserNextStateParams(null);
                    $state.go('signin');
                });
            },
            profile: ['Profile','Auth',function(Profile, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return Profile.getProfile(auth.uid).$loaded();
                });
            }],
            gigs :  ['Gigs',function(Gigs){
                return Gigs.allGigs.$loaded();
            }],
            userData: ['User','Auth',function(User, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return User(auth.uid).$loaded();
                }).catch(function () {
                    return null;
                });
            }]
        },
        views : {
            main : {
                templateUrl: 'profile/create/views/create.tpl.html'
            }
        },
        data:{ pageTitle: 'Create' }
    }).state('create.success', {
        url: '/success',
        resolve: {
            authFB: function($state, Auth,State){
                return Auth.$requireAuth().catch(function(){
                    State.setUserNextState('create.success');
                    State.setUserNextStateParams(null);
                    $state.go('signin');
                });
            },
            profile: ['Profile','Auth',function(Profile, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return Profile.getProfile(auth.uid).$loaded();
                });
            }],
            userData: ['User','Auth',function(User, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return User(auth.uid).$loaded();
                }).catch(function () {
                    return null;
                });
            }]
        },
        views : {
            create : {
                templateUrl: 'profile/create/views/form.success.tpl.html',
                controller: 'CreateSuccessCtrl'
            }
        },
        data:{ pageTitle: 'Create Success' }
    }).state('create.about', {
        url: '/about',
        resolve: {
            authFB: function($state, Auth,State){
                return Auth.$requireAuth().catch(function(){
                    State.setUserNextState('create.about');
                    State.setUserNextStateParams(null);
                    $state.go('signin');
                });
            },
            profile: ['Profile','Auth',function(Profile, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return Profile.getProfile(auth.uid).$loaded();
                });
            }],
            userData: ['User','Auth',function(User, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return User(auth.uid).$loaded();
                }).catch(function () {
                    return null;
                });
            }]
        },
        views : {
            create : {
                templateUrl: 'profile/create/views/form.about.tpl.html',
                controller: 'CreateAboutCTRL'
            }
        },
        data:{ pageTitle: 'Create About' }
    }).state('create.services', {
        url: '/services',
        resolve: {
            authFB: function($state, Auth,State){
                return Auth.$requireAuth().catch(function(){
                    State.setUserNextState('create.services');
                    State.setUserNextStateParams(null);
                    $state.go('signin');
                });
            },
            profile: ['Profile','Auth',function(Profile, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return Profile.getProfile(auth.uid).$loaded();
                });
            }],
            gigs :  ['Gigs',function(Gigs){
                return Gigs.allGigs.$loaded();
            }],
            userData: ['User','Auth',function(User, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return User(auth.uid).$loaded();
                }).catch(function () {
                    return null;
                });
            }]
        },
        views : {
            create : {
                templateUrl: 'profile/create/views/form.services.tpl.html',
                controller: 'CreateServicesCTRL'
            }
        },
            data:{ pageTitle: 'Create Services' }
        }).state('create.payments', {
            url: '/payments',
            resolve: {
                authFB: function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('create.payments');
                        State.setUserNextStateParams(null);
                        $state.go('signin');
                    });
                },
                profile: ['Profile','Auth',function(Profile, Auth){
                    return Auth.$requireAuth().then(function(auth){
                        return Profile.getProfile(auth.uid).$loaded();
                    });
                }],
                userData: ['User','Auth',function(User, Auth){
                    return Auth.$requireAuth().then(function(auth){
                        return User(auth.uid).$loaded();
                    }).catch(function () {
                        return null;
                    });
                }]
            },
            views : {
                create : {
                    templateUrl: 'profile/create/views/form.payments.tpl.html',
                    controller: 'CreatePaymentsCTRL'
                }
            },
            data:{ pageTitle: 'Create Payments' }
        })
});