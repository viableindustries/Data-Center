'use strict';

angular.module('commonsCloudAdminApp')
  .controller('TemplateImportCtrl', ['$rootScope', '$scope', '$timeout', '$location', 'activities', 'application', 'template', 'user', 'Import', function ($rootScope, $scope, $timeout, $location, activities, application, template, user, Import) {

    //
    // Instantiate an Application object so that we can perform all necessary
    // functionality against our Application resource
    //
    $scope.application = application;
    $scope.template = template;
    $scope.activities = activities;

    $scope.page = {
      title: 'Import new ' + $scope.template.name + ' features',
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

  }]);
