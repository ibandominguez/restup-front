'use strict';

angular.module('restup.services', [])

.factory('resource', ['localStorageService', '$http', function(localStorageService, $http) {
  return {
    query: function(resource, params) {
      return $http.get(localStorageService.get('apiUrl') + '/' + resource, params);
    },
    updateOrCreate: function(resource, params) {
      if (params && params.id) {
        return $http.put(localStorageService.get('apiUrl') + '/' + resource + '/' + params.id, params);
      }

      return $http.post(localStorageService.get('apiUrl') + '/' + resource, params);
    },
    remove: function(resource, params) {
      return $http.delete(localStorageService.get('apiUrl') + '/' + resource + '/' + params.id);
    }
  };
}])

.factory('authInterceptor', ['$q', '$injector', 'localStorageService', '$rootScope', function($q, $injector, localStorageService, $rootScope) {
  return {
    request: function(config) {
      var token = localStorageService.get('token');

      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }

      $rootScope.loading = ($rootScope.loading || 0) + 1;

      return config;
    },
    requestError: function(rejection) {
      return $q.reject(rejection);
    },
    response: function(response) {
      $rootScope.loading = ($rootScope.loading || 0) - 1;
      return response;
    },
    responseError: function(rejection) {
      $rootScope.loading = ($rootScope.loading || 0) - 1;

      if (rejection.status) {
        $injector.get('$state').go('app.authentication');
      }

      return $q.reject(rejection);
    }
  };
}]);
