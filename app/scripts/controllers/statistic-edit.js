'use strict';

angular.module('commonsCloudAdminApp')
  .controller('StatisticEditCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'application', 'template', 'fields', 'statistic', 'Statistic', 'user', function ($rootScope, $scope, $routeParams, $location, $timeout, application, template, fields, statistic, Statistic, user) {


  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.template = template;
    $scope.fields = fields;
    $scope.statistic = statistic;

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


    $scope.UpdateStatistic = function (statistic) {
      Statistic.update({
          templateId: $scope.template.id,
          statisticId: statistic.id,
          updated: new Date().getTime()
        }, statistic).$promise.then(function(response) {
          $rootScope.alerts.push({
            'type': 'success',
            'title': 'Updated',
            'details': 'We saved the updates you made to your statistic!'
          });
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind trying that again? It looks like we couldn\'t save those Statistic updates.'
          });
        });
    };

    $scope.DeleteStatistic = function (statistic) {

      var statistic_ = {
        templateId: $scope.template.id,
        statisticId: statistic.id,
        updated: new Date().getTime()
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Statistic.delete(statistic_);

      //
      // Update the Statistics list so that it no longer displays the deleted
      // items
      //
      $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics');
    };

  }]);
