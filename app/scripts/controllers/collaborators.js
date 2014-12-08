'use strict';

angular.module('commonsCloudAdminApp')
  .controller('CollaboratorsCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'collaborators', 'user', function ($rootScope, $scope, $timeout, application, collaborators, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.application = application;
    $scope.collaborators = collaborators;

    $scope.page = {
      template: '/views/collaborators.html',
      title: 'Collaborators',
      back: '/applications/' + $scope.application.id,
      links: [{
        type: 'new',
        url: '/applications/' + $scope.application.id + '/collaborators/new',
        text: 'Add a collaborator',
        static: 'static'
      }]
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
