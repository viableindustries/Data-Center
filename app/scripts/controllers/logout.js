'use strict';

angular.module('commonsCloudAdminApp')
  .controller('LogoutCtrl', ['$scope', 'ipCookie', '$location', function($scope, ipCookie, $location) {

    console.log('LogoutCtrl');

    $scope.logout = function() {
      ipCookie.remove('COMMONS_SESSION');
      ipCookie.remove('COMMONS_SESSION', { path: '/' });

      $location.hash();
      $location.path('/');
    };

  }]);
