'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Templates', function () {

    this.$get = ['$resource', function ($resource) {

      var Template = $resource('//api.commonscloud.org/v2/templates/:id.json', {

      }, {
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/applications/:applicationId/templates.json',
          transformResponse: function (data, headersGetter) {

            var templates = angular.fromJson(data);

            return templates.response.templates;
          }
        },
        update: {
          method: 'PUT'
        }
      });

      return Template;
      // return new Greeter();
    }];

  });
