'use strict';
var app = angular.module('com.ylc.profile.edit');

app.config(function($stateProvider) {
    $stateProvider.state('edit', {
            url: '/edit',
            abstract : true,
            resolve: {
                authED: function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('edit.about');
                        State.setUserNextStateParams(null);
                        $state.go('signin');
                    });
                },
                userIsALocal : function (Profile,Auth) {
                    return  Auth.$requireAuth().then(function(auth){
                        return Profile.isALocal(auth.uid);
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
                    templateUrl: 'profile/edit/views/edit.tpl.html',
                    controller : 'EditCTRL'
                }
            },
            data:{ pageTitle: 'Edit' }
        }).state('edit.about', {
            url: '/about',
            resolve: {
                authED: function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('edit.about');
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
                edit : {
                    templateUrl: 'profile/edit/views/form.edit.about.tpl.html',
                    controller: 'EditAboutCTRL'
                }
            },
            data:{ pageTitle: 'Edit About' }
        })
        .state('edit.services', {
            url: '/services',
            resolve: {
                authED: function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('edit.services');
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
                edit : {
                    templateUrl: 'profile/edit/views/form.edit.services.tpl.html',
                    controller: 'EditServicesCTRL'
                }
            },
            data:{ pageTitle: 'Edit Services' }
        })
        .state('edit.payments', {
            url: '/payments',
            resolve: {
                authED: function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('edit.payments');
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
                edit : {
                    templateUrl: 'profile/edit/views/form.edit.payments.tpl.html',
                    controller: 'EditPaymentsCTRL'
                }
            },
            data:{ pageTitle: 'Edit Payments' }
        })
        .state('edit.settings', {
            url: '/settings',
            resolve: {
                authED: function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('edit.settings');
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
                }],
                selectedDates : function (Auth,Profile) {
                    return Auth.$requireAuth().then(function (auth) {
                        return Profile.getLocalsSelectedDates(auth.uid).$loaded(function (data) {
                            var selectedDates = [];
                            angular.forEach(data, function (val, key) {
                                selectedDates.push(parseInt(val.$id));
                            });
                            return selectedDates;
                        })
                    })
                }
            },
            views : {
                edit : {
                    templateUrl: 'profile/edit/views/form.edit.settings.tpl.html',
                    controller: 'EditSettingsCTRL'
                }
            },
            data:{ pageTitle: 'Edit Settings' }
        })
});