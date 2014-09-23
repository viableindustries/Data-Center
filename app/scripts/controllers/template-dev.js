'use strict';

angular.module('commonsCloudAdminApp')
  .controller('TemplateDevCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'template', 'user', '$location', function ($rootScope, $scope, $timeout, application, template, user, $location) {

    //
    // Instantiate an Application object so that we can perform all necessary
    // functionality against our Application resource
    //
    $scope.application = application;
    $scope.template = template;

    $scope.page = {
      template: '/views/template-dev.html',
      title: $scope.template.name + ' Developer Information',
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id
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
        class: ''
      }, {
        title: 'Settings',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/settings',
        class: ''
      }, {
        title: 'Developers',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/developers',
        class: 'active'
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
