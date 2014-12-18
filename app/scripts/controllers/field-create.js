'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FieldCreateCtrl', ['$rootScope', '$scope', '$timeout', 'application', 'template', 'templates', 'Field', 'user', '$location', function ($rootScope, $scope, $timeout, application, template, templates, Field, user, $location) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.templates = templates;
    $scope.template = template;
    $scope.field = new Field();


    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $scope.page = {
      template: '/views/field-create.html',
      title: 'Add a new attribute to ' + $scope.template.name,
      back: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes'
    };

  //
  // CONTENT
  //

    //
    // Create a new Field that does not yet exist in the API database
    //
    $scope.CreateField = function () {
      $scope.field.$save({
        templateId: $scope.template.id
      }).then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'Your new Field was added to the Template.'
        });

        $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes');
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Field for you.'
        });
      });
    };

  }]);
