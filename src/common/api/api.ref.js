angular.module('api.ref', ['api.config'])
    .factory('YLC_API', ['$window', 'YLC_API', function($window, YLC_API) {
      return new $window.Firebase(YLC_API);
    }]);