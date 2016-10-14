'use strict';

angular.module('restup.filters', [])

.filter('toDate', [function() {
  return function(input) {
    return new Date(input);
  }
}])

.filter('capitalize', [function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
}]);
