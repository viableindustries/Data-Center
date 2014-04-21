'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', ['$scope', '$route', 'Application', function ($scope, $route, Application) {

    $scope.application = new Application();
    $scope.applications = Application.query();

    $scope.save = function () {

      $scope.application.$save().then(function (response) {
        $scope.applications.push(response.response);
      })

      $scope.application = new Application();      
    };

    $scope.delete = function (application) {

      var application_ = {
        id: application.id
      }

      Application.delete(application_);

      $scope.applications.pop($scope.applications, application);
    };

  }]);
