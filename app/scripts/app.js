'use strict';

angular
  .module('commonsCloudAdminApp', [
    'ipCookie',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.gravatar',
    'leaflet-directive',
    'angularFileUpload',
    'geolocation',
    'angular-loading-bar',
    'monospaced.elastic'
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
      .when('/logout', {
        templateUrl: '/views/logout.html',
        controller: 'LogoutCtrl'
      })
      .when('/applications', {
        templateUrl: '/views/applications.html',
        controller: 'ApplicationsCtrl',
        resolve: {
          applications: function(Application) {
            return Application.query();
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/new', {
        templateUrl: '/views/application-create.html',
        controller: 'ApplicationCreateCtrl',
        resolve: {
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId', {
        templateUrl: '/views/application.html',
        controller: 'ApplicationCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          templates: function(Template, $route) {
            return Template.GetTemplateList($route.current.params.applicationId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/edit', {
        templateUrl: '/views/application-edit.html',
        controller: 'ApplicationEditCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections', {
        redirectTo: '/applications/:applicationId'
      })
      .when('/applications/:applicationId/collaborators', {
        templateUrl: '/views/collaborators.html',
        controller: 'CollaboratorsCtrl'
      })
      .when('/applications/:applicationId/collections/new', {
        templateUrl: '/views/template-create.html',
        controller: 'TemplateCreateCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/features', {
        templateUrl: '/views/features.html',
        controller: 'FeaturesCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/features/new', {
        templateUrl: '/views/feature-create.html',
        controller: 'FeatureCreateCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/features/:featureId', {
        templateUrl: '/views/feature-edit.html',
        controller: 'FeatureEditCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId', {
        redirectTo: '/applications/:applicationId/collections/:templateId/features'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics', {
        templateUrl: '/views/statistics.html',
        controller: 'StatisticsCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics/new', {
        templateUrl: '/views/statistic-create.html',
        controller: 'StatisticCreateCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics/:statisticId', {
        templateUrl: '/views/statistic-edit.html',
        controller: 'StatisticEditCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/fields', {
        templateUrl: '/views/fields.html',
        controller: 'FieldsCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/fields/new', {
        templateUrl: '/views/field-create.html',
        controller: 'FieldCreateCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/fields/:fieldId/edit', {
        templateUrl: '/views/field-edit.html',
        controller: 'FieldEditCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/settings', {
        templateUrl: '/views/template-edit.html',
        controller: 'TemplateEditCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/developers', {
        templateUrl: '/views/template-dev.html',
        controller: 'TemplateDevCtrl'
      })
      .when('/applications/:applicationId/collections/:templateId/import', {
        templateUrl: '/views/template-import.html',
        controller: 'TemplateImportCtrl'
      // })
      // .otherwise({
      //   templateUrl: '/views/errors/404.html'
      });

    // If you remove this, you break the whole application
    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);
