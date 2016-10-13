'use strict';

angular.module('restup-front', ['ionic', 'ngCordova', 'restup-front.views', 'restup-front.controllers', 'restup-front.services', 'restup-front.filters'])

.constant('config', {
  apiUrl: 'http://localhost:8000',
  webUrl: 'http://localhost:9000'
})

.run(['$rootScope', '$ionicPlatform', 'config', function($rootScope, $ionicPlatform, config) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      $cordovaStatusbar.overlaysWebView(true);
      $cordovaStatusbar.style(1);
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/app/dashboard');

  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'views/layout.html',
      controller: 'AppCtrl'
    })
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        main: { templateUrl: 'views/dashboard.html' }
      }
    })
    .state('app.resource', {
      url: '/resources/:resource',
      views: {
        main: { templateUrl: 'views/resource.html', controller: 'ResourceCtrl' }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        main: { templateUrl: 'views/settings.html' }
      }
    });
}]);
