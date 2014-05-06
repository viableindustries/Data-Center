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
