
angular.module('com.ylc.core')
  .directive('adminBox', function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element) {
        element.text('this is the adminBox directive');
      }
    };
  });
