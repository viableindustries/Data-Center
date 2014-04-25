'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'Application', 'Template', 'Feature', 'Field', function ($rootScope, $scope, $routeParams, $location, $timeout, Application, Template, Feature, Field) {

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

    //
    // Placeholders for non-existent content
    //
    $scope.newTemplate = {
      'is_public': true,
      'is_crowdsourced': true,
      'is_moderated': true,
      'is_geospatial': true
    };

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
            $scope.features = response;
          });

          Field.query({
            templateId: $scope.template.id
          }).$promise.then(function (response) {
            $scope.fields = response;
          });
        });
    }

  //
  // CONTENT MUTATIONS
  //

    //
    // Save a new Application to the API Database
    //
    $scope.save = function () {

      if ($scope.application.id) {
        console.log('Updated an existing post');
        $scope.EditApplication = false;
        Application.update({
          id: $scope.application.id
        }, $scope.application);
      }

    };

    //
    // Create a new Template that does not yet exist in the API database
    //
    $scope.createTemplate = function () {
      $scope.newTemplate.$save();
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.updateTemplate = function () {
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
    // Delete an existing Application from the API Database
    //
    $scope.delete = function (application) {

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
    // Update how Features are sorted based on Field/Header clicked and
    // react to a second click by inverting the order
    //
    $scope.ChangeOrder = function (value) {
      $scope.orderByField = value;
      $scope.reverseSort =! $scope.reverseSort;
    };

  }]);
