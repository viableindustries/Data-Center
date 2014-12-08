'use strict';

angular.module('commonsCloudAdminApp')
  .controller('CollaboratorsCreateCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'user', function ($rootScope, $scope, $timeout, application, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.application = application;

    $scope.page = {
      template: '/views/collaborators-create.html',
      title: 'New Collaborator',
      back: '/applications/' + $scope.application.id + '/collaborators'
    };

    $scope.navigation = [
      {
        title: 'Collaborators',
        url: '/applications/' + $scope.application.id + '/collaborators/',
        class: 'active'
      }, {
        title: 'Collections',
        url: '/applications/' + $scope.application.id + '/collections/',
        class: ''
      }
    ];

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 15000);


  }]);
