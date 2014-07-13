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

      ipCookie('COMMONS_SESSION', cleanToken, cookieOptions);

      $location.hash('');
      $location.path('/applications');
    };


    $scope.verifyAuthorization = function() {
      if (session_cookie && session_cookie !== undefined && session_cookie !== 'undefined') {
        $location.hash('');
        $location.path('/applications');
      } else {
        //
        // Clear out existing COMMONS_SESSION cookies that may be invalid or
        // expired. This may happen when a user closes the window and comes back
        //
        ipCookie.remove('COMMONS_SESSION');
        ipCookie.remove('COMMONS_SESSION', { path: '/' });
        
        $scope.saveAuthorization();
      }
    };

  }]);
