
angular.module('com.ylc.core')
  .directive('smallBox', function() {
    return {
      restrict: 'E',
      templateUrl: 'core/views/elements/small-box.tpl.html',
      scope: {
        name: '@',
        color: '@',
        icon: '@',
        quantity: '@',
        href: '@'
      }
    };
  });
