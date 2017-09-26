
angular.module('com.ylc.auth')
  .config(function($stateProvider) {
    $stateProvider
      .state('signin', {
        url: '/signin',
        views : {
          main : {
            template: '<login></login>',
            controller: 'LoginCtrl as loginCtrl',
            resolve : {
              requireNoAuth : function($state,Auth){
                return Auth.$requireAuth().then(function(auth){
                  //$state.go('profile');
                },function(error){
                  return;
                })
              }
            }
          }
        },
        data:{ pageTitle: 'Login' }
      })
      .state('signup', {
        url: '/signup',
        views : {
          main : {
            template: '<register></register>',
            controller: 'RegisterCtrl as registerCtrl',
            resolve : {
              requireNoAuth : function($state,Auth){
                return Auth.$requireAuth().then(function(auth){
                  //$state.go('profile');
                },function(error){
                  return;
                })
              }
            }
          }
        },
        data:{ pageTitle: 'Register' },
        meta: {
          'title': 'Become a Local Cousin',
          'description': 'Create your profile as a local and start earning by giving personalized trip advice to travellers traveling to your cities of expertise.',
          'url' : 'https://www.yourlocalcousin.com/signup',
          'type' : 'website'
        }
      }).state('signup-traveler', {
          url: '/signup-traveler',
          views : {
            main : {
              template: '<register-traveler></register-traveler>',
              controller: 'RegisterTravelerCtrl as registerTravelerCtrl',
              resolve : {
                requireNoAuth : function($state,Auth){
                  return Auth.$requireAuth().then(function(auth){
                  },function(error){
                    return;
                  })
                }
              }
            }
          },
          data:{ pageTitle: 'Register Traveler' }
        });
  });
