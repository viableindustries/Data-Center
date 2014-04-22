'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', ['$rootScope', '$scope', '$route', 'Application', 'ipCookie', '$location', function ($rootScope, $scope, $route, Application, ipCookie, $location) {

    $scope.application = new Application();
    $scope.applications = Application.query();

    $rootScope.navigation = false;

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
