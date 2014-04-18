'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationsCtrl', function ($scope, $http, $resource) {

      console.log($http.defaults.headers);
    
      // $http({
      //   url: 'http://api.commonscloud.org/v2/applications.json',
      //   // url: 'https://www.commonscloud.org/api/v1/type_956345b07ae34bff8afb2eac2360f05c/',
      //   method: 'GET'
      // }).success(function (data, status, headers, config){
      //   // console.log('SUCCESS: ', data, status, headers, config);
      // }).error(function (data, status, headers, config){
      //   // console.log('ERROR: ', data, status, headers, config);
      // });


      $http.get('http://api.commonscloud.org/v2/applications.json')
        .success(function (data, status, headers, config){
          console.log('SUCCESS: ', data, status, headers, config);
        }).error(function (data, status, headers, config){
          console.log('ERROR: ', data, status, headers, config);
        });

  });
