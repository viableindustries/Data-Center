'use strict';

angular.module('commonsCloudAdminApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'ipCookie', '$location', '$window', function($rootScope, $scope, ipCookie, $location, $window) {

    var host = $location.host(),
        redirect_uri;
    var session_cookie = ipCookie('ccapi_session');

    if (!session_cookie) {

      //
      // Redirect based on current enviornment
      //
      if (host === 'localhost' || host === '127.0.0.1') {
        redirect_uri = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=PGvNp0niToyRspXaaqx3PiQBMn66QXyAq5yrNHpz&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2Fauthorize&scope=user applications';
      } else {
        redirect_uri = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=MbanCzYpm0fUW8md1cdSJjUoYI78zTbak2XhZ2hF&redirect_uri=http%3A%2F%2Fapp.commonscloud.org%2Fauthorize&scope=user applications';
      }

      $window.location.href = redirect_uri;

    } else {
      $location.hash('');
      $location.path('/applications');
    }


  }]);
