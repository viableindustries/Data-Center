'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Application', function() {

    this.$get = ['$resource', '$location', '$rootScope', function($resource, $location, $rootScope) {

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
        collaborators: {
          url: '//api.commonscloud.org/v2/applications/:id/users.json',
          method: 'GET',
          isArray: false
        },
        permission: {
          url: '//api.commonscloud.org/v2/applications/:id/users/:userId.json',
          method: 'GET',
          isArray: false
        },
        permissionUpdate: {
          url: '//api.commonscloud.org/v2/applications/:id/users/:userId.json',
          method: 'PATCH'
        },
        collaborator: {
          url: '//api.commonscloud.org/v2/users/:userId.json',
          method: 'GET',
          isArray: false
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

      Application.GetCollaborators = function(applicationId) {

        //
        // Get the single application that the user wants to view
        //
        var promise = Application.collaborators({
            id: applicationId
          }).$promise.then(function(response) {
            return response.response.users;
          }, function(error) {
            $rootScope.alerts.push({
              'type': 'error',
              'title': 'Uh-oh!',
              'details': 'Mind reloading the page? It looks like we couldn\'t get that Application for you.'
            });
          });

        return promise;
      };

      Application.GetCollaborator = function(applicationId, userId) {

        //
        // Get the single application that the user wants to view
        //
        var promise = Application.collaborator({
            id: applicationId,
            userId: userId
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

      Application.GetCollaboratorPermissions = function(applicationId, userId) {

        //
        // Get the single application that the user wants to view
        //
        var promise = Application.permission({
            id: applicationId,
            userId: userId
          }).$promise.then(function(response) {
            return response;
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
