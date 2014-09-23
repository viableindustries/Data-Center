'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Template', function () {

    this.$get = ['$resource', function ($resource) {

      var Template = $resource('//api.commonscloud.org/v2/templates/:templateId.json', {

      }, {
        activity: {
          method: 'GET',
          url: '//api.commonscloud.org/v2/templates/:templateId/activity.json'
        },
        get: {
          method: 'GET',
          url: '//api.commonscloud.org/v2/templates/:templateId.json'
        },
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/applications/:applicationId/templates.json',
          transformResponse: function (data, headersGetter) {

            var templates = angular.fromJson(data);

            return templates.response.templates;
          }
        },
        save: {
          method: 'POST',
          url: '//api.commonscloud.org/v2/applications/:applicationId/templates.json'
        },
        update: {
          method: 'PATCH'
        }
      });

      Template.GetTemplate = function(templateId) {
  
        var promise = Template.get({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response.response;
          });

        return promise;
      };

      Template.GetTemplateList = function(applicationId) {
        
        //
        // Get a list of templates associated with the current application
        //
        var promise = Template.query({
            applicationId: applicationId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response;
          });

        return promise;
      };

      Template.GetActivities = function(templateId) {

        var promise = Template.activity({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response.response.activities;
          });

        return promise;
      };


      return Template;
    }];

  });
