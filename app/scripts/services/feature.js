'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Feature', function () {

    this.$get = ['$resource', 'Template', function ($resource, Template) {

      var Feature = $resource('//api.commonscloud.org/v2/:storage.json', {

      }, {
        query: {
          method: 'GET',
          params: {
            statistics: false,
            relationship: false
          },
          isArray: false,
          transformResponse: function (data, headersGetter) {
            return angular.fromJson(data);
          }
        },
        postFiles: {
          method: 'PUT',
          url: '//api.commonscloud.org/v2/:storage/:featureId.json',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
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

      Feature.GetPaginatedFeatures = function(templateId, page) {
        
        var promise = Feature.GetTemplate(templateId, page).then(function(options) {
          return Feature.GetFeatures(options);
        });
        
        return promise;     
      }

      Feature.GetSingleFeatures = function(templateId, featureId) {
        
        var promise = Feature.GetTemplateSingleFeature(templateId, featureId).then(function(options) {
          return Feature.GetFeature(options);
        });
        
        return promise;     
      }

      Feature.GetTemplate = function(templateId, page) {
  
        var promise = Template.get({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return {
              storage: response.response.storage,
              page: page
            };
          });

        return promise;
      };

      Feature.GetTemplateSingleFeature = function(templateId, featureId) {
  
        var promise = Template.get({
            templateId: templateId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return {
              storage: response.response.storage,
              featureId: featureId
            };
          });

        return promise;
      };
      Feature.GetFeatures = function(options) {

        var promise = Feature.query({
            storage: options.storage,
            page: (options.page === undefined || options.page === null) ? 1: options.page,
            q: {
              'order_by': [
                {
                  'field': 'id',
                  'direction': 'desc'
                }
              ]
            },
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response;
          });

        return promise;
      };

      Feature.GetFeature = function(options) {
        var promise = Feature.get({
            storage: options.storage,
            featureId: options.featureId,
            updated: new Date().getTime()
          }).$promise.then(function(response) {
            return response.response;
          }, function(error) {
            $rootScope.alerts = [];
            $rootScope.alerts.push({
              'type': 'error',
              'title': 'Uh-oh!',
              'details': 'Mind trying that again? We couldn\'t find the Feature you were looking for.'
            });
          });

        return promise;
      }

      return Feature;
    }];

  });
