'use strict';

angular.module('commonsCloudAdminApp')
  .controller('TemplateCreateCtrl', ['$rootScope', '$routeParams', '$scope', '$timeout', '$location', 'application', 'user', 'Template', function ($rootScope, $routeParams, $scope, $timeout, $location, application, user, Template) {

    //
    // Instantiate an Application object so that we can perform all necessary
    // functionality against our Application resource
    //
    $scope.application = application;
    $scope.newTemplate = new Template();

    $scope.page = {
      template: '/views/template-create.html',
      title: 'Add a Feature Collection',
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
    // Create a new Template that does not yet exist in the API database
    //
    $scope.CreateTemplate = function() {
      $scope.newTemplate.$save({
        applicationId: $scope.application.id
      }).then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'We built that Template for you, now add some Fields to it.'
        });

        $location.path('/applications/' + $scope.application.id);
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t save that Template for you.'
        });
      });
    };

  }]);
