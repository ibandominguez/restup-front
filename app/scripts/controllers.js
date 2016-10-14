'use strict';

angular.module('restup-front.controllers', [])

.controller('AppCtrl', ['$scope', 'resource', '$state', 'localStorageService', '$ionicPopup', function($scope, resource, $state, localStorageService, $ionicPopup) {
  resource.query('/resources')
    .success(function(resources) {
      $scope.resources = (Array.isArray(resources)) ? resources : null;
    })
    .error(function(err) {
      $ionicPopup.alert({ title: 'Error', template: 'Error connecting with the rest api', okType: 'button-dark' });
      $state.go('app.settings');
    });

  $scope.getResourceFields = function(title) {
    var fields = null;

    ($scope.resources && $scope.resources.length) && $scope.resources.map(function(item) {
      if (item.title == title) {
        fields = item.fields;
      }
    });

    return fields;
  };
}])

.controller('ResourceCtrl', ['$scope', 'resource', '$stateParams', '$ionicModal', '$ionicPopup', function($scope, resource, $stateParams, $ionicModal, $ionicPopup) {
  $scope.results = null;
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
        $ionicPopup.alert({ title: 'Error', template: err && err.error, okType: 'button-dark' });
      });
  };

  $scope.remove = function(item) {
    resource.remove($scope.selectedResource, item)
      .success(function(res) {
        $scope.modal.hide();
        $scope.results.splice($scope.results.indexOf(item), 1);
      })
      .error(function(err) {
        $ionicPopup.alert({ title: 'Error', template: 'Error connecting with the rest api', okType: 'button-dark' });
      });
  };

  resource.query($scope.selectedResource)
    .success(function(results) {
      $scope.results = results;
      $scope.fields = $scope.getResourceFields($stateParams.resource);
      $scope.showingField = $scope.fields[0].title;
    })
    .error(function(error) {
      $ionicPopup.alert({ title: 'Error', template: 'Error connecting with the rest api', okType: 'button-dark' });
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
