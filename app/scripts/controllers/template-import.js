'use strict';

angular.module('commonsCloudAdminApp')
  .controller('TemplateImportCtrl', ['$rootScope', '$routeParams', '$scope', '$timeout', '$location', 'Application', 'Template', 'User', 'Import', function ($rootScope, $routeParams, $scope, $timeout, $location, Application, Template, User, Import) {

    //
    // Instantiate an Application object so that we can perform all necessary
    // functionality against our Application resource
    //
    $scope.application = {};
    $scope.template = {};
    $scope.activities = [];

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

    $rootScope.user = User.getUser();

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
    // Get the application the user has selected and begin loading the rest of
    // the application page
    //
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

          if ($routeParams.templateId) {
            $scope.GetTemplate($routeParams.templateId);
          }

        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind reloading the page? It looks like we couldn\'t get that Application for you.'
          });
        });
    };


    $scope.GetTemplate = function(template_id) {
      Template.get({
          templateId: template_id,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          $scope.template = response.response;

          $scope.breadcrumbs.push({
            'label': $scope.template.name,
            'title': 'View ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id,
            'class': ''
          });

          $scope.breadcrumbs.push({
            'label': 'Developer',
            'title': 'Developer',
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/developers',
            'class': 'active'
          });

          $scope.getActivities(template_id);

        });
    };

    $scope.getActivities = function(template_id) {

      Template.activity({
          templateId: template_id,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          console.log('Template.activity response', response);
          $scope.activities = response.response.activities;
        });
    };


    $scope.onFileSelect = function(files) {

      angular.forEach(files, function(file, index) {

        //
        // Add import to Activities list
        //
        var new_index = $scope.activities.push({
          'name': 'Import content from CSV',
          'description': '',
          'file': file,
          'created': '',
          'updated': '',
          'status': 'Uploading'
        });
        $scope.$apply();
        console.log('activities', $scope.activities);

        //
        // Create a file data object for uploading
        //
        var fileData = new FormData();
        fileData.append('import', file);

        //
        // Post CSV to server to begin import process
        //
        $scope.uploadFeatureImport(fileData, new_index-1);

      });

    };

    $scope.uploadFeatureImport = function(fileData, file_index) {

      Import.postFiles({
        storage: $scope.template.storage
      }, fileData).$promise.then(function(response) {

        $scope.activities[file_index].status = 'Queued'

        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Yes!',
          'details': 'Your CSV has been successfully queued for import'
        });

      }, function(error) {
        console.log('Import failed!!!!', error);
      });

    };

    $scope.GetApplication();

  }]);
