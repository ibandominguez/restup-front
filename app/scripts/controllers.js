'use strict';

angular.module('restup.controllers', [])

.controller('AppCtrl', ['$scope', 'resource', '$state', 'localStorageService', '$ionicPopup', '$ionicModal', function($scope, resource, $state, localStorageService, $ionicPopup, $ionicModal) {
  $scope.getResources = function(cb) {
    resource.query('/resources')
      .success(function(resources) {
        $scope.resources = (Array.isArray(resources)) ? resources : null;
        (typeof cb == 'function') && cb();
      })
      .error(function(err, status) {
        var error = status == 401 ? 'Authorization required' : (err && err.error) || 'Error connecting';

        $ionicPopup.alert({ title: 'Error', template: error, okType: 'button-dark' });
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
        var error = status == 401 ? 'Authorization required' : (err && err.error) || 'Error connecting';

        $scope.modal.hide();
        $ionicPopup.alert({ title: 'Error', template: err && error, okType: 'button-dark' });
      });
  };

  $scope.remove = function(item) {
    resource.remove($scope.selectedResource, item)
      .success(function(res) {
        $scope.modal.hide();
        $scope.results.splice($scope.results.indexOf(item), 1);
      })
      .error(function(err, status) {
        var error = status == 401 ? 'Authorization required' : (err && err.error) || 'Error connecting';

        $ionicPopup.alert({ title: 'Error', template: error, okType: 'button-dark' });
      });
  };

  resource.query($scope.selectedResource)
    .success(function(results) {
      $scope.results = results;
      $scope.fields = $scope.getResourceFields($stateParams.resource);
      $scope.showingField = $scope.fields[0].title;
    })
    .error(function(err, status) {
      var error = status == 401 ? 'Authorization required' : (err && err.error) || 'Error connecting';

      $ionicPopup.alert({ title: 'Error', template: error, okType: 'button-dark' });
    })
}])

.controller('SettingsCtrl', ['$scope', 'localStorageService', '$state', function($scope, localStorageService, $state) {
  $scope.form = {
    webUrl: localStorageService.get('webUrl'),
    apiUrl: localStorageService.get('apiUrl')
  };

  $scope.save = function() {
    localStorageService.set('webUrl', $scope.form.webUrl);
    localStorageService.set('apiUrl', $scope.form.apiUrl);

    $scope.getResources(function() {
      $state.go('app.dashboard');
    });
  };
}])

.controller('AuthenticationCtrl', ['$scope', 'resource', '$ionicPopup', 'localStorageService', function($scope, resource, $ionicPopup, localStorageService) {
  $scope.form = {};
  $scope.auth = localStorageService.get('token');

  $scope.login = function() {
    resource.updateOrCreate('/tokens', $scope.form)
      .success(function(res) {
        localStorageService.set('token', res.token);
        $scope.form = {};
      })
      .error(function(err, status) {
        var error = status == 401 ? 'Authorization required' : (err && err.error) || 'Error connecting';

        $ionicPopup.alert({ title: 'Error', template: err && error, okType: 'button-dark' });
      });
  };
}]);
