'use strict';

angular.module('commonsCloudAdminApp')
  .factory('AuthorizationInterceptor', ['$rootScope', '$q', 'ipCookie', '$location', function ($rootScope, $q, ipCookie, $location) {

    //
    // Before we do anything else we should check to make sure
    // the users is authenticated with the CommonsCloud, otherwise
    // the this Client Application will not work properly. We must
    // have already authenticated the user (Resource Owner) with
    // the API through OAuth 2.0
    //
    // We set the default value to `false` and then check if the
    // session cookie for our domain exists.
    //
    $rootScope.auth = {
      'is_authenticated': false
    };

    if (ipCookie('session')) {
      $rootScope.auth.is_authenticated = true;
    }


    return {
        request: function(config) {
            var sessionCookie = ipCookie('session');
            config.headers = config.headers || {};
            if (sessionCookie) {
                config.headers.Authorization = 'Bearer ' + sessionCookie;
            }
            console.info('AuthorizationInterceptor::Request', config || $q.when(config));
            return config || $q.when(config);
        },
        response: function(response) {
            if (response.status === 401 || response.status === 403) {
                $location.hash('');
                $location.path('/login');
            }
            console.info('AuthorizationInterceptor::Response', response || $q.when(response));
            return response || $q.when(response);
        }
    };

  }]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthorizationInterceptor');
  });