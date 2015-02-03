'use strict';

angular.module('commonsCloudAdminApp')
  .factory('AuthorizationInterceptor', ['$rootScope', '$q', 'ipCookie', '$location', function ($rootScope, $q, ipCookie, $location) {
    return {
      request: function(config) {

        if (config.headers.Authorization === 'external') {
          delete config.headers.Authorization;
          return config || $q.when(config);
        }

        var session_cookie = ipCookie('COMMONS_SESSION');

        if (config.url !== '/views/authorize.html' && (session_cookie === 'undefined' || session_cookie === undefined)) {
          $location.hash('');
          $location.path('/');
          return config || $q.when(config);
        }

        config.headers = config.headers || {};
        if (session_cookie) {
          config.headers.Authorization = 'Bearer ' + session_cookie;
        }

        config.headers['Cache-Control'] = 'no-cache, max-age=0, must-revalidate';
        console.debug('AuthorizationInterceptor::Request', config || $q.when(config));
        return config || $q.when(config);
      },
      response: function(response) {
        console.debug('AuthorizationInterceptor::Response', response || $q.when(response));
        return response || $q.when(response);
      },
      responseError: function (response) {
        if (response && (response.status === 401 || response.status === 403)) {
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
        if (response && response.status >= 500) {
          console.log('ResponseError', response);
        }
        return $q.reject(response);
      }
    };
  }]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthorizationInterceptor');
  });
