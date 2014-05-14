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
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/features', {
        templateUrl: '/views/templatessingle.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/features/add', {
        templateUrl: '/views/addfeatures.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/features/:featureId', {
        templateUrl: '/views/editfeature.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId', {
        redirectTo: '/applications/:applicationId/templates/:templateId/features'
      })
      .when('/applications/:applicationId/templates/:templateId/statistics', {
        templateUrl: '/views/statistics.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/statistics/add', {
        templateUrl: '/views/addstatistics.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/statistics/:statisticId', {
        templateUrl: '/views/editstatistics.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/fields', {
        templateUrl: '/views/fields.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/settings', {
        templateUrl: '/views/settings.html',
        controller: 'ApplicationSingleCtrl'
      })
      .when('/applications/:applicationId/templates/:templateId/developers', {
        templateUrl: '/views/developers.html',
        controller: 'ApplicationSingleCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // If you remove this, you break the whole application
    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);

'use strict';

angular.module('commonsCloudAdminApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'ipCookie', '$location', '$window', function($rootScope, $scope, ipCookie, $location, $window) {

    var session_cookie = ipCookie('session');

    if (!session_cookie) {
      $window.location.href = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=PGvNp0niToyRspXaaqx3PiQBMn66QXyAq5yrNHpz&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2Fauthorize&scope=user applications';
    } else {
      $location.hash('');
      $location.path('/applications');
    }

  }]);

'use strict';

angular.module('commonsCloudAdminApp').controller('AuthorizeCtrl', ['$scope', '$rootScope', '$location', 'ipCookie', function($scope, $rootScope, $location, ipCookie) {

    $scope.getAccessToken = function() {

      var locationHash = $location.hash();
      var accessToken = locationHash.substring(0, locationHash.indexOf('&'));
      var cleanToken = accessToken.replace('access_token=', '');

      var cookieOptions = {
        path: '/',
        expires: 2
      };

      $rootScope.user.is_authenticated = true;
      return ipCookie('session', cleanToken, cookieOptions);
    };

    $scope.getAccessToken();

    $location.hash('');
    $location.path('/applications');
  }]);

'use strict';

angular.module('commonsCloudAdminApp')
  .factory('AuthorizationInterceptor', ['$rootScope', '$q', 'ipCookie', '$location', function ($rootScope, $q, ipCookie, $location) {

    //
    // Before we do anything else we should check to make sure
    // the users is authenticated with the CommonsCloud, otherwise
    // the this Client Application will not work properly. We must
    // have already authenticated the user (Resource Owner) with
    // the API through OAuth 2.0
    //
    // We set the default value to `false` and then check if the
    // session cookie for our domain exists.
    //
    $rootScope.user = {
      'is_authenticated': false
    };


    return {
      request: function(config) {
        var sessionCookie = ipCookie('session');

        if (config.url !== '/views/authorize.html' && (sessionCookie === 'undefined' || sessionCookie === undefined)) {
          $location.hash('');
          $location.path('/');
          return config || $q.when(config);
        }

        config.headers = config.headers || {};
        if (sessionCookie) {
          config.headers.Authorization = 'Bearer ' + sessionCookie;
        }
        config.headers['Content-Type'] = 'application/json';
        console.debug('AuthorizationInterceptor::Request', config || $q.when(config));
        return config || $q.when(config);
      },
      response: function(response) {
        if (response.status === 401 || response.status === 403) {
          $location.hash('');
          $location.path('/');
          return response || $q.when(response);
        }
        console.debug('AuthorizationInterceptor::Response', response || $q.when(response));
        return response || $q.when(response);
      }
    };

  }]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthorizationInterceptor');
  });
'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', ['$rootScope', '$scope', '$route', 'Application', 'User', 'ipCookie', '$location', function ($rootScope, $scope, $route, Application, User, ipCookie, $location) {

    //
    // Instantiate an Application object so that we can perform all necessary
    // functionality against our Application resource
    //
    $scope.application = new Application();
    $scope.applications = Application.query();

    //
    // Hide the navigation/sidebar by default (Cloud icon in top/left)
    //
    $rootScope.navigation = false;
    $scope.alerts = [];

    //
    // Hide the New Application form by default
    //
    $scope.NewApplication = false;

    $scope.GetUser = function() {
      User.get().$promise.then(function(response) {
        $scope.user = response.response;
      }, function (error) {
        //
        // Once the template has been updated successfully we should give the
        // user some on-screen feedback and then remove it from the screen after
        // a few seconds as not to confuse them or force them to reload the page
        // to dismiss the message
        //
        var alert = {
          'type': 'error',
          'title': 'Oops!',
          'details': 'Looks like your user information is missing in action. Try reloading the page or logging in again.'
        };

        $scope.alerts.push(alert);
      });
    };

    //
    //
    //
    $scope.GetUser();

    //
    // Save a new Application to the API Database
    //
    $scope.save = function () {

      console.log($scope.application);

      //
      // Save the Application via a post to the API and then push it onto the
      // Applications array, so that it appears in the user interface
      //
      $scope.application.$save().then(function (response) {
        $scope.applications.push(response.response);

        var alert = {
          'type': 'success',
          'title': 'Sweet!',
          'details': 'Your new Application was created, go add some stuff to it.'
        };

        $scope.alerts.push(alert);

      }, function (error) {
        //
        // Once the template has been updated successfully we should give the
        // user some on-screen feedback and then remove it from the screen after
        // a few seconds as not to confuse them or force them to reload the page
        // to dismiss the message
        //
        var alert = {
          'type': 'error',
          'title': 'Oops!',
          'details': 'Looks like we couldn\'t create that Application, mind trying again?'
        };

        $scope.alerts.push(alert);
      });

      //
      // Empty the form fields and hide the form
      //
      $scope.application = new Application();
      $scope.NewApplication = false;
    };

  }]);

'use strict';

angular.module('commonsCloudAdminApp')
  .factory('CommonsCloudAPI', function ($http) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      getApplications: function () {
        
        return true;
      }
    };
  });

