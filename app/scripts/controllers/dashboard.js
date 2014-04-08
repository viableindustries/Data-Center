'use strict';

angular.module('adminApp')
  .controller('DashboardCtrl', function ($scope, $rootScope, api) {

    $scope.applications = [];

    $scope.getApplicationList = function () {
      api.getApplications(function(data){
        $scope.applications = data.response.applications;
      });
    };

    $scope.getApplicationList();

  });
