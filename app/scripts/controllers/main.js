'use strict';

angular.module('commonsCloudAdminApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'ipCookie', '$location', '$window', function($rootScope, $scope, ipCookie, $location, $window) {

    var host = $location.host();
    var session_cookie = ipCookie('session');

    if (!session_cookie) {

      //
      // Default Redirect for authnetication, not this is the development URL and Client ID
      //
      console.log('host', host);
      debugger;

      if (host === 'localhost' || host === '127.0.0.1') {
        console.log('chose localhost or 127.0.0.1', host);
        debugger;
        $window.location.href = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=PGvNp0niToyRspXaaqx3PiQBMn66QXyAq5yrNHpz&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2Fauthorize&scope=user applications';
      } else {
        console.log('chose app.commonscloud.org', host);
        debugger;
        $window.location.href = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=MbanCzYpm0fUW8md1cdSJjUoYI78zTbak2XhZ2hF&redirect_uri=http%3A%2F%2Fapp.commonscloud.org%2Fauthorize&scope=user applications';
      }

    } else {
      $location.hash('');
      $location.path('/applications');
    }


  }]);
