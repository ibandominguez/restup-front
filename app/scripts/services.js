'use strict';

angular.module('restup-front.services', [])

.factory('resource', ['localStorageService', '$http', function(localStorageService, $http) {
  return {
    query: function(resource, params) {
      return $http.get(localStorageService.get('apiUrl') + '/' + resource, params);
    },
    updateOrCreate: function(resource, params) {
      if (params.id) {
        return $http.put(localStorageService.get('apiUrl') + '/' + resource + '/' + params.id, params);
      }

      return $http.post(localStorageService.get('apiUrl') + '/' + resource, params);
    },
    remove: function(resource, params) {
      return $http.delete(localStorageService.get('apiUrl') + '/' + resource + '/' + params.id);
    }
  };
}]);
