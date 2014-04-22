'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Application', function () {

    // Method for instantiating
    this.$get = ['$resource', function ($resource) {

      var Application = $resource('//api.commonscloud.org/v2/applications/:id.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          transformResponse: function (data, headersGetter) {

            var applications = angular.fromJson(data);

            return applications.response.applications;
          }
        },
        update: {
          method: 'PATCH'
        }
      });

      return Application;
    }];
  });
