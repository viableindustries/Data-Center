'use strict';

angular
  .module('commonsCloudAdminApp', [
    'ivpusic.cookie',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.gravatar',
    'leaflet-directive',
    'angularFileUpload'
  ])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    // Setup routes for our application
    $routeProvider
      .when('/', {
        templateUrl: '/views/index.html',
        controller: 'IndexCtrl'
      })
      .when('/authorize', {
        templateUrl: '/views/authorize.html',
        controller: 'AuthorizeCtrl'
      })
      .when('/applications', {
        templateUrl: '/views/applications.html',
        controller: 'ApplicationsCtrl'
      })
      .when('/applications/new', {
        templateUrl: '/views/application-create.html',
        controller: 'ApplicationCreateCtrl'
      })
      .when('/applications/:applicationId', {
        templateUrl: '/views/application.html',
        controller: 'ApplicationCtrl'
      })
      .when('/applications/:applicationId/edit', {
        templateUrl: '/views/application-edit.html',
        controller: 'ApplicationEditCtrl'
      })
      .when('/applications/:applicationId/collections', {
        redirectTo: '/applications/:applicationId'
      })
      .when('/applications/:applicationId/collaborators', {
        templateUrl: '/views/collaborators.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/new', {
        templateUrl: '/views/template-create.html',
        controller: 'TemplateCreateCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/features', {
        templateUrl: '/views/template.html',
        controller: 'TemplateCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/features/add', {
        templateUrl: '/views/addfeatures.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/features/:featureId', {
        templateUrl: '/views/editfeature.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId', {
        redirectTo: '/applications/:applicationId/collections/:templateId/features'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics', {
        templateUrl: '/views/statistics.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics/add', {
        templateUrl: '/views/addstatistics.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics/:statisticId', {
        templateUrl: '/views/editstatistics.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/fields', {
        templateUrl: '/views/fields.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/settings', {
        templateUrl: '/views/settings.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/developers', {
        templateUrl: '/views/developers.html',
        controller: 'ApplicationSingleCtrl'
      })
      .otherwise({
        templateUrl: '/views/errors/404.html'
      });

    // If you remove this, you break the whole application
    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);
