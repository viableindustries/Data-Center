'use strict';

angular.module('commonsCloudAdminApp')
  .controller('CollaboratorsCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'user', function ($rootScope, $scope, $timeout, application, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.application = application;

    $scope.page = {
      title: 'Collaborators',
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


  }]);
