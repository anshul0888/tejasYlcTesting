
angular.module('com.ylc.auth')
  .directive('register', function() {
    return {
      templateUrl: 'auth/views/register.tpl.html',
      restrict: 'E'
    };
  });
