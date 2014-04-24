'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'Application', 'Template', 'Feature', function ($rootScope, $scope, $routeParams, $location, Application, Template, Feature) {

    $scope.application = {};
    $scope.templates = [];
    $scope.template = {};
    $scope.features = [];
    $scope.feature = {};
    $scope.newTemplate = {
      'is_public': true,
      'is_crowdsourced': true,
      'is_moderated': true,
      'is_geospatial': true
    };
    $scope.loading = true;

    $rootScope.navigation = false;
    $scope.EditApplication = false;
    $scope.AddTemplate = false;
    $scope.UserAccount = false;



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
            console.log('$scope.features', $scope.features);
          });
        });
    }

    if ($scope.template.id) {
      console.log('Get those features');
      Feature.query({
        storage: $scope.template.storage
      }).$promise.then(function (response) {
        $scope.features = response;
        console.log('$scope.features', $scope.features);
      });
    }

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

    $scope.createTemplate = function () {
      console.log($scope.newTemplate);
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

  }]);
