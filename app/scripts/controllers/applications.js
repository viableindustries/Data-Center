'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', ['$rootScope', '$scope', '$timeout', 'applications', 'user', function ($rootScope, $scope, $timeout, applications, user) {

    //
    // Get a list of all Applications the user has access to
    //
    $scope.applications = applications;

    $scope.page = {
      title: "My Applications"
    };


    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 15000);

  }]);
