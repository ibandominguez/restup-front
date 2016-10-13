'use strict';

angular.module('restup-front.controllers', [])

.controller('AppCtrl', ['$scope', 'resource', '$state', 'localStorageService', '$timeout', function($scope, resource, $state, localStorageService, $timeout) {
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
    alert(message);
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

.controller('ResourceCtrl', ['$scope', 'resource', '$stateParams', '$ionicModal', function($scope, resource, $stateParams, $ionicModal) {
  $scope.results = [];
  $scope.fields = null;
  $scope.selectedItem = null;
  $scope.selectedResource = $stateParams.resource;

  $ionicModal.fromTemplateUrl('views/modals/manage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.manage = function(item) {
    $scope.selectedItem = item;
    $scope.modal.show();
  };

  $scope.updateOrCreate = function(item) {
    resource.updateOrCreate($scope.selectedResource, item)
      .success(function(res) {
        $scope.modal.hide();
      })
      .error(function(err) {
        $scope.toast(err && err.error);
      });
  };

  $scope.remove = function(item) {
    resource.remove($scope.selectedResource, item)
      .success(function(res) {
        $scope.modal.hide();
        $scope.results.splice($scope.results.indexOf(item), 1);
      })
      .error(function(err) {
        $scope.toast('Error connecting with the rest api');
      });
  };

  resource.query($scope.selectedResource)
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
