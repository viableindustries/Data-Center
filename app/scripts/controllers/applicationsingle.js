'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationSingleCtrl', ['$scope', '$routeParams', 'Application', function ($scope, $routeParams, Application) {

    $scope.application = {};

    Application.get({
        id: $routeParams.applicationId
    }).$promise.then(function(response) {
        $scope.application = response.response;
        console.log('Single Application View', $routeParams.applicationId, $scope.application);
    });

  }]);
