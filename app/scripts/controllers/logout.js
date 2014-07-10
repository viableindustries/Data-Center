'use strict';

angular.module('commonsCloudAdminApp')
  .controller('LogoutCtrl', ['$scope', '$cookieStore', '$route', function($scope, $cookieStore, $route) {

    console.log('LogoutCtrl');

    $cookieStore.remove('ccapi_session');

    console.log($cookieStore.get('ccapi_session'));

    $route.reload();

  }]);
