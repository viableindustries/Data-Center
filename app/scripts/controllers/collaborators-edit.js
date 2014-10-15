'use strict';

angular.module('commonsCloudAdminApp')
  .controller('CollaboratorsEditCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'collaborator', 'applicationPermissions', 'templatePermissions', 'user', function ($rootScope, $scope, $timeout, application, collaborator, applicationPermissions, templatePermissions, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.collaborator = collaborator;
    $scope.application = application;
    $scope.collaborator.permissions = {
      application: applicationPermissions,
      templates: templatePermissions
    };

    $scope.page = {
      template: '/views/collaborators-edit.html',
      title: 'Collaborators',
      back: '/applications/' + $scope.application.id + '/collaborators'
    };

    console.log('$rootScope.user.permissions', $rootScope.user.permissions);

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 15000);


  }]);
