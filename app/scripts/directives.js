'use strict';

angular.module('restup.directives', [])

.directive('fadeIn', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      element.addClass('fade');
      
      $timeout(function() {
        element.addClass('on');
      }, 300);
    }
  };
}]);
