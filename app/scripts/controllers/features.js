'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FeaturesCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'Application', 'Template', 'Feature', 'Field', 'User', function ($rootScope, $scope, $routeParams, $timeout, Application, Template, Feature, Field, User) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our on-screen content
    //
    $scope.application = {};
    $scope.template = {};
    $scope.features = [];
    $scope.fields = [];

    //
    // Ensure the Templates are sorted oldest to newest
    //
    $scope.orderByField = 'id';
    $scope.reverseSort = true;

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
    // Default query parameters
    //
    $scope.query_params = {
      'order_by': [
        {
          'field': 'id',
          'direction': 'desc'
        }
      ]
    };

  //
  // CONTENT
  //
    $scope.GetFeatures = function(page) {
      
      Feature.query({
          storage: $scope.template.storage,
          page: page,
          q: $scope.query_params,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          $scope.featureproperties = response.properties;
          $scope.features = response.response.features;
        });
    };

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

          if ($routeParams.page) {
            $scope.GetFeatures($routeParams.page);
          } else {
            $scope.GetFeatures(1);
          }

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
