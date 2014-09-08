'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', ['$rootScope', '$scope', '$timeout',  'Application', 'User', function ($rootScope, $scope, $timeout, Application, User) {

    //
    // Get a list of all Applications the user has access to
    //
    $scope.applications = Application.query();

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 15000);

    $rootScope.user = User.getUser();

    //
    // Define the Breadcrumbs that appear at the top of the page in the nav bar
    //
    $scope.breadcrumbs = [
      {
        'label': 'Applications',
        'title': 'View my applications',
        'url': '/applications',
        'class': 'active'
      }
    ];

  }]);
