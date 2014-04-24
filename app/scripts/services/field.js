'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Field', function () {

    this.$get = ['$resource', function ($resource) {

      var Field = $resource('//api.commonscloud.org/v2/templates/:templateId/fields.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          transformResponse: function (data, headersGetter) {

            var fields = angular.fromJson(data);

            return fields.response.fields;
          }
        },
        update: {
          method: 'PUT'
        }
      });

      return Field;
    }];

  });
