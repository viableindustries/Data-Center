'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationCtrl', ['$route', '$rootScope', '$scope', '$routeParams', '$location', '$timeout', '$http', '$upload', 'Application', 'Template', 'Feature', 'User', function ($route, $rootScope, $scope, $routeParams, $location, $timeout, $http, $upload, Application, Template, Feature, User) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.application = {};
    $scope.templates = [];
    $scope.template = {};
    $scope.features = [];
    $scope.user = new User();

    //
    // Placeholders for new content
    //
    $scope.newTemplate = new Template();

    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];
    $scope.loading = true;
    $rootScope.navigation = false;
    $scope.EditApplication = false;
    $scope.AddTemplate = false;
    $scope.orderByField = 'id';
    $scope.reverseSort = false;


    //
    // Default query parameters
    //
    $scope.query_params = {
      'order_by': [
        {
          'field': 'created',
          'direction': 'desc'
        }
      ]
    };


  //
  // CONTENT
  //
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
              q: $scope.query_params
            }).$promise.then(function(response) {
              $scope.featureproperties = response.properties;
              $scope.features = response.response.features;
            });
          } else {
            Feature.query({
              storage: $scope.template.storage,
              q: $scope.query_params
            }).$promise.then(function(response) {
              $scope.featureproperties = response.properties;
              $scope.features = response.response.features;
            });
          }

      });
    };


  //
  // CONTENT MUTATIONS
  //

    //
    // Get the application the user has selected and begin loading the rest of
    // the application page
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

          //
          // Get the User's information
          //
          $scope.GetUser();

          //
          // Get a list of Templates belonging to this Application
          //
          $scope.GetTemplateList();

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
    // Now that we've got the everything prepared, let's go ahead and start
    // the controller by instantiating the GetApplication method
    //
    $scope.GetApplication();
  }]);
