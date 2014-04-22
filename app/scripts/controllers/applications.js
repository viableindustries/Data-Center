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

      console.log($scope.application);

      //
      // Save the Application via a post to the API and then push it onto the
      // Applications array, so that it appears in the user interface
      //
      $scope.application.$save().then(function (response) {
        $scope.applications.push(response.response);
      });

      //
      // Empty the form fields and hide the form
      //
      $scope.application = new Application();
      $scope.NewApplication = false;   
    };

  }]);
