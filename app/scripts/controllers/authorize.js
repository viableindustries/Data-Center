'use strict';

angular.module('commonsCloudAdminApp')
  .controller('AuthorizeCtrl', ['$scope', '$rootScope', '$location', 'ipCookie', function ($scope, $rootScope, $location, ipCookie) {

    $scope.getAccessToken = function () {
        var locationHash = $location.hash();
        var accessToken = locationHash.substring(0,locationHash.indexOf('&'));
        var cleanToken = accessToken.replace('access_token=', '');

        var cookieOptions = {
          expires: 2
        };

        $rootScope.authenticated = true;

        return ipCookie('session', cleanToken, cookieOptions);
      };

    $scope.getAccessToken();

    $location.hash('');
    $location.path('/');

  }]);