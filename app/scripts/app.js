'use strict';

angular
  .module('commonsCloudAdminApp', [
    'ivpusic.cookie',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.gravatar'
  ])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    // Setup routes for our application
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/authorize', {
        templateUrl: '/views/authorize.html',
        controller: 'AuthorizeCtrl'
      })
      .when('/applications', {
        templateUrl: '/views/applications.html',
        controller: 'ApplicationsCtrl'
      })
      .when('/applications/:applicationId', {
        templateUrl: '/views/applicationsingle.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates', {
        redirectTo: '/applications/:applicationId'
      })
      .when('/templates', {
        templateUrl: '/views/templates.html',
        controller: 'TemplatesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // If you remove this, you break the whole application
    $locationProvider.html5Mode(true).hashPrefix('!');

    // $httpProvider.defaults.withCredentials = true;
    // $httpProvider.defaults.useXDomain = true;
    // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  });
