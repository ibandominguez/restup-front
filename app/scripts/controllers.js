'use strict';

angular.module('restup-front.controllers', [])

.controller('AppCtrl', ['$scope', 'resource', '$state', 'localStorageService', '$timeout', function($scope, resource, $state, localStorageService, $timeout) {
  $scope.toastMessage = null;

  $scope.getResourceFields = function(title) {
    if (!$scope.resources) {
      return;
    }

    for (var i = 0; i < $scope.resources.length; i++) {
      if ($scope.resources[i].title == title) {
        return $scope.resources[i].fields;
      }
    }
  };

  $scope.toast = function(message, time) {
    $scope.toastMessage = message;

    $timeout(function() {
      $scope.toastMessage = null;
    }, time || 3000);
  };

  resource.query('/resources')
    .success(function(resources) {
      $scope.resources = resources;
    })
    .error(function(error) {
      $scope.toast('Error connecting with the rest api');
      $state.go('app.settings');
    });
}])

.controller('ResourceCtrl', ['$scope', 'resource', '$stateParams', function($scope, resource, $stateParams) {
  $scope.results = [];
  $scope.fields = null;
  $scope.selectedResource = $stateParams.resource;

  resource.query('/' + $scope.selectedResource)
    .success(function(results) {
      $scope.results = results;
      $scope.fields = $scope.getResourceFields($stateParams.resource);
      $scope.showingField = $scope.fields[0].title;
    })
    .error(function(error) {
      $scope.toast('Error connecting with the rest api');
    })
}])

.controller('SettingsCtrl', ['$scope', 'localStorageService', '$window', 'resource', function($scope, localStorageService, $window, resource) {
  $scope.form = {
    webUrl: localStorageService.get('webUrl'),
    apiUrl: localStorageService.get('apiUrl')
  };

  $scope.save = function() {
    localStorageService.set('webUrl', $scope.form.webUrl);
    localStorageService.set('apiUrl', $scope.form.apiUrl)
    $window.location.reload();
  };
}]);
