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
        get: {
          method: 'GET',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json',
          transformResponse: function (data, headersGetter) {

            var feature = angular.fromJson(data);

            return feature.response;
          }

        },
        update: {
          method: 'PATCH',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json',
        }
      });

      return Feature;
    }];

  });
