
/**
 * @ngdoc directive
 * @name com.module.core.directive:adminHeader
 * @description
 * @param {string} title Title
 * @param {string} subTitle Subtitle
 * # adminHeader
 */
angular.module('com.ylc.core')
  .directive('adminHeader', function() {
    return {
      templateUrl: 'core/views/elements/admin-header.tpl.html',
      transclude: true,
      scope: {
        title: '@',
        subTitle: '@'
      },
      restrict: 'A'
    };
  });
