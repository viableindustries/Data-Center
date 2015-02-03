'use strict';

angular.module('commonsCloudAdminApp')
  .controller('IndexCtrl', ['$rootScope', '$scope', 'ipCookie', '$location', '$window', 'user', function($rootScope, $scope, ipCookie, $location, $window, user) {

    $scope.sessionCookie = ipCookie('COMMONS_SESSION');

    //
    // Setup basic page variables
    //
    $scope.page = {
      links: {
        development: $location.protocol() + '://api.commonscloud.org/oauth/authorize?response_type=token&client_id=PGvNp0niToyRspXaaqx3PiQBMn66QXyAq5yrNHpz&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2Fauthorize&scope=user applications',
        production: $location.protocol() + '://api.commonscloud.org/oauth/authorize?response_type=token&client_id=MbanCzYpm0fUW8md1cdSJjUoYI78zTbak2XhZ2hF&redirect_uri=http%3A%2F%2Fapp.commonscloud.org%2Fauthorize&scope=user applications'
      }
    };

    //
    // Check to see if the user has a defined session cookie that we can use to authenicate
    // to the API with
    //
    if ($scope.sessionCookie !== undefined && $scope.sessionCookie !== 'undefined') {
      $location.hash('');
      $location.path('/calendar');
    } else {
      //
      // If the cookie is not valid, then we need to just delete the offending cookie
      //
      ipCookie.remove('COMMONS_SESSION');
      ipCookie.remove('COMMONS_SESSION', { path: '/' });

      //
      // Since this system requires authentication to perform any task we should just
      // redirect the user to the login page via the $scope.page.links variable
      //
      $location.hash('');

      $window.location.href = ($scope.page.host === 'localhost' || $scope.page.host === '127.0.0.1') ? $scope.page.links.development : $scope.page.links.production;
    }





    // var session_cookie = ipCookie('COMMONS_SESSION');

    // $scope.setupLoginPage = function() {
    //   var host = $location.host();

    //   //
    //   // Redirect based on current enviornment
    //   //
    //   if (host === 'localhost' || host === '127.0.0.1') {
    //     $scope.login_url = '//api.commonscloud.org/oauth/authorize?response_type=token&client_id=PGvNp0niToyRspXaaqx3PiQBMn66QXyAq5yrNHpz&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2Fauthorize&scope=user applications';
    //   } else if (host === 'stg.commonscloud.org') {
    //     $scope.login_url = '//api.commonscloud.org/oauth/authorize?response_type=token&client_id=MbanCzYpm0fUW8md1cdSJjUoYI78zTbak2XhZ2hf&redirect_uri=http%3A%2F%2Fstg.commonscloud.org%2Fauthorize&scope=user applications';
    //   } else {
    //     $scope.login_url = '//api.commonscloud.org/oauth/authorize?response_type=token&client_id=MbanCzYpm0fUW8md1cdSJjUoYI78zTbak2XhZ2hF&redirect_uri=http%3A%2F%2Fapp.commonscloud.org%2Fauthorize&scope=user applications';
    //   }

    // };

    // if (session_cookie && session_cookie !== undefined && session_cookie !== 'undefined') {
    //   $location.hash('');
    //   $location.path('/applications');
    // } else {
    //   ipCookie.remove('COMMONS_SESSION');
    //   ipCookie.remove('COMMONS_SESSION', { path: '/' });
    //   $scope.setupLoginPage();
    // }

  }]);
