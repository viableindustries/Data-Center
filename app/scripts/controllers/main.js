'use strict';

angular.module('adminApp')
  .controller('MainCtrl', function ($scope, api) {

    $scope.current_user = [];

    $scope.getCurrentUser = function () {
      api.getCurrentUser(function(data){
        $scope.current_user = data.response;

        if ($scope.current_user) {
            console.log('user logged in'):
        };
      });
    };

    $scope.getCurrentUser();

  });