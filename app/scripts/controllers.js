'use strict';

angular.module('restup-front.controllers', [])

.controller('AppCtrl', ['$scope', 'resource', function($scope, resource) {
  $scope.resources = [];

  $scope.getResourceFields = function(title) {
    for (var i = 0; i < $scope.resources.length; i++) {
      if ($scope.resources[i].title == title) {
        return $scope.resources[i].fields;
      }
    }
  };

  resource.query('/resources')
    .success(function(resources) {
      $scope.resources = resources;
    })
    .error(function(error) {
      alert('Error');
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
      alert('Error')
    })
}]);
