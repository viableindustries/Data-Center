'use strict';

angular.module('commonsCloudAdminApp')
  .controller('FeaturesCtrl', ['$q', '$route', '$rootScope', '$scope', '$routeParams', '$timeout', '$location', 'application', 'template', 'Feature', 'fields', 'user', function ($q, $route, $rootScope, $scope, $routeParams, $timeout, $location, application, template, Feature, fields, user) {

  //
  // VARIABLES
  //

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
    }, 25000);


  //
  // CONTENT
  //

    //
    // When the page initially loads, we should check to see if existing filters are present in the
    // browser's address bar. We should pass those filters along to the Feature Search. The Projects
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
      $scope.projects = response;
    });


    //
    // Update how Features are sorted based on Field/Header clicked and
    // react to a second click by inverting the order
    //
    $scope.ChangeOrder = function (value) {
      $scope.orderByField = value;
      $scope.reverseSort =! $scope.reverseSort;
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
