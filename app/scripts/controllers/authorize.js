'use strict';

angular.module('commonsCloudAdminApp').controller('AuthorizeCtrl', ['$scope', '$rootScope', '$location', 'ipCookie', function($scope, $rootScope, $location, ipCookie) {

    $scope.getAccessToken = function() {

      var locationHash = $location.hash();
      var accessToken = locationHash.substring(0, locationHash.indexOf('&'));
      var cleanToken = accessToken.replace('access_token=', '');

      var cookieOptions = {
        path: '/',
        expires: 2
      };

      $rootScope.user.is_authenticated = true;
      return ipCookie('ccapi_session', cleanToken, cookieOptions);
    };

    $scope.getAccessToken();

    $location.hash('');
    $location.path('/applications');
  }]);