'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Application', function() {

    this.$get = ['$resource', '$location', function($resource, $location) {

      var base_resource_url = '//api.commonscloud.org/v2/applications/:id.json';

      var Application = $resource(base_resource_url, {}, {
        query: {
          method: 'GET',
          isArray: true,
          transformResponse: function(data, headersGetter) {

            var applications = angular.fromJson(data);

            return applications.response.applications;
          }
        },
        update: {
          method: 'PATCH'
        }
      });

      return Application;
    }];
  });

'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$route', '$rootScope', '$scope', '$routeParams', '$location', '$timeout', '$http', '$upload', 'Application', 'Template', 'Feature', 'Field', 'Statistic', 'User', 'leafletData', function ($route, $rootScope, $scope, $routeParams, $location, $timeout, $http, $upload, Application, Template, Feature, Field, Statistic, User, leafletData) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = {};
    $scope.templates = [];
    $scope.template = {};
    $scope.fields = [];
    $scope.field = {};
    $scope.features = [];
    $scope.statistics = [];
    $scope.statistic = {};

    var featureGroup = new L.FeatureGroup();

    $scope.defaults = {
      tileLayer: 'https://{s}.tiles.mapbox.com/v3/developedsimple.hl46o07c/{z}/{x}/{y}.png',
      scrollWheelZoom: false
    };
    $scope.controls = {
      draw: {
        options: {
          draw: {
            circle: false,
            rectangle: false,
            polyline: {
              shapeOptions: {
                stroke: true,
                color: '#ffffff',
                weight: 4,
                opacity: 0.5,
                fill: true,
                fillColor: null,
                fillOpacity: 0.2,
                clickable: true
              }
            },
            polygon: {
              shapeOptions: {
                stroke: true,
                color: '#ffffff',
                weight: 4,
                opacity: 0.5,
                fill: true,
                fillColor: '#ffffff',
                fillOpacity: 0.2,
                clickable: true
              }
            },
            handlers: {
              marker: {
                tooltip: {
                  start: 'Click map to place marker.'
                }
              },
              polygon: {
                tooltip: {
                  start: 'Click to start drawing shape.',
                  cont: 'Click to continue drawing shape.',
                  end: 'Click first point to close this shape.'
                }
              },
              polyline: {
                error: '<strong>Error:</strong> shape edges cannot cross!',
                tooltip: {
                  start: 'Click to start drawing line.',
                  cont: 'Click to continue drawing line.',
                  end: 'Click last point to finish line.'
                }
              },
              simpleshape: {
                tooltip: {
                  end: 'Release mouse to finish drawing.'
                }
              }
            }
          },
          edit: {
            selectedPathOptions: {
              color: '#ffffff',
              opacity: 0.6,
              dashArray: '10, 10',
              fill: true,
              fillColor: '#ffffff',
              fillOpacity: 0.1
            },
            'featureGroup': featureGroup,
            'remove': true,
            handlers: {
              edit: {
                tooltip: {
                  text: 'Drag handles, or marker to edit feature.',
                  subtext: 'Click cancel to undo changes.'
                }
              },
              remove: {
                tooltip: {
                  text: 'Click on a feature to remove'
                }
              }
            }
          }
        }
      }
    };

    //
    // Placeholders for non-existent content
    //
    $scope.newTemplate = new Template();
    $scope.newField = new Field();
    $scope.newStatistic = new Statistic();
    $scope.feature = new Feature();
    $scope.files = [];
    $scope.user = new User();
    // $scope.newTemplate = {
    //   'is_public': true,
    //   'is_crowdsourced': true,
    //   'is_moderated': true,
    //   'is_geospatial': true
    // };

    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];
    $scope.loading = true;
    $rootScope.navigation = false;
    $scope.EditApplication = false;
    $scope.AddTemplate = false;
    $scope.orderByField = null;
    $scope.reverseSort = false;
    $scope.FieldEdit = false;
    $scope.FieldAdd = false;
    $scope.ShowMap = true;
    $scope.ShowGeoJSONEditor = false;
    $scope.MapLoaded = false;

  //
  // CONTENT
  //

    //
    // Make sure all of our alerts go away after a few seconds
    //
    $timeout(function () {
      $rootScope.alerts = [];
    }, 4000);

    $scope.GetUser = function() {
      User.get().$promise.then(function(response) {
        $scope.user = response.response;
      });
    };

    $scope.GetTemplateList = function() {
      //
      // Get a list of templates associated with the current application
      //
      Template.query({
          applicationId: $routeParams.applicationId
        }).$promise.then(function(response) {
          $scope.templates = response;

          angular.forEach($scope.templates, function(template, index) {

            $scope.templates[index].features = [];

            //
            // Get a list of all features
            //
            Feature.query({
                storage: template.storage
              }).$promise.then(function(response) {
                $scope.templates[index].features = response;
              });

            //
            // Get a list of Features awaiting moderation
            //
            Feature.query({
                storage: template.storage,
                q: {
                  'filters': [
                    {
                      'name': 'status',
                      'op': 'eq',
                      'val': 'crowd'
                    }
                  ]
                }
              }).$promise.then(function(response) {
                $scope.templates[index].moderation = response;
                if ($scope.templates[index].moderation.properties.total_features > 0) {
                  $scope.templates[index].moderation = true;
                }
              });

          });

        });
    };

    $scope.GetTemplate = function(template_id) {
      Template.get({
          id: $routeParams.templateId
        }).$promise.then(function(response) {
          $scope.template = response.response;
          $scope.loading = false;

          if ($routeParams.page) {
            Feature.query({
              storage: $scope.template.storage,
              page: $routeParams.page,
              q: {
                'order_by': [
                  {
                    'field': 'created',
                    'direction': 'desc'
                  }
                ]
              }
            }).$promise.then(function(response) {
              $scope.featureproperties = response.properties;
              $scope.features = response.response.features;
            });
          } else {
            Feature.query({
              storage: $scope.template.storage,
              q: {
                'order_by': [
                  {
                    'field': 'created',
                    'direction': 'desc'
                  }
                ]
              }
            }).$promise.then(function(response) {
              $scope.featureproperties = response.properties;
              $scope.features = response.response.features;
            });
          }

          Field.query({
            templateId: $scope.template.id
          }).$promise.then(function(response) {
            $scope.fields = response;
            $scope.getEnumeratedValues($scope.fields);

            if ($routeParams.featureId) {
              Feature.get({
                storage: $scope.template.storage,
                featureId: $routeParams.featureId
              }).$promise.then(function(response) {
                $scope.feature = response;
                $scope.getEditableMap();
              });
            } else {
              $scope.getEditableMap();
            }
          });

          Statistic.query({
            templateId: $scope.template.id
          }).$promise.then(function(response) {
            $scope.statistics = response;
          });
        });
    };

    $scope.GetApplicationPage = function() {

      //
      // Get the User's information
      //
      $scope.GetUser();

      //
      // Get a list of Templates belonging to this Application
      //
      $scope.GetTemplateList();

      //
      // If we're viewing a single Template, get more information about it
      //
      if ($routeParams.templateId) {
        $scope.GetTemplate();
      }

      //
      // If we're viewing a single Statistic, get more information about it
      //
      if ($routeParams.statisticId) {
        $scope.GetStatistic();
      }

    };

  //
  // CONTENT MUTATIONS
  //

    $scope.GetApplication = function() {
      //
      // Get the single application that the user wants to view
      //
      Application.get({
          id: $routeParams.applicationId
        }).$promise.then(function(response) {

          $scope.application = response.response;
          $scope.loading = false;

          $scope.GetApplicationPage();
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind reloading the page? It looks like we couldn\'t get that Application for you.'
          });
        });
    };

    //
    // Save a new Application to the API Database
    //
    $scope.UpdateApplication = function () {

      if ($scope.application.id) {
        $scope.EditApplication = false;
        Application.update({
          id: $scope.application.id
        }, $scope.application).$promise.then(function(response) {
          $rootScope.alerts.push({
            'type': 'success',
            'title': 'Awesome!',
            'details': 'We saved your Application updates for you.'
          });
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind trying that again? It looks like we couldn\'t save those Application updates for you.'
          });
        });
      }

    };

    //
    // Delete an existing Application from the API Database
    //
    $scope.DeleteApplication = function (application) {

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var application_ = {
        id: application.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Application.delete({
        id: application_.id
      }, application_).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Deleted!',
          'details': 'Your Application was deleted successfully!'
        });

        $location.path('/applications');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Application for you.'
        });
      });

    };

    //
    // Create a new Template that does not yet exist in the API database
    //
    $scope.CreateTemplate = function() {
      $scope.newTemplate.$save({
        applicationId: $scope.application.id
      }).then(function(response) {
        $scope.AddTemplate = false;
        $scope.templates.push(response.response);
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'We built that Template for you, now add some Fields to it.'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t save that Template for you.'
        });
      });
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateTemplate = function() {
      Template.update({
        id: $scope.template.id
      }, $scope.template).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated',
          'details': 'Your template updates were saved successfully!'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Template for you.'
        });
      });

    };

    //
    // Delete an existing Template from the API Database
    //
    $scope.DeleteTemplate = function (template) {

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var template_ = {
        id: template.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Template.delete({
        id: template_.id
      }, template_).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated',
          'details': 'Your template was deleted!'
        });

        $location.path('/applications/' + $scope.application.id + '/templates');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Template for you.'
        });
      });
    };

    //
    // Create a new Field that does not yet exist in the API database
    //
    $scope.CreateField = function () {


      console.log('$scope.newField', $scope.newField);

      $scope.newField.$save({
        templateId: $scope.template.id
      }).then(function(response) {
        $scope.fields.push(response.response);
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'Your new Field was added to the Template.'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Field for you.'
        });
      });
    };

    $scope.ActionEditField = function (field_) {
      $scope.editField = field_;
      $scope.FieldEdit = true;
      $scope.FieldAdd = false;
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateField = function () {
      Field.update({
        templateId: $scope.template.id,
        fieldId: $scope.editField.id
      }, $scope.editField).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated!',
          'details': 'Your Field updates were saved successfully!'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Field for you.'
        });
      });

      $scope.editField = {};
      $scope.FieldEdit = false;
      $scope.FieldAdd = true;
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteField = function (field) {

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Field.delete({
        templateId: $scope.template.id,
        fieldId: field.id
      }, field).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': '',
          'details': 'Your Field was deleted!'
        });
        $scope.fields.pop(field);
        $scope.editField = {};
        $scope.FieldEdit = false;

        if ($scope.fields.length) {
          $scope.FieldAdd = true;
        }
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Field for you.'
        });
      });

    };



    $scope.CreateFeature = function () {

      if ($scope.feature.geometry) {
        $scope.feature.geometry = $scope.convertFeatureCollectionToGeometryCollection($scope.feature.geometry);
      }

      angular.forEach($scope.fields, function(field, index) {
        if (field.data_type === 'relationship') {
          if (angular.isArray($scope.feature[field.relationship]) && $scope.feature[field.relationship].length >= 1) {
            
            var relationship_array_ = [];

            angular.forEach($scope.feature[field.relationship], function (value, index) {
              relationship_array_.push({
                'id': value
              });
            });

            $scope.feature[field.relationship] = relationship_array_;
          } else if (angular.isNumber($scope.feature[field.relationship])) {

            var value = $scope.feature[field.relationship];

            $scope.feature[field.relationship] = [{
              'id': value
            }];

          }
        }
      });

      $scope.feature.$save({
        storage: $scope.template.storage
      }).then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Yes!',
          'details': 'Your new Features created.'
        });

        $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/features');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Feature for you.'
        });
      });
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateFeature = function () {

      if ($scope.feature.geometry) {
        $scope.feature.geometry = $scope.convertFeatureCollectionToGeometryCollection($scope.feature.geometry);
      }

      angular.forEach($scope.fields, function(field, index) {
        if (field.data_type === 'relationship') {
          if (angular.isArray($scope.feature[field.relationship]) && $scope.feature[field.relationship].length >= 1) {
            
            var relationship_array_ = [];

            angular.forEach($scope.feature[field.relationship], function (value, index) {
              relationship_array_.push({
                'id': value
              });
            });

            $scope.feature[field.relationship] = relationship_array_;
          } else if (angular.isNumber($scope.feature[field.relationship])) {

            var value = $scope.feature[field.relationship];

            $scope.feature[field.relationship] = [{
              'id': value
            }];

          }
        }
      });

      Feature.update({
        storage: $scope.template.storage,
        featureId: $scope.feature.id
      }, $scope.feature).$promise.then(function(response) {

        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Awesome!',
          'details': 'Your Feature updates were saved successfully!'
        });

        $route.reload();
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Feature for you.'
        });
      });
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteFeature = function (feature) {

      console.log('$scope.template', $scope.template);

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var field_ = {
        storage: $scope.template.storage,
        featureId: feature.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Feature.delete(field_);

      $scope.features.pop(feature);

      $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/features');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    $scope.GetStatistic = function() {
      Statistic.get({
        templateId: $routeParams.templateId,
        statisticId: $routeParams.statisticId
      }).$promise.then(function (response) {
        $scope.statistic = response;
      });
    };

    $scope.CreateStatistic = function (statistic) {
      $scope.newStatistic.$save({
        templateId: $routeParams.templateId
      }).then(function (response) {
        $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/statistics');
      });
    };

    $scope.UpdateStatistic = function (statistic) {
      Statistic.update({
        templateId: $scope.template.id,
        statisticId: statistic.id
      }, statistic);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'We saved the updates you made to your statistic!'
      };

      $rootScope.alerts.push(alert);

      $timeout(function () {
        $rootScope.alerts = [];
      }, 3000);
    };

    $scope.DeleteStatistic = function (statistic) {

      var statistic_ = {
        templateId: $scope.template.id,
        statisticId: statistic.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Statistic.delete(statistic_);

      //
      // Update the Statistics list so that it no longer displays the deleted
      // items
      //
      $scope.statistics.pop(statistic);
      $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/statistics');
    };

    $scope.getEditableMap = function () {

      leafletData.getMap().then(function(map) {

        // var featureGroup = new L.FeatureGroup();
        map.addLayer(featureGroup);

        //
        // Check to see if existing map layers exist for this API Feature
        //
        if ($scope.feature.geometry) {
          $scope.feature.geometry = $scope.convertGeometryCollectionToFeatureCollection($scope.feature.geometry);
          $scope.geojsonToLayer($scope.feature.geometry, featureGroup);

          map.fitBounds(featureGroup.getBounds());
        }

        //
        // On Drawing Complete add it to our FeatureGroup
        //
        map.on('draw:created', function (e) {
          var newLayer = e.layer;
          featureGroup.addLayer(newLayer);

          $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
        });

        map.on('draw:edited', function (e) {
          var editedLayers = e.layers;
          editedLayers.eachLayer(function (layer) {
            featureGroup.addLayer(layer);
          });

          $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
        });

        map.on('draw:deleted', function (e) {
          var deletedLayers = e.layers;
          deletedLayers.eachLayer(function (layer) {
            featureGroup.removeLayer(layer);
          });

          $scope.feature.geometry = JSON.stringify(featureGroup.toGeoJSON());
        });

        //
        // Load and Prepare the Mapbox Basemap Tiles
        //
        // var MapboxBasemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/developedsimple.hl46o07c/{z}/{x}/{y}.png', {
        //   attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        // });

        // map.addLayer(MapboxBasemap);


        //
        // We need to invalidate the size of the Mapbox container so that it
        // displays properly. This is annoying and ugly ... timeouts are evil.
        // However, it serves as a temporary solution until we can figure out
        // something better.
        //
        $timeout(function () {
          map.invalidateSize();
        }, 500);
        
      });

      $scope.MapLoaded = true;
    };


    $scope.geojsonToLayer = function (geojson, layer) {
      layer.clearLayers();
      function add(l) {
        l.addTo(layer);
      }
      L.geoJson(geojson).eachLayer(add);
    };

    //
    // Build enumerated values for drop downs
    //
    $scope.getEnumeratedValues = function (field_list) {

      angular.forEach(field_list, function (field_, index) {
        if (field_.data_type === 'relationship') {
          Feature.query({
              storage: field_.relationship
            }).$promise.then(function (response) {
              $scope.fields[index].values = response.response.features;
              if ($routeParams.featureId) {
                var values_ = $scope.getDefaultEnumeratedValue(field_.relationship);
              }
            }, function(error) {
              $rootScope.alerts.push({
                'type': 'error',
                'title': 'Uh-oh!',
                'details': 'Something stranged happened, please reload the page.'
              });
            });
        }
      });

    };

    $scope.getDefaultEnumeratedValue = function (relationship) {
      $http({
        method: 'GET',
        url: '//api.commonscloud.org/v2/' + $scope.template.storage + '/' + $routeParams.featureId + '/' + relationship + '.json'
      }).success(function(data, status, headers, config) {

          var default_values = [];

          angular.forEach(data.response.features, function (feature, index) {
            default_values.push(feature.id);
          });

          $scope.feature[relationship] = default_values;

          return default_values;
        }).
        error(function(data, status, headers, config) {
          console.log('data', data, status);
        });
    };


    //
    // Update how Features are sorted based on Field/Header clicked and
    // react to a second click by inverting the order
    //
    $scope.ChangeOrder = function (value) {
      $scope.orderByField = value;
      $scope.reverseSort =! $scope.reverseSort;
    };

    //
    // Convert a FeatureCollection to a GeometryCollection so that it can be
    // saved to a Geometry field within the CommonsCloud API
    //
    $scope.convertFeatureCollectionToGeometryCollection = function (featureCollection) {

      var ExistingCollection = angular.fromJson(featureCollection);

      var NewFeatureCollection = {
        'type': 'GeometryCollection',
        'geometries': []
      };

      angular.forEach(ExistingCollection.features, function (feature, index) {
        NewFeatureCollection.geometries.push(feature.geometry);
      });

      return NewFeatureCollection;
    };

    //
    // Convert a GeometryCollection to a FeatureCollection so that it can be
    // saved to a Geometry field within the CommonsCloud Admin UI
    //
    $scope.convertGeometryCollectionToFeatureCollection = function (geometryCollection) {

      var ExistingCollection = angular.fromJson(geometryCollection);

      var NewFeatureCollection = {
        'type': 'FeatureCollection',
        'features': []
      };

      angular.forEach(ExistingCollection.geometries, function (feature, index) {
        var geometry_ = {
          'type': 'Feature',
          'geometry': feature
        };

        NewFeatureCollection.features.push(geometry_);
      });

      return NewFeatureCollection;
    };

    $scope.file_list = [];

    $scope.onFileRemove = function(file, index) {
      $scope.files.splice(index, 1);
    };

    $scope.onFileSelect = function(files) {

      angular.forEach(files, function(file, index) {
        // Check to see if we can load previews
        if (window.FileReader && file.type.indexOf('image') > -1) {

          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function (event) {
            file.preview = event.target.result;
            $scope.files.push(file);
            $scope.$apply();
          };
        } else {
          $scope.files.push(file);
          $scope.$apply();
        };
      });

      // $scope.dataUrls = [];
      // $scope.file_list = [];
      //$files: an array of files selected, each file has name, size, and type.
      // for (var i = 0; i < $files.length; i++) {
      //   var $file = $files[i];
      //   $scope.file_list.push($file);
      //   if (window.FileReader && $file.type.indexOf('image') > -1) {
      //     var fileReader = new FileReader();
      //     fileReader.readAsDataURL($files[i]);
      //     var loadFile = function(fileReader, index) {
      //       fileReader.onload = function(e) {
      //         $timeout(function() {
      //           $scope.dataUrls[index] = e.target.result;
      //         });
      //       }
      //     }(fileReader, i);
      //   }
      //   // $scope.progress[i] = -1;
      //   // if ($scope.uploadRightAway) {
      //   //   $scope.start(i);
      //   // }

      //   // $scope.upload = $upload.upload({
      //   //   url: 'server/upload/url', //upload.php script, node.js route, or servlet url
      //   //   // method: 'POST' or 'PUT',
      //   //   // headers: {'header-key': 'header-value'},
      //   //   // withCredentials: true,
      //   //   data: {myObj: $scope.myModelObj},
      //   //   file: file, // or list of files: $files for html5 only
      //   //   /* set the file formData name ('Content-Desposition'). Default is 'file' */
      //   //   //fileFormDataName: myFile, //or a list of names for multiple files (html5).
      //   //   /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
      //   //   //formDataAppender: function(formData, key, val){}
      //   // }).progress(function(evt) {
      //   //   console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      //   // }).success(function(data, status, headers, config) {
      //   //   // file is uploaded successfully
      //   //   console.log(data);
      //   // });
      //   //.error(...)
      //   //.then(success, error, progress); 
      //   //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
      // }
    };


      //
    // Now that we've got the everything prepared, let's go ahead and start
    // the controller by instantiating the GetApplication method
    //
    $scope.GetApplication();
  }]);

