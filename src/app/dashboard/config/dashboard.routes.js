
angular.module('com.ylc.dashboard')
  .config(function($stateProvider) {
    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            abstract : true,
            views : {
                main : {
                    templateUrl: 'dashboard/views/main.tpl.html'
                }
          },
          data:{ pageTitle: 'Dashboard' }
        })
        .state('dashboard.view', {
            url: '',
            resolve: {
                auth : function($state, Auth, State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('dashboard.view');
                        State.setUserNextStateParams(null);
                        $state.go('signin');
                    });
                },
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
                view : {
                    templateUrl: 'dashboard/views/view.tpl.html',
                    controller : 'DashboardCtrl'
                }
            },
            data:{ pageTitle: 'Dashboard' }
        })
        .state('dashboard.traveler', {
            url: '/traveler',
            resolve: {
                auth : function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('dashboard.traveler');
                        State.setUserNextStateParams(null);
                        $state.go('signin');
                    });
                },
                userData: ['User','Auth',function(User, Auth){
                    return Auth.$requireAuth().then(function(auth){
                        return User(auth.uid).$loaded();
                    }).catch(function () {
                        return null;
                    });
                }]
            },
            views : {
                traveler : {
                    templateUrl: 'dashboard/views/traveler.tpl.html',
                    controller : 'TravelersDashboardCtrl'
                }
            },
            data:{ pageTitle: 'Traveler Dashboard' }
        })
        .state('dashboard.local', {
            url: '/local',
            resolve: {
                auth : function($state, Auth,State){
                    return Auth.$requireAuth().catch(function(){
                        State.setUserNextState('dashboard.local');
                        State.setUserNextStateParams(null);
                        $state.go('signin');
                    });
                },
                userData: ['User','Auth',function(User, Auth){
                    return Auth.$requireAuth().then(function(auth){
                        return User(auth.uid).$loaded();
                    }).catch(function () {
                        return null;
                    });
                }]
            },
            views : {
                local : {
                    templateUrl: 'dashboard/views/local.tpl.html',
                    controller : 'LocalsDashboardCtrl'
                }
            },
            data:{ pageTitle: 'Local Dashboard' }
        })
    });

