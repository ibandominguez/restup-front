'use strict';

angular.module('restup-front.services', [])

.factory('resource', ['config', '$http', function(config, $http) {
  return {
    query: function(resource, params) {
      return $http.get(config.apiUrl + resource, params);
    }
  };
}]);
