
angular.module('com.ylc.auth')
  .directive('login', function() {
    return {
      templateUrl: 'auth/views/login.tpl.html',
      restrict: 'E'
    };
  });
