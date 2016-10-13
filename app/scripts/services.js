'use strict';

angular.module('restup-front.services', [])

.factory('resource', ['localStorageService', '$http', function(localStorageService, $http) {
  return {
    query: function(resource, params) {
      return $http.get(localStorageService.get('apiUrl') + resource, params);
    }
  };
}]);
