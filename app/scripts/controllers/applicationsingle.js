'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$rootScope', '$scope', '$routeParams', 'Application', 'Template', function ($rootScope, $scope, $routeParams, Application, Template) {

    $scope.application = {};
    $scope.templates = [];

    $rootScope.navigation = false;

    //
    // Get the single application that the user wants to view
    //
    Application.get({
        id: $routeParams.applicationId
    }).$promise.then(function(response) {
        $scope.application = response.response;
    });

    //
    // Get a list of templates associated with the current application
    //
    Template.query({
        applicationId: $routeParams.applicationId
    }).$promise.then(function(response) {
        $scope.templates = response;
    });

  }]);
