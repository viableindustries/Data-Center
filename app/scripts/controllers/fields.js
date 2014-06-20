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
    $scope.field = {};
    $scope.newField = new Field();


    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];
    $scope.orderByField = null;
    $scope.reverseSort = false;
    $scope.FieldEdit = false;
    $scope.FieldAdd = false;

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
          templateId: $scope.template.id
        }).$promise.then(function(response) {
          $scope.fields = response;
        });
    };

    //
    // Create a new Field that does not yet exist in the API database
    //
    $scope.CreateField = function () {


      console.log('$scope.newField', $scope.newField);

      $scope.newField.$save({
        templateId: $scope.template.id
      }).then(function(response) {
        $scope.fields.push(response.response);
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Great!',
          'details': 'Your new Field was added to the Template.'
        });

        $location.hash('top');

        $anchorScroll();
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t create that Field for you.'
        });
      });
    };

    $scope.ActionEditField = function (field_) {
      $scope.editField = field_;
      $scope.FieldEdit = true;
      $scope.FieldAdd = false;
    };

    //
    // Update the attributes of an existing Template
    //
    $scope.UpdateField = function () {
      Field.update({
        templateId: $scope.template.id,
        fieldId: $scope.editField.id
      }, $scope.editField).$promise.then(function(response) {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Updated!',
          'details': 'Your Field updates were saved successfully!'
        });
      }, function(error) {
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t update that Field for you.'
        });
      });

      $scope.editField = {};
      $scope.FieldEdit = false;
      $scope.FieldAdd = true;
    };

    //
    // Delete an existing Field from the API Database
    //
    $scope.DeleteField = function (field) {

      console.log('Field deletion FIRED!')


      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Field.delete({
        templateId: $scope.template.id,
        fieldId: field.id
      }, field).$promise.then(function(response) {
        console.log('Field deleted')
        $rootScope.alerts.push({
          'type': 'success',
          'title': '',
          'details': 'Your Field was deleted!'
        });
        $scope.fields.pop(field);
        $scope.editField = {};
        $scope.FieldEdit = false;

        if ($scope.fields.length) {
          $scope.FieldAdd = true;
        }
      }, function(error) {
        console.log('Field deletion failed')
        $rootScope.alerts.push({
          'type': 'error',
          'title': 'Uh-oh!',
          'details': 'Mind trying that again? It looks like we couldn\'t delete that Field for you.'
        });
      });

    };

    $scope.GetTemplate = function(template_id) {
      Template.get({
          id: $routeParams.templateId
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
            'label': 'Features',
            'title': 'Viewing all features in ' + $scope.template.name,
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features',
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
    // Update how Features are sorted based on Field/Header clicked and
    // react to a second click by inverting the order
    //
    $scope.ChangeOrder = function (value) {
      $scope.orderByField = value;
      $scope.reverseSort =! $scope.reverseSort;
    };


    //
    // Now that we've got the everything prepared, let's go ahead and start
    // the controller by instantiating the GetApplication method
    //
    $scope.GetApplication();
  }]);
