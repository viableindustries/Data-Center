'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', ['$rootScope', '$scope', '$route', 'Application', 'ipCookie', '$location', function ($rootScope, $scope, $route, Application, ipCookie, $location) {

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

    //
    // Hide the New Application form by default
    //
    $scope.NewApplication = false;

    //
    // Save a new Application to the API Database
    //
    $scope.save = function () {

      //
      // Save the Application via a post to the API and then push it onto the
      // Applications array, so that it appears in the user interface
      //
      $scope.application.$save().then(function (response) {
        $scope.applications.push(response.response);
      })

      //
      // Empty the form fields and hide the form
      //
      $scope.application = new Application();
      $scope.NewApplication = false;   
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
      }

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Application.delete(application_);

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
      $scope.applications.pop($scope.applications, application);
    };

  }]);
