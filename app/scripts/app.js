'use strict';

angular
  .module('commonsCloudAdminApp', [
    'ivpusic.cookie',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider, $locationProvider) {

    // Setup routes for our application
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/authorize', {
        templateUrl: 'views/authorize.html',
        controller: 'AuthorizeCtrl'
      })
      .when('/applications', {
        templateUrl: 'views/applications.html',
        controller: 'ApplicationsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // If you remove this, you break the whole application
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

  }).run(function($http, ipCookie) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + ipCookie('session');
    $http.defaults.headers.common['Content-Type'] = 'application/json';
  });
