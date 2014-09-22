'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Application', function() {

    this.$get = ['$resource', '$location', function($resource, $location) {

      var base_resource_url = '//api.commonscloud.org/v2/applications/:id.json';

      var Application = $resource(base_resource_url, {}, {
        query: {
          method: 'GET',
          isArray: true,
          transformResponse: function(data, headersGetter) {

            var applications = angular.fromJson(data);

            return applications.response.applications;
          }
        },
        update: {
          method: 'PATCH'
        }
      });

      Application.GetApplication = function(applicationId) {

        //
        // Get the single application that the user wants to view
        //
        var promise = Application.get({
            id: applicationId
          }).$promise.then(function(response) {
            return response.response;
          }, function(error) {
            $rootScope.alerts.push({
              'type': 'error',
              'title': 'Uh-oh!',
              'details': 'Mind reloading the page? It looks like we couldn\'t get that Application for you.'
            });
          });

        return promise;
      };

      return Application;
    }];
  });
