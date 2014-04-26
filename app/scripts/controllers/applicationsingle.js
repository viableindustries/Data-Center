'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'Application', 'Template', 'Feature', 'Field', 'Statistic', function ($rootScope, $scope, $routeParams, $location, $timeout, Application, Template, Feature, Field, Statistic) {

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
    $scope.feature = {};
    $scope.statistics = [];
    $scope.statistic = {};

    //
    // Placeholders for non-existent content
    //
    $scope.newTemplate = new Template();
    $scope.newField = new Field();
    $scope.newStatistic = new Statistic();
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
    $scope.loading = true;
    $scope.alerts = [];
    $rootScope.navigation = false;
    $scope.EditApplication = false;
    $scope.AddTemplate = false;
    $scope.orderByField = null;
    $scope.reverseSort = false;
    $scope.FieldEdit = false;
    $scope.FieldAdd = false;


  //
  // CONTENT
  //

    //
    // Get the single application that the user wants to view
    //
    Application.get({
        id: $routeParams.applicationId
      }).$promise.then(function(response) {
        $scope.application = response.response;
        $scope.loading = false;
      });

    //
    // Get a list of templates associated with the current application
    //
    Template.query({
        applicationId: $routeParams.applicationId
      }).$promise.then(function(response) {
        $scope.templates = response;

        angular.forEach($scope.templates, function (template, index) {

          $scope.templates[index].features = []

          //
          // Get a list of all features
          //
          Feature.query({
              storage: template.storage
            }).$promise.then(function (response) {
              $scope.templates[index].features = response;
              console.log('$scope.templates[index].features', $scope.templates[index].features);
            });

          //
          // Get a list of Features awaiting moderation
          //
          Feature.query({
              storage: template.storage,
              q: {
                "filters": [
                  {
                    "name": "status",
                    "op": "eq",
                    "val": "crowd"
                  }
                ]
              }
            }).$promise.then(function (response) {
              $scope.templates[index].moderation = response;
              if ($scope.templates[index].moderation.properties.total_features > 0) {
                $scope.templates[index].moderation = true;
              }
            });

        });

      });

    //
    // When the URL contains a Template ID that means we need to load the
    // template and all of it's associated realtionships, such as Fields
    // and Features
    //
    if ($routeParams.templateId) {
      Template.get({
          id: $routeParams.templateId
        }).$promise.then(function(response) {
          $scope.template = response.response;
          $scope.loading = false;

          Feature.query({
            storage: $scope.template.storage
          }).$promise.then(function (response) {
            $scope.features = response.response.features;
          });

          Field.query({
            templateId: $scope.template.id
          }).$promise.then(function (response) {
            $scope.fields = response;

            if ($routeParams.featureId) {
              Feature.get({
                storage: $scope.template.storage,
                featureId: $routeParams.featureId
              }).$promise.then(function (response) {
                $scope.feature = response;
                console.log('$scope.feature', $scope.feature);
              });
            }
          });

          Statistic.query({
            templateId: $scope.template.id
          }).$promise.then(function (response) {
            $scope.statistics = response;
          });
        });
    }


  //
  // CONTENT MUTATIONS
  //

    //
    // Save a new Application to the API Database
    //
    $scope.UpdateApplication = function () {

      if ($scope.application.id) {
        console.log('Updated an existing post');
        $scope.EditApplication = false;
        Application.update({
          id: $scope.application.id
        }, $scope.application);
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
      Application.delete(application_);

      $location.path('/applications');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    //
    // Create a new Template that does not yet exist in the API database
    //
    $scope.CreateTemplate = function () {
      console.log($scope.newTemplate);
      $scope.newTemplate.$save({
        applicationId: $scope.application.id
      }).then(function (response) {
        console.log('response.response', response.response);
        $scope.templates.push(response.response);
      });
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateTemplate = function () {
      Template.update({
        id: $scope.template.id
      }, $scope.template);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'Your template updates were saved successfully!'
      };

      $scope.alerts.push(alert);

      $timeout(function () {
        $scope.alerts = [];
      }, 3000);

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
      Template.delete(template_);

      $location.path('/applications/' + $scope.application.id + '/templates');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    //
    // Create a new Field that does not yet exist in the API database
    //
    $scope.CreateField = function () {
      $scope.newField.$save({
        templateId: $scope.template.id
      }).then(function (response) {
        console.log('response.response', response.response);
        $scope.fields.push(response.response);
      });
    };

    $scope.ActionEditField = function (field_) {
      console.log('ActionEditField', field_);
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
      }, $scope.editField);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'Your field updates were saved successfully!'
      };

      $scope.alerts.push(alert);

      $timeout(function () {
        $scope.alerts = [];
      }, 3000);

      $scope.editField = {};
      $scope.FieldEdit = false;
      $scope.FieldAdd = true;
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteField = function (field) {

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var field_ = {
        templateId: $scope.template.id,
        fieldId: field.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Field.delete(field_);

      $scope.fields.pop(field);
      $scope.editField = {};
      $scope.FieldEdit = false;

      if ($scope.fields.length) {
        $scope.FieldAdd = true;
      }

      // $location.path('/applications/' + $scope.application.id + '/templates/' + $scope.template.id + '/fields');

      //
      // @todo
      //
      // We need to make sure that we aren't removing the Application from the
      // user interface, unless it's really been deleted from the database. I
      // don't believe the API is returning the appropriate response, and
      // therefore we have no way to catch it
      //
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateFeature = function () {
      Feature.update({
        storage: $scope.template.storage,
        featureId: $scope.feature.id
      }, $scope.feature);

      //
      // Once the template has been updated successfully we should give the
      // user some on-screen feedback and then remove it from the screen after
      // a few seconds as not to confuse them or force them to reload the page
      // to dismiss the message
      //
      var alert = {
        'type': 'success',
        'title': 'Updated',
        'details': 'Your feature updates were saved successfully!'
      };

      $scope.alerts.push(alert);

      $timeout(function () {
        $scope.alerts = [];
      }, 3000);

    };


    //
    // Update how Features are sorted based on Field/Header clicked and
    // react to a second click by inverting the order
    //
    $scope.ChangeOrder = function (value) {
      $scope.orderByField = value;
      $scope.reverseSort =! $scope.reverseSort;
    };

  }]);
