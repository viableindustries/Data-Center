'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Feature', function () {

    this.$get = ['$resource', function ($resource) {

      var Feature = $resource('//api.commonscloud.org/v2/:storage.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          transformResponse: function (data, headersGetter) {

            var features = angular.fromJson(data);

            return features.response.features;
          }
        },
        update: {
          method: 'PUT'
        }
      });

      return Feature;
    }];

  });
