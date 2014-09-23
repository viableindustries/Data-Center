'use strict';

angular.module('commonsCloudAdminApp')
  .controller('TemplateEditCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'template', 'Template', 'user', '$location', function ($rootScope, $scope, $timeout, application, template, Template, user, $location) {

    //
    // Instantiate an Application object so that we can perform all necessary
    // functionality against our Application resource
    //
    $scope.application = application;
    $scope.template = template;

    $scope.page = {
      title: $scope.template.name + ' Settings',
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id
    };

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);


    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateTemplate = function() {
      Template.update({
        templateId: $scope.template.id,
        updated: new Date().getTime()
      }, $scope.template).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated',
          'details': 'Your template updates were saved successfully!'
        });
        $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/settings');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Template for you.'
        });
      });

    };

    //
    // Delete an existing Template from the API Database
    //
    $scope.DeleteTemplate = function (template) {

      //
      // Construct an object containing only the Application ID so that we
      // aren't sending along Application parameters in the URL
      //
      var template_ = {
        id: template.id
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Template.delete({
        templateId: template_.id,
        updated: new Date().getTime()
      }, template_).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated',
          'details': 'Your template was deleted!'
        });

        $location.path('/applications/' + $scope.application.id + '/collections');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Template for you.'
        });
      });
    };

  }]);
