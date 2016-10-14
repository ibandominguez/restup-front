'use strict';

angular.module('restup.controllers', [])

.controller('AppCtrl', ['$scope', 'resource', '$state', 'localStorageService', '$ionicPopup', '$ionicModal', function($scope, resource, $state, localStorageService, $ionicPopup, $ionicModal) {
  $scope.loginForm = {};

  $scope.getResources = function(cb) {
    resource.query('/resources')
      .success(function(resources) {
        $scope.resources = (Array.isArray(resources)) ? resources : null;
        (typeof cb == 'function') && cb();
      })
      .error(function(err, status) {
        $ionicPopup.alert({ title: 'Error', template: 'Error connecting with the rest api', okType: 'button-dark' });
        $state.go('app.settings');
      });
  };

  $scope.getResourceFields = function(title) {
    var fields = null;

    ($scope.resources && $scope.resources.length) && $scope.resources.map(function(item) {
      if (item.title == title) {
        fields = item.fields;
      }
    });

    return fields;
  };

  $ionicModal.fromTemplateUrl('views/modals/login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  $scope.login = function() {
    resource.updateOrCreate('/tokens', $scope.loginForm)
      .success(function(res) {
        localStorageService.set('token', res.token);
        $scope.loginModal.hide();
        $scope.loginForm = {};
      })
      .error(function(err, status) {
        $ionicPopup.alert({ title: 'Error', template: err && err.error, okType: 'button-dark' });
      });
  };

  $scope.getResources();
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
        if (!item.id) {
          $scope.results.push(res);
        }

        $scope.modal.hide();
      })
      .error(function(err, status) {
        if (status == 401) {
          return $scope.loginModal.show();
        }

        $scope.modal.hide();
        $ionicPopup.alert({ title: 'Error', template: err && err.error, okType: 'button-dark' });
      });
  };

  $scope.remove = function(item) {
    resource.remove($scope.selectedResource, item)
      .success(function(res) {
        $scope.modal.hide();
        $scope.results.splice($scope.results.indexOf(item), 1);
      })
      .error(function(err, status) {
        if (status == 401) {
          return $scope.loginModal.show();
        }

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
      if (status == 401) {
        return $scope.loginModal.show();
      }

      $ionicPopup.alert({ title: 'Error', template: 'Error connecting with the rest api', okType: 'button-dark' });
    })
}])

.controller('SettingsCtrl', ['$scope', 'localStorageService', '$state', function($scope, localStorageService, $state) {
  $scope.form = {
    webUrl: localStorageService.get('webUrl'),
    apiUrl: localStorageService.get('apiUrl')
  };

  $scope.save = function() {
    localStorageService.set('webUrl', $scope.form.webUrl);
    localStorageService.set('apiUrl', $scope.form.apiUrl)

    $scope.getResources(function() {
      $state.go('app.dashboard');
    });
  };
}]);
