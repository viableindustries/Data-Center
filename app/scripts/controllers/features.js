'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FeaturesCtrl', ['$q', '$route', '$rootScope', '$scope', '$routeParams', '$timeout', '$location', 'application', 'template', 'Feature', 'fields', 'user', function ($q, $route, $rootScope, $scope, $routeParams, $timeout, $location, application, template, Feature, fields, user) {

  //
  // VARIABLES
  //
    var timeout;

    //
    // Placeholders for our on-screen content
    //
    $scope.application = application;
    $scope.template = template;
    // $scope.features = features.response.features;
    // $scope.featureproperties = features.properties;
    $scope.fields = fields;
    $scope.batch = {
      selected: false,
      functions: false
    };
    $scope.defaults = $location.search();

    $scope.page = {
      template: '/views/features.html',
      title: $scope.template.name,
      back: '/applications/' + $scope.application.id,
      links: [{
        type: 'new',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features/new',
        text: 'Add a ' + $scope.template.name,
        static: 'static'
      }],
      refresh: function() {
        $route.reload();
      }
    };

    $scope.navigation = [
      {
        title: 'All Features',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/features',
        class: 'active'
      }, {
        title: 'Statistics',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics',
        class: ''
      }, {
        title: 'Attributes',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/attributes',
        class: ''
      }, {
        title: 'Settings',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/settings',
        class: ''
      }, {
        title: 'Developers',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/developers',
        class: ''
      }, {
        title: 'Import',
        url: '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/import',
        class: ''
      },
    ];


    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];


  //
  // CONTENT
  //

    //
    // When the page initially loads, we should check to see if existing filters are present in the
    // browser's address bar. We should pass those filters along to the Feature Search. The Features
    // that populate the list shown to the user, we update this later on based upon filters that the
    // user applies
    //
    Feature.GetFeatures({
      storage: $scope.template.storage,
      page: $route.current.params.page,
      q: $route.current.params.q,
      location: $scope.defaults,
      fields: fields
    }).then(function(response) {
      $scope.features = response;
    });


    //
    // Setup project filter functionality
    //
    var filters_ = Feature.buildFilters(fields, $scope.defaults);

    $scope.filters = {
      page: ($scope.defaults.page) ? $scope.defaults.page : null,
      results_per_page: ($scope.defaults.results_per_page) ? $scope.defaults.results_per_page : null,
      callback: ($scope.defaults.callback) ? $scope.defaults.callback : null,
      selected: filters_,
      available: filters_
    };

    $scope.filters.select = function ($index) {
      $scope.filters.available[$index].active = true;
    };

    $scope.filters.remove = function ($index) {
      $scope.filters.available[$index].active = false;

      //
      // Each Filter can have multiple criteria such as single ilike, or
      // a combination of gte and lte. We need to null the values of all 
      // filters in order for the URL to change appropriately
      //
      angular.forEach($scope.filters.available[$index].filter, function(criteria, $_index) {
        $scope.filters.available[$index].filter[$_index].value = null;
      }); 

      $scope.search.execute();
    };


    //
    // Filter existing Features to a specified list based on the user's input
    //
    $scope.search = {};

    $scope.search.features = function() {

      $timeout.cancel(timeout);

      timeout = $timeout(function () {
        $scope.search.execute();
      }, 1000);
      
    };

    $scope.search.execute = function(page_number) {

      var Q = Feature.getFilters($scope.filters);

      console.log('Q', Q);

      $scope.filters.page = page_number;

      Feature.query({
        storage: $scope.template.storage,
        q: {
          filters: Q,
          order_by: [
            {
              field: 'created',
              direction: 'desc'
            }
          ]
        },
        page: ($scope.filters.page) ? $scope.filters.page: null,
        results_per_page: ($scope.filters.results_per_page) ? $scope.filters.results_per_page: null,
        callback: ($scope.filters.callback) ? $scope.filters.callback: null,
        updated: new Date().getTime()
      }).$promise.then(function(response) {

        //
        // Check to see if there are Filters remaining and if not, we should just remove the Q
        //
        var Q_ = null;

        if (Q.length) {
          Q_ = angular.toJson({
            filters: Q
          });
        }

        $location.search({
          q: Q_,
          page: ($scope.filters.page) ? $scope.filters.page: null,
          results_per_page: ($scope.filters.results_per_page) ? $scope.filters.results_per_page: null,
          callback: ($scope.filters.callback) ? $scope.filters.callback: null 
        });

        $scope.features = response;
      });
    };

    $scope.search.paginate = function(page_number) {

      //
      // First, we need to make sure we preserve any filters that the user has defined
      //
      $scope.search.execute(page_number);

      //
      // Next we go to the selected page `page_number`
      //

      console.log('Go to page', page_number);
    };


  //
  // BATCH
  //
    $scope.batch.checkSelections = function() {

      var deferred = $q.defer();
      var promise = deferred.promise;
      var check = false;

      promise.then(function () {
        $scope.features.forEach(function (feature, index) {
          if ($scope.features[index].batch) {
            check = true;
          }
        });
      }).then(function () {
        if (check) {
          console.log('A feature is checked display the batch functions')
          $scope.batch.functions = true;
        } else {
          console.log('No features are checked hide the batch functions')
          $scope.batch.functions = false;
        }
      });
      deferred.resolve();

    };

    $scope.batch.selectAll = function() {

      $scope.batch.selected =! $scope.batch.selected;
      $scope.batch.functions =! $scope.batch.functions;

      console.log('select all?', $scope.batch.selected);

      $scope.features.forEach(function(feature, index){
        $scope.features[index].batch = $scope.batch.selected;
        console.log('$scope.features[index].batch', index, $scope.features[index].batch);
      });
    };

    $scope.batch.delete = function() {

      var deferred = $q.defer();
      var promise = deferred.promise;

      promise.then(function () {
        $scope.features.forEach(function (feature, index) {
          if (feature.batch) {
            Feature.delete({
              storage: $scope.template.storage,
              featureId: feature.id
            });
          }
        });
      }).then(function () {
        $rootScope.alerts.push({
          'type': 'success',
          'title': 'Goodbye!',
          'details': 'The features you selected have been removed successfully'
        });
        $route.reload();
      });
      deferred.resolve();

    };

  }]);
