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
      title: $scope.template.name + ' Developer Information',
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id
    };


    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

  }]);
