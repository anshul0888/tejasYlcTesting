'use strict';
var app = angular.module('com.ylc.profile.view');

app.config(function($stateProvider) {
    $stateProvider.state('view', {
        abstract: true,
        url: '/view',
        views : {
            main : {
                templateUrl: 'profile/view/views/main.tpl.html'
            }
        },
        data:{ pageTitle: 'View' }
    }).state('view.profile', {
        url: '',
        resolve: {
            auth: function($state, Auth, State){
                return Auth.$requireAuth().catch(function(){
                    State.setUserNextState('view.profile');
                    State.setUserNextStateParams(null);
                    $state.go('signin');
                });
            },
            profile: ['Profile','Auth',function(Profile, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return Profile.getProfile(auth.uid).$loaded();
                });
            }],
            videos :  ['Profile','Auth',function(Profile, Auth){
                return Auth.$requireAuth().then(function(auth){
                    return Profile.getVideos(auth.uid).$loaded();
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
            view : {
                templateUrl: 'profile/view/views/view.tpl.html',
                controller: 'ViewCtrl'
            }
        },
        data:{ pageTitle: 'View Profile' }
    })
});