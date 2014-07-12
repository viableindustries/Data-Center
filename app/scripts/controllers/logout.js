'use strict';

angular.module('commonsCloudAdminApp')
  .controller('LogoutCtrl', ['$scope', 'ipCookie', '$route', function($scope, ipCookie, $route) {

    console.log('LogoutCtrl');

    ipCookie.remove('COMMONS_SESSION');

    $route.reload();

  }]);
