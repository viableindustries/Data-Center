'use strict';

angular.module('commonsCloudAdminApp')
  .provider('User', function() {

    this.$get = ['$resource', '$rootScope', '$location', '$q', 'ipCookie', function($resource, $rootScope, $location, $q, ipCookie) {

      var User = $resource('//api.commonscloud.org/v2/user/me.json');

      User.getUser = function () {
        User.get().$promise.then(function(response) {
          $rootScope.user = response.response;
          console.log('User.getUser() fired successfully', $rootScope.user);
        }, function (response) {

          if (response.status === 401 || response.status === 403) {
            console.error('Couldn\'t retrieve user information from server., need to redirect and clear cookies');

            var session_cookie = ipCookie('COMMONS_SESSION');

            if (session_cookie && session_cookie !== undefined && session_cookie !== 'undefined') {
              //
              // Clear out existing COMMONS_SESSION cookies that may be invalid or
              // expired. This may happen when a user closes the window and comes back
              //
              ipCookie.remove('COMMONS_SESSION');
              ipCookie.remove('COMMONS_SESSION', { path: '/' });

              //
              // Start a new Alerts array that is empty, this clears out any previous
              // messages that may have been presented on another page
              //
              $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

              $rootScope.alerts.push({
                'type': 'info',
                'title': 'Please sign in again',
                'details': 'You may only sign in at one location at a time'
              });


              $location.hash('');
              $location.path('/');
            }

          }

        });
      };

      return User;
    }];

  });
