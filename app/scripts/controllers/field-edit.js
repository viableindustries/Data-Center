'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FieldEditCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'template', 'templates', 'field', 'Field', 'user', '$location', function ($rootScope, $scope, $timeout, application, template, templates, field, Field, user, $location) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.templates = templates;
    $scope.template = template;
    $scope.field = field;


    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

    $scope.page = {
      title: 'Edit attribute',
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes'
    };

  //
  // CONTENT
  //

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateField = function () {
      Field.update({
        templateId: $scope.template.id,
        fieldId: $scope.field.id,
          updated: new Date().getTime()
      }, $scope.field).$promise.then(function(response) {

        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated!',
          'details': 'Your Field updates were saved successfully!'
        });

        $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes');

      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Field for you.'
        });
      });
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteField = function (field) {

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Field.delete({
        templateId: $scope.template.id,
        fieldId: field.id,
        updated: new Date().getTime()
      }, field).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': '',
          'details': 'Your Field was deleted!'
        });

        $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Field for you.'
        });
      });

    };

  }]);