'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Template', function () {

    this.$get = ['$resource', function ($resource) {

      var Template = $resource('//api.commonscloud.org/v2/templates/:id.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/applications/:applicationId/templates.json',
          transformResponse: function (data, headersGetter) {

            var templates = angular.fromJson(data);

            return templates.response.templates;
          }
        },
        save: {
          method: 'POST',
          url: '//api.commonscloud.org/v2/applications/:applicationId/templates.json'
        },
        update: {
          method: 'PATCH'
        }
      });

      return Template;
    }];

  });

'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Feature', function () {

    this.$get = ['$resource', function ($resource) {

      var Feature = $resource('//api.commonscloud.org/v2/:storage.json', {

      }, {
        query: {
          method: 'GET',
          isArray: false,
          transformResponse: function (data, headersGetter) {
            return angular.fromJson(data);
          }
        },
        save: {
          method: 'POST',
          transformRequest: function (data, headersGetter) {
            var feature = angular.fromJson(data);

            //
            // We have to make sure that our previously Stringified GeoJSON
            // is converted back to an object prior to submission
            //            
            feature.geometry = angular.fromJson(feature.geometry);

            //
            // Make sure all of our feature data is converted back toJson
            // prior before submitting it to the API.
            //
            data = angular.toJson(feature);

            return data;
          }
        },
        get: {
          method: 'GET',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json',
          transformResponse: function (data, headersGetter) {

            var feature = angular.fromJson(data);

            return feature.response;
          }

        },
        update: {
          method: 'PATCH',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json'
        },
        delete: {
          method: 'DELETE',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json'
        }
      });

      return Feature;
    }];

  });

