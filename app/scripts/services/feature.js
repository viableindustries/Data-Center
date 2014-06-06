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
        save: {
          method: 'POST',
          transformRequest: function (data, headersGetter) {
            var feature = angular.fromJson(data);

            //
            // We have to make sure that our previously Stringified GeoJSON
            // is converted back to an object prior to submission
            //            
            feature.geometry = angular.fromJson(feature.geometry);

            //
            // Make sure all of our feature data is converted back toJson
            // prior before submitting it to the API.
            //
            data = angular.toJson(feature);

            return data;
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
