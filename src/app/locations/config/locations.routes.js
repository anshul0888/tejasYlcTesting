
angular.module('com.ylc.locations')
  .config(["$stateProvider", function($stateProvider) {
    $stateProvider
        .state('locations', {
            url: '/locations',
            abstract : true,
            views : {
                main : {
                    templateUrl: 'locations/views/main.tpl.html'
                }
          },
          data:{ pageTitle: 'Locations' }
        })
        .state('locations.results', {
            url: '/:location?utm_source&utm_campaign&utm_medium',
            resolve: {
            },
            views : {
                location : {
                    templateUrl: 'locations/views/location.tpl.html',
                    controller : 'LocationsCtrl'
                }
            },
            data:{ pageTitle: 'Location' }
        })
    }]);

