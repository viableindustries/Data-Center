'use strict';

angular.module('commonsCloudAdminApp').controller('AuthorizeCtrl', ['$scope', '$rootScope', '$location', '$cookies', function($scope, $rootScope, $location, $cookies) {

    $scope.getAccessToken = function() {

      var locationHash = $location.hash();
      var accessToken = locationHash.substring(0, locationHash.indexOf('&'));
      var cleanToken = accessToken.replace('access_token=', '');

      $rootScope.user.is_authenticated = true;
      $cookies.ccapi_session = cleanToken;
    };

    $scope.getAccessToken();

    $location.hash('');
    $location.path('/applications');
  }]);
