'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FieldsCtrl', ['$rootScope', '$scope', '$routeParams', 'Application', 'Template', 'Field', '$location', '$anchorScroll', function ($rootScope, $scope, $routeParams, Application, Template, Field, $location, $anchorScroll) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = {};
    $scope.template = {};
    $scope.fields = [];


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
    $scope.GetFields = function() {
      Field.query({
          templateId: $scope.template.id,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          $scope.fields = response;
        });
    };

    $scope.GetTemplate = function(template_id) {
      Template.get({
          templateId: $routeParams.templateId,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          $scope.template = response.response;

          $scope.GetFields();

          $scope.breadcrumbs.push({
            'label': $scope.template.name,
            'title': 'View ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id,
            'class': ''
          });

          $scope.breadcrumbs.push({
            'label': 'Fields',
            'title': 'Viewing all field for ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/fields',
            'class': 'active'
          });

        });
    };

    $scope.GetApplication = function() {
      //
      // Get the single application that the user wants to view
      //
      Application.get({
          id: $routeParams.applicationId,
          updated: new Date().getTime()
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
