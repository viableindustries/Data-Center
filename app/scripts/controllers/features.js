'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FeaturesCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'application', 'template', 'features', 'fields', 'user', function ($rootScope, $scope, $routeParams, $timeout, application, template, features, fields, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.template = template;
    $scope.features = features.response.features;
    $scope.featureproperties = features.response.properties;
    $scope.fields = fields;

    $scope.page = {
      title: $scope.template.name,
      back: '/applications/' + $scope.application.id,
      links: [{
        type: 'new',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features/new',
        text: 'Add a ' + $scope.template.name,
        static: 'static'
      }]
    }

    //
    // Ensure the Templates are sorted oldest to newest
    //
    $scope.orderByField = 'id';
    $scope.reverseSort = true;

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);


  //
  // CONTENT
  //

    //
    // Update how Features are sorted based on Field/Header clicked and
    // react to a second click by inverting the order
    //
    $scope.ChangeOrder = function (value) {
      $scope.orderByField = value;
      $scope.reverseSort =! $scope.reverseSort;
    };

  }]);
