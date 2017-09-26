
angular.module('com.ylc.auth')
    .directive('register-traveler', function() {
        return {
            templateUrl: 'auth/views/register.traveler.tpl.html',
            restrict: 'E'
        };
    });