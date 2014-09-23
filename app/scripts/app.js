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
        controller: 'CollaboratorsCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/new', {
        templateUrl: '/views/template-create.html',
        controller: 'TemplateCreateCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/features', {
        templateUrl: '/views/features.html',
        controller: 'FeaturesCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetFields($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          },
          features: function(Feature, $route) {
            return Feature.GetPaginatedFeatures($route.current.params.templateId, $route.current.params.page);
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/features/new', {
        templateUrl: '/views/feature-create.html',
        controller: 'FeatureCreateCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetFields($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/features/:featureId', {
        templateUrl: '/views/feature-edit.html',
        controller: 'FeatureEditCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetFields($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          },
          feature: function(Feature, $route) {
            return Feature.GetSingleFeatures($route.current.params.templateId, $route.current.params.featureId);
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId', {
        redirectTo: '/applications/:applicationId/collections/:templateId/features'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics', {
        templateUrl: '/views/statistics.html',
        controller: 'StatisticsCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          },
          statistics: function(Statistic, $route) {
            return Statistic.GetStatistics($route.current.params.templateId);
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/statistics/new', {
        templateUrl: '/views/statistic-create.html',
        controller: 'StatisticCreateCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetFields($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/statistics/:statisticId', {
        redirectTo: '/applications/:applicationId/collections/:templateId/statistics/:statisticId/edit'
      })
      .when('/applications/:applicationId/collections/:templateId/statistics/:statisticId/edit', {
        templateUrl: '/views/statistic-edit.html',
        controller: 'StatisticEditCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetFields($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          },
          statistic: function(Statistic, $route) {
            return Statistic.GetStatistic($route.current.params.templateId, $route.current.params.statisticId);
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/attributes', {
        templateUrl: '/views/fields.html',
        controller: 'FieldsCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetFields($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/attributes/new', {
        templateUrl: '/views/field-create.html',
        controller: 'FieldCreateCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          templates: function(Template, $route) {
            return Template.GetTemplateList($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/attributes/:fieldId/edit', {
        templateUrl: '/views/field-edit.html',
        controller: 'FieldEditCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          templates: function(Template, $route) {
            return Template.GetTemplateList($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          field: function(Field, $route) {
            return Field.GetField($route.current.params.templateId, $route.current.params.fieldId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/settings', {
        templateUrl: '/views/template-edit.html',
        controller: 'TemplateEditCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/developers', {
        templateUrl: '/views/template-dev.html',
        controller: 'TemplateDevCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/import', {
        templateUrl: '/views/template-import.html',
        controller: 'TemplateImportCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          activities: function(Template, $route) {
            return Template.GetActivities($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .otherwise({
        templateUrl: '/views/errors/404.html'
      });

    // If you remove this, you break the whole application
    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);
