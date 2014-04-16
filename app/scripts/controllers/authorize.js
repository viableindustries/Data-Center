'use strict';

angular.module('commonsCloudAdminApp')
  .controller('AuthorizeCtrl', ['$scope', '$location', 'ipCookie', function ($scope, $location, ipCookie) {
    $scope.user = {};

    $scope.getAccessToken = function () {
        var locationHash = $location.hash();
        var accessToken = locationHash.substring(0,locationHash.indexOf('&'));
        var cleanToken = accessToken.replace('access_token=', '');

        var cookieOptions = {
          expires: 2
        };

        return ipCookie('session', cleanToken, cookieOptions);
      };

    $scope.getAccessToken();

    $location.path('/');

  }]);
