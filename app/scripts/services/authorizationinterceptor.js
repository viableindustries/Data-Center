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
        if (response.status === 401 || response.status === 403) {
          $location.hash('');
          $location.path('/');
          return response || $q.when(response);
        }
        console.debug('AuthorizationInterceptor::Response', response || $q.when(response));
        return response || $q.when(response);
      }
    };
  }]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthorizationInterceptor');
  });
