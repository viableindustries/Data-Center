'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', function ($scope, $http, ipCookie) {

      $http({
        url: 'http://api.commonscloud.org/v2/applications.json',
        method: 'GET'
      }).success(function (data, status, headers, config){
        console.log('SUCCESS: ', data, status, headers, config);
      }).error(function (data, status, headers, config){
        console.log('ERROR: ', data, status, headers, config);
      });

  });