'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Field', function () {

    this.$get = ['$resource', function ($resource) {

      var Field = $resource('//api.commonscloud.org/v2/templates/:templateId/fields/:fieldId.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/templates/:templateId/fields.json',
          transformResponse: function (data, headersGetter) {

            var fields = angular.fromJson(data);

            return fields.response.fields;
          }
        },
        save: {
          method: 'POST',
          url: '//api.commonscloud.org/v2/templates/:templateId/fields.json'
        },
        update: {
          method: 'PATCH'
        }
      });

      return Field;
    }];

  });

'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Statistic', function () {

    this.$get = ['$resource', function ($resource) {

      var Statistic = $resource('//api.commonscloud.org/v2/templates/:templateId/statistics/:statisticId.json', {

      }, {
        get: {
          method: 'GET',
          transformResponse: function (data, headersGetter) {

            var statistic = angular.fromJson(data);

            return statistic.response;
          }

        },
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/templates/:templateId/statistics.json',
          transformResponse: function (data, headersGetter) {

            var statistics = angular.fromJson(data);

            return statistics.response.statistics;
          }
        },
        save: {
          method: 'POST',
          url: '//api.commonscloud.org/v2/templates/:templateId/statistics.json'
        },
        update: {
          method: 'PATCH'
        }
      });

      return Statistic;
    }];

  });

'use strict';

angular.module('commonsCloudAdminApp')
  .provider('User', function() {

    this.$get = ['$resource', function($resource) {

      var User = $resource('//api.commonscloud.org/v2/user/me.json');

      return User;
    }];

  });
