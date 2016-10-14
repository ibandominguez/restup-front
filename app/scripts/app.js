'use strict';

angular.module('restup', ['ionic', 'ngCordova', 'LocalStorageModule', 'restup.views', 'restup.controllers', 'restup.services', 'restup.filters', 'restup.directives'])

.run(['$rootScope', '$ionicPlatform', 'localStorageService', '$ionicPopup', '$state', function($rootScope, $ionicPlatform, localStorageService, $ionicPopup, $state) {
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

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/app/dashboard');
  $httpProvider.interceptors.push('authInterceptor');

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
        main: { templateUrl: 'views/settings.html', controller: 'SettingsCtrl' }
      }
    });
}]);
