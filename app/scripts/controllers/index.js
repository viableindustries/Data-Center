'use strict';

angular.module('commonsCloudAdminApp')
  .controller('IndexCtrl', ['$rootScope', '$scope', 'ipCookie', '$location', '$window', 'User', function($rootScope, $scope, ipCookie, $location, $window, User) {

    var session_cookie = ipCookie('COMMONS_SESSION');

    $rootScope.alerts = [];

    $scope.setupLoginPage = function() {
      var host = $location.host();

      //
      // Redirect based on current enviornment
      //
      if (host === 'localhost' || host === '127.0.0.1') {
        $scope.login_url = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=PGvNp0niToyRspXaaqx3PiQBMn66QXyAq5yrNHpz&redirect_uri=http%3A%2F%2F127.0.0.1%3A9000%2Fauthorize&scope=user applications';
      } else {
        $scope.login_url = 'http://api.commonscloud.org/oauth/authorize?response_type=token&client_id=MbanCzYpm0fUW8md1cdSJjUoYI78zTbak2XhZ2hF&redirect_uri=http%3A%2F%2Fapp.commonscloud.org%2Fauthorize&scope=user applications';
      }

    };

    //
    // Get the User object so that we can present them with profile and other
    // notification information
    //
    // @todo
    // Move this somewhere that we don't need to call it in every controller
    //
    $scope.GetUser = function() {
      User.get().$promise.then(function(response) {
        $rootScope.user = response.response;
      }, function (error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Oops!',
          'details': 'Looks like your user information is missing in action. Try reloading the page or logging in again.'
        });
      });
    };

    if (session_cookie && session_cookie !== undefined && session_cookie !== 'undefined') {
      console.log('session_cookie from index > if!', session_cookie);
      $scope.GetUser();
      $location.hash('');
      $location.path('/applications');
    } else {
      console.log('session_cookie from index > else', session_cookie);
      $scope.setupLoginPage();
    }

  }]);
