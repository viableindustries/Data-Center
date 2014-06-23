'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FieldCreateCtrl', ['$rootScope', '$scope', '$routeParams', 'Application', 'Template', 'Field', '$location', function ($rootScope, $scope, $routeParams, Application, Template, Field, $location) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = {};
    $scope.template = {};
    $scope.field = new Field();


    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    //
    // Define the Breadcrumbs that appear at the top of the page in the nav bar
    //
    $scope.breadcrumbs = [
      {
        'label': 'Applications',
        'title': 'View my applications',
        'url': '/applications',
        'class': ''
      }
    ];


  //
  // CONTENT
  //
    //
    // Create a new Field that does not yet exist in the API database
    //
    $scope.CreateField = function () {


      console.log('$scope.field', $scope.field);

      $scope.field.$save({
        templateId: $scope.template.id
      }).then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'Your new Field was added to the Template.'
        });

        $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/fields');

      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Field for you.'
        });
      });
    };

    $scope.GetTemplate = function(template_id) {
      Template.get({
          templateId: $routeParams.templateId
        }).$promise.then(function(response) {
          $scope.template = response.response;

          $scope.breadcrumbs.push({
            'label': $scope.template.name,
            'title': 'View ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id,
            'class': ''
          });

          $scope.breadcrumbs.push({
            'label': 'Fields',
            'title': 'Viewing all fields for ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/fields',
            'class': ''
          });

          $scope.breadcrumbs.push({
            'label': 'New',
            'title': 'Create a new field',
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/fields/new',
            'class': 'active'
          });

        });
    };

    $scope.GetApplication = function() {
      //
      // Get the single application that the user wants to view
      //
      Application.get({
          id: $routeParams.applicationId
        }).$promise.then(function(response) {

          //
          // Assign the response to the Application object and end loading
          //
          $scope.application = response.response;
          $scope.loading = false;

          //
          // Update the breadcrumbs based on the response from the application
          //
          $scope.breadcrumbs.push({
            'label': $scope.application.name,
            'title': 'View ' + $scope.application.name,
            'url': '/applications/' + $scope.application.id,
            'class': ''
          });

          $scope.breadcrumbs.push({
            'label': 'Feature Collections',
            'title': 'View all of ' + $scope.application.name + '\'s feature collections',
            'url': '/applications/' + $scope.application.id,
            'class': ''
          });

          $scope.GetTemplate();
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind reloading the page? It looks like we couldn\'t get that Application for you.'
          });
        });
    };


    //
    // Now that we've got the everything prepared, let's go ahead and start
    // the controller by instantiating the GetApplication method
    //
    $scope.GetApplication();
  }]);
