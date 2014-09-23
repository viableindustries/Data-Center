'use strict';

angular.module('commonsCloudAdminApp')
  .controller('StatisticCreateCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', '$location', 'application', 'template', 'fields', 'Statistic', 'user', function ($rootScope, $scope, $routeParams, $timeout, $location, application, template, fields, Statistic, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.template = template;
    $scope.fields = fields;
    $scope.statistic = new Statistic();

    $scope.page = {
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics/',
      title: 'Add a ' + $scope.template.name + ' Statistics'
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
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $scope.orderByField = null;
    $scope.reverseSort = false;


    $scope.CreateStatistic = function (statistic) {
      $scope.statistic.$save({
        templateId: $routeParams.templateId
      }).then(function (response) {
        $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics');
      });
    };

  }]);