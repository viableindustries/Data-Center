'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FieldsCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'application', 'template', 'fields', 'user', '$location', '$anchorScroll', function ($rootScope, $scope, $routeParams, $timeout, application, template, fields, user, $location, $anchorScroll) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.template = template;
    $scope.fields = fields;

    $scope.page = {
      template: '/views/fields.html',
      title: $scope.template.name + ' Attributes',
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id,
      links: [{
        type: 'new',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes/new',
        text: 'Add an attribute',
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
        class: ''
      }, {
        title: 'Attributes',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes',
        class: 'active'
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

  }]);