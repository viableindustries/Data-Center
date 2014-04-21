'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$scope', '$routeParams', 'Application', 'Template', function ($scope, $routeParams, Application, Template) {

    $scope.application = {};
    $scope.templates = [];

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
