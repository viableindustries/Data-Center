'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'Application', 'Template', 'Feature', 'User', function ($rootScope, $scope, $routeParams, $timeout, Application, Template, Feature, User) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.application = {};
    $scope.templates = [];
    $scope.template = {};
    $scope.features = [];

    $scope.loading = true;

    //
    // Ensure the Templates are sorted oldest to newest
    //
    $scope.orderByField = 'id';
    $scope.reverseSort = false;

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
          'field': 'created',
          'direction': 'desc'
        }
      ]
    };


  //
  // CONTENT
  //
    $scope.GetTemplateList = function() {
      //
      // Get a list of templates associated with the current application
      //
      Template.query({
          applicationId: $routeParams.applicationId,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          $scope.templates = response;

          angular.forEach($scope.templates, function(template, index) {

            $scope.templates[index].features = [];

            //
            // Get a list of all features
            //
            Feature.query({
                storage: template.storage,
                updated: new Date().getTime()
              }).$promise.then(function(response) {
                $scope.templates[index].features = response;
              });

            //
            // Get a list of Features awaiting moderation
            //
            Feature.query({
                storage: template.storage,
                q: {
                  'filters': [
                    {
                      'name': 'status',
                      'op': 'eq',
                      'val': 'crowd'
                    }
                  ]
                },
                updated: new Date().getTime()
              }).$promise.then(function(response) {
                $scope.templates[index].moderation = response;
                if ($scope.templates[index].moderation.properties.total_features > 0) {
                  $scope.templates[index].moderation = true;
                }
              });

          });

        });
    };

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
            'class': 'active'
          });

          //
          // Get a list of Templates belonging to this Application
          //
          $scope.GetTemplateList();

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
