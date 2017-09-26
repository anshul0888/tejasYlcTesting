
/**
 * @ngdoc directive
 * @name com.module.core.directive:navbar
 * @description
 * # navbar
 */
angular.module('com.ylc.core')
  .directive('navbar', function() {
    return {
      templateUrl: 'core/views/elements/navbar.tpl.html',
      restrict: 'E'
    };
  });
