'use strict';

angular.module('commonsCloudAdminApp')
  .controller('StatisticsCtrl', ['$route', '$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'application', 'template', 'statistics', 'user', function ($route, $rootScope, $scope, $routeParams, $location, $timeout, application, template, statistics, user) {


  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.template = template;
    $scope.statistics = statistics;

    $scope.page = {
      template: '/views/statistics.html',
      title: $scope.template.name + ' Statistics',
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id,
      links: [{
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics/new/',
        text: 'Add a statistic',
        type: 'new',
        static: 'static'
      }]
    };

    $scope.navigation = [
      {
        title: 'All Features',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features',
        class: ''
      }, {
        title: 'Statistics',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics',
        class: 'active'
      }, {
        title: 'Attributes',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes',
        class: ''
      }, {
        title: 'Settings',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/settings',
        class: ''
      }, {
        title: 'Developers',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/developers',
        class: ''
      }, {
        title: 'Import',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/import',
        class: ''
      },
    ];

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $scope.orderByField = null;
    $scope.reverseSort = false;

  }]);