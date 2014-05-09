'use strict';

angular.module('commonsCloudAdminApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'ipCookie', '$location', '$window', function($rootScope, $scope, ipCookie, $location, $window) {

    var session_cookie = ipCookie('session');

    if (!session_cookie) {
      $window.location.href = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=PGvNp0niToyRspXaaqx3PiQBMn66QXyAq5yrNHpz&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2Fauthorize&scope=user applications';
    } else {
      $location.hash('');
      $location.path('/applications');
    }

  }]);
