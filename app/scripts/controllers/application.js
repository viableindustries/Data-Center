'use strict';

angular.module('commonsCloudAdminApp')
  .controller('ApplicationCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', 'application', 'templates', 'Feature', 'user', function ($rootScope, $scope, $routeParams, $timeout, application, templates, Feature, user) {

  //
  // VARIABLES
  //

    //
    // Placeholders for our existing content
    //
    $scope.application = application;
    $scope.templates = templates;
    $scope.features = {};

    $scope.page = {
      template: '/views/application.html',
      title: $scope.application.name,
      links: [
        {
          type: 'edit',
          url: '/applications/' + $scope.application.id + '/edit/',
          text: 'Edit this application',
          static: "static"
        },
        {
          type: 'new',
          url: '/applications/' + $scope.application.id + '/collections/new/',
          text: 'Add a Feature Collection',
          static: "static"
        }
      ],
      back: '/applications/'
    };

    //
    // Template sorting options
    //
    $scope.orderByField = 'id'; // -- field to order by
    $scope.reverseSort = false; // -- sort order, true === desc, false === asc

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    // Any existing alerts will be cleared out after 25 seconds
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 25000);


  //
  // CONTENT
  //

    //
    // Return a total count of features per template, or a total number of features needing moderated
    // per feature template
    //
    $scope.features.count = function (count_type) {

      angular.forEach($scope.templates, function(template, index) {

        var q = {},
            template = $scope.templates[index];

        //
        // If the Count Type is Moderation then we need to make sure that we append special
        // query parameters to the request to filter the totals down to only be the features
        // that are in the 'crowd' feature status, meanign they need moderation
        //
        if (count_type === 'moderation') {
          var q = {
            'filters': [
              {
                'name': 'status',
                'op': 'eq',
                'val': 'crowd'
              }
            ]
          };        
        }

        //
        // Execute a query to a specified feature collection and return a total number of
        // features associated with that Feature Collection
        //
        Feature.query({
          storage: template.storage,
          q: q,
          updated: new Date().getTime()
        }).$promise.then(function(response) {
          if (count_type === 'features') {
            $scope.templates[index].features = response;
          } else {
            $scope.templates[index].moderation = (response.properties.total_features > 0) ? true: false;            
          }
        });

      });
    };

    //
    // Retrieve the total number of features for each template
    //
    $scope.features.count('features');

    //
    // Determine if any features are in need of being moderated
    //
    $scope.features.count('moderation');

  }]);
