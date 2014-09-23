'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationEditCtrl', ['$route', '$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'Application', 'application', 'user', function ($route, $rootScope, $scope, $routeParams, $location, $timeout, Application, application, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.application = application;

    $scope.page = {
      template: '/views/application-edit.html',
      title: 'Edit Application',
      back: '/applications/' + $scope.application.id
    }

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);


  //
  // CONTENT
  //

    //
    // Save a new Application to the API Database
    //
    $scope.UpdateApplication = function () {

      if ($scope.application.id) {
        $scope.EditApplication = false;
        Application.update({
          id: $scope.application.id,
          updated: new Date().getTime()
        }, $scope.application).$promise.then(function(response) {
          $rootScope.alerts = [];
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
        id: application_.id,
        updated: new Date().getTime()
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

  }]);
