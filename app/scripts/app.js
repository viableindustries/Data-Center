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
      .when('/applications/:applicationId/collaborators', {
        templateUrl: '/views/collaborators.html',
        // controller: 'CollaboratorsCtrl'
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/features', {
        templateUrl: '/views/templatessingle.html',
        // controller: 'TemplatesSingleCtrl'
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId', {
        redirectTo: '/applications/:applicationId/templates/:templateId/features'
      })
      .when('/applications/:applicationId/templates/:templateId/statistics', {
        templateUrl: '/views/statistics.html',
        // controller: 'StatisticsCtrl'
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/fields', {
        templateUrl: '/views/fields.html',
        // controller: 'FieldsCtrl'
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/settings', {
        templateUrl: '/views/settings.html',
        // controller: 'SettingsCtrl'
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/developers', {
        templateUrl: '/views/developers.html',
        // controller: 'DevelopersCtrl'
        controller: 'ApplicationSingleCtrl'
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
