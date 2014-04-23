'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'Application', 'Template', function ($rootScope, $scope, $routeParams, $location, Application, Template) {

    $scope.application = {};
    $scope.templates = [];
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


    //
    // Save a new Application to the API Database
    //
    $scope.save = function () {

      console.log($scope.application);

      if ($scope.application.id) {
        console.log('Updated an existing post');
        $scope.EditApplication = false;
        Application.update({
          id: $scope.application.id
        }, $scope.application);
      }

      //
      // Save the Application via a post to the API and then push it onto the
      // Applications array, so that it appears in the user interface
      //
      // $scope.application.$save().then(function (response) {
      //   $scope.applications.push(response.response);
      // });

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

      //
      // Remove the newly deleted Application from the array, so that it no
      // longer appears in the user interface
      //
      // $scope.applications.pop($scope.applications, application);
    };

  }]);
