'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Import', function () {

    this.$get = ['$resource', function ($resource) {

      var Import = $resource('//api.commonscloud.org/v2/:storage/import.json', {

      }, {
        postFiles: {
          method: 'POST',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }
      });

      return Import;
    }];

  });
