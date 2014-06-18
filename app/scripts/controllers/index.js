'use strict';

angular.module('commonsCloudAdminApp')
  .controller('IndexCtrl', ['$rootScope', '$scope', 'ipCookie', '$location', '$window', 'User', function($rootScope, $scope, ipCookie, $location, $window, User) {

    var host = $location.host(),
        redirect_uri;
    var session_cookie = ipCookie('ccapi_session');

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
        //
        // Once the template has been updated successfully we should give the
        // user some on-screen feedback and then remove it from the screen after
        // a few seconds as not to confuse them or force them to reload the page
        // to dismiss the message
        //
        var alert = {
          'type': 'error',
          'title': 'Oops!',
          'details': 'Looks like your user information is missing in action. Try reloading the page or logging in again.'
        };

        $scope.alerts.push(alert);
      });
    };

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
      $scope.GetUser();
      $location.hash('');
      $location.path('/applications');
    }

  }]);
