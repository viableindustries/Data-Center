'use strict';

angular.module('commonsCloudAdminApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'ipCookie', function($rootScope, $scope, ipCookie) {

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
    $rootScope.auth.is_authenticated = false;

    if (ipCookie('session')) {
      $rootScope.auth.is_authenticated = true;
    }

  }]);
