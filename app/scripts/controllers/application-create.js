'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationCreateCtrl', ['$rootScope', '$scope', '$location', '$timeout', 'Application', 'User', function ($rootScope, $scope, $location, $timeout, Application, User) {

    //
    // Instantiate an Application object so that we can perform all necessary
    // functionality against our Application resource
    //
    $scope.application = new Application();

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

    if (!$rootScope.user) {
      $rootScope.user = User.getUser();
    }

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

    //
    // Save a new Application to the API Database
    //
    $scope.save = function () {

      //
      // Save the Application via a post to the API and then push it onto the
      // Applications array, so that it appears in the user interface
      //
      $scope.application.$save().then(function (response) {

        var alert = {
          'type': 'success',
          'title': 'Sweet!',
          'details': 'Your new Application was created, go add some stuff to it.'
        };

        $rootScope.alerts.push(alert);
        $location.path('/applications');

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

    };

  }]);
