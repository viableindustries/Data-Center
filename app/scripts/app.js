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

    var templateUrl = '/views/main.html';

    // Setup routes for our application
    $routeProvider
      .when('/', {
        templateUrl: '/views/index.html',
        controller: 'IndexCtrl',
        resolve: {
          user: function(User) {
            return User.getUser();
          }
        }
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
        controller: 'ApplicationCreateCtrl',
        resolve: {
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId', {
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
        controller: 'CollaboratorsCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          collaborators: function(Application, $route) {
            return Application.GetUsers($route.current.params.applicationId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collaborators/new', {
        templateUrl: templateUrl,
        controller: 'CollaboratorsCreateCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collaborators/:userId', {
        redirectTo: '/applications/:applicationId/collaborators/:userId/edit'
      })
      .when('/applications/:applicationId/collaborators/:userId/edit', {
        templateUrl: templateUrl,
        controller: 'CollaboratorsEditCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          applicationPermissions: function(Application, $route) {
            return Application.GetUserPermissions($route.current.params.applicationId, $route.current.params.userId);
          },
          templatePermissions: function(Application, $route) {
            return {};
          },
          collaborator: function() {
            return {};
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/new', {
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
        controller: 'FeatureCreateCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetPreparedFields($route.current.params.templateId);
          },
          user: function(User) {
            return User.getUser();
          }
        }
      })
      .when('/applications/:applicationId/collections/:templateId/features/:featureId', {
        templateUrl: templateUrl,
        controller: 'FeatureEditCtrl',
        resolve: {
          application: function(Application, $route) {
            return Application.GetApplication($route.current.params.applicationId);
          },
          template: function(Template, $route) {
            return Template.GetTemplate($route.current.params.templateId);
          },
          fields: function(Field, $route) {
            return Field.GetPreparedFields($route.current.params.templateId);
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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
        templateUrl: templateUrl,
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

  angular.module('ui.gravatar').config([
    'gravatarServiceProvider', function(gravatarServiceProvider) {
      // Use https endpoint
      gravatarServiceProvider.secure = true;
    }
  ]);
