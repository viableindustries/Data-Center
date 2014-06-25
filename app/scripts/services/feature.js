'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Feature', function () {

    this.$get = ['$resource', function ($resource) {

      var Feature = $resource('//api.commonscloud.org/v2/:storage.json', {

      }, {
        query: {
          method: 'GET',
          isArray: false,
          transformResponse: function (data, headersGetter) {
            return angular.fromJson(data);
          }
        },
        get: {
          method: 'GET',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json'
        },
        update: {
          method: 'PATCH',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json'
        },
        delete: {
          method: 'DELETE',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json'
        }
      });

      return Feature;
    }];

  });
