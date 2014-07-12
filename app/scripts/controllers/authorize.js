'use strict';

angular.module('commonsCloudAdminApp').controller('AuthorizeCtrl', ['$scope', '$rootScope', '$location', 'ipCookie', function($scope, $rootScope, $location, ipCookie) {

    var session_cookie = ipCookie('COMMONS_SESSION');

    $scope.saveAuthorization = function() {
      var locationHash = $location.hash();
      var accessToken = locationHash.substring(0, locationHash.indexOf('&'));
      var cleanToken = accessToken.replace('access_token=', '');

      var cookieOptions = {
        path: '/',
        expires: 2
      };

      return ipCookie('COMMONS_SESSION', cleanToken, cookieOptions);
    };


    $scope.verifyAuthorization = function() {
      if (session_cookie && session_cookie !== undefined && session_cookie !== 'undefined') {
        $location.hash('');
        $location.path('/applications');
      } else {
        $scope.saveAuthorization();
        $scope.verifyAuthorization();
      }
    };

  }]);
