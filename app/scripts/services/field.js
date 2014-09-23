'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Field', function () {

    this.$get = ['$resource', function ($resource) {

      var Field = $resource('//api.commonscloud.org/v2/templates/:templateId/fields/:fieldId.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/templates/:templateId/fields.json',
          transformResponse: function (data, headersGetter) {

            var fields = angular.fromJson(data);

            return fields.response.fields;
          }
        },
        save: {
          method: 'POST',
          url: '//api.commonscloud.org/v2/templates/:templateId/fields.json'
        },
        update: {
          method: 'PATCH'
        },
        delete: {
          method: 'DELETE',
          url: '//api.commonscloud.org/v2/templates/:templateId/fields/:fieldId.json'
        }

      });

      Field.PrepareFields = function() {

        var processed_fields = [];

        angular.forEach(fields, function(field, index) {

          if (field.data_type === 'list') {
            field.options = field.options.split(',');
          }

          processed_fields.push(field);
        });

        return processed_fields;
      }

      Field.GetPreparedFields = function(templateId) {

        var promise = Field.query({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return $scope.PrepareFields(response);
          });

        return promise
      };


      Field.GetFields = function(templateId) {

        var promise = Field.query({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response;
          });

        return promise
      };

      Field.GetField = function(templateId, fieldId) {

        var promise = Field.get({
            templateId: templateId,
            fieldId: fieldId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response.response;
          });

        return promise
      };

      return Field;
    }];

  });
