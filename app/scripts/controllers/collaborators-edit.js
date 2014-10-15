'use strict';

angular.module('commonsCloudAdminApp')
  .controller('CollaboratorsEditCtrl', ['$rootScope', '$scope', '$timeout', '$location', 'Application', 'application', 'templates', 'collaborator', 'applicationPermissions', 'templatePermissions', 'user', function ($rootScope, $scope, $timeout, $location, Application, application, templates, collaborator, applicationPermissions, templatePermissions, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.collaborator = collaborator;
    $scope.application = application;
    $scope.templates = templates;
    $scope.collaborator.permissions = {
      application: applicationPermissions.response,
      templates: templatePermissions.response
    };

    //
    // DO NOT ALLOW THE CURRENT USER TO EDIT THEMSELVES
    //
    if ($rootScope.user.id === $scope.collaborator.id) {
      $location.path('/applications/' + $scope.application.id + '/collaborators');
    }

    console.log('$scope.collaborator', $scope.collaborator);

    $scope.page = {
      template: '/views/collaborators-edit.html',
      title: $scope.collaborator.name,
      back: '/applications/' + $scope.application.id + '/collaborators'
    };

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 15000);


  //
  // CONTENT
  //

    //
    // When we send our PATCH request, ngChecked values are not sent along, if they
    // are being set in the UI. We have to tell the data model to update based on
    // whether the is_admin field is checked or not.
    //
    $scope.$watch('collaborator.permissions.application.is_admin', function() {
      if ($scope.collaborator.permissions.application.is_admin) {
        $scope.collaborator.permissions.application.read = true;
        $scope.collaborator.permissions.application.write = true;
      }
    });

    $scope.$watch('collaborator.permissions.application.write', function() {
      if ($scope.collaborator.permissions.application.write) {
        $scope.collaborator.permissions.application.read = true;
      }
    });


    //
    // Save a new Application to the API Database
    //
    $scope.UpdatePermissions = function() {
      Application.permissionUpdate({
        id: $scope.application.id,
        userId: $scope.collaborator.id
      }, $scope.collaborator.permissions.application).$promise.then(function(response) {
        $rootScope.alerts = [];
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Awesome!',
          'details': 'We updated the collaborator\'s permissions.'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t save those Application updates for you.'
        });
      });
    };


  }]);
