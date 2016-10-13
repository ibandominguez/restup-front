'use strict';

angular.module('restup-front.controllers', [])

.controller('AppCtrl', ['$scope', 'resource', function($scope, resource) {
  $scope.resources = null;

  resource.query('/resources')
    .success(function(resources) {
      $scope.resources = resources;
    })
    .error(function(error) {
      alert('Error');
    });
}]);
