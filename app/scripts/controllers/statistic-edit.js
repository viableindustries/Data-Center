'use strict';

angular.module('commonsCloudAdminApp')
  .controller('StatisticEditCtrl', ['$route', '$rootScope', '$scope', '$routeParams', '$location', '$timeout', 'Application', 'Template', 'Field', 'Statistic', 'User', function ($route, $rootScope, $scope, $routeParams, $location, $timeout, Application, Template, Field, Statistic, User) {


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
    $scope.statistics = [];
    $scope.statistic = {};

    //
    // Start a new Alerts array that is empty, this clears out any previous
    // messages that may have been presented on another page
    //
    $rootScope.alerts = ($rootScope.alerts) ? $rootScope.alerts: [];

    $timeout(function () {
      $rootScope.alerts = [];
    }, 5000);

    if (!$rootScope.user) {
      $rootScope.user = User.getUser();
    }

    //
    // Controls for showing/hiding specific page elements that may not be
    // fully loaded or when a specific user interaction has not yet happened
    //
    $scope.orderByField = null;
    $scope.reverseSort = false;

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
            'label': 'Statistics',
            'title': 'Viewing all statistics for the ' + $scope.template.name + ' feature collection',
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics',
            'class': 'active'
          });

          $scope.breadcrumbs.push({
            'label': 'Statistics',
            'title': 'Viewing all statistics for the ' + $scope.template.name + ' feature collection',
            'url': '/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics/new',
            'class': 'active'
          });

          $scope.GetFields();

          //
          // Return the requested Statistic after the Template is loaded
          //
          if ($routeParams.statisticId) {
            $scope.GetStatistic($scope.template.id, $routeParams.statisticId);
          }
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

    $scope.GetStatistic = function(template_id, statistic_id) {
      Statistic.get({
        templateId: template_id,
        statisticId: statistic_id,
        updated: new Date().getTime()
      }).$promise.then(function (response) {
        $scope.statistic = response;
      });
    };

    $scope.UpdateStatistic = function (statistic) {
      Statistic.update({
          templateId: $scope.template.id,
          statisticId: statistic.id,
          updated: new Date().getTime()
        }, statistic).$promise.then(function(response) {
          $rootScope.alerts.push({
            'type': 'success',
            'title': 'Updated',
            'details': 'We saved the updates you made to your statistic!'
          });
        }, function(error) {
          $rootScope.alerts.push({
            'type': 'error',
            'title': 'Uh-oh!',
            'details': 'Mind trying that again? It looks like we couldn\'t save those Statistic updates.'
          });
        });
    };

    $scope.DeleteStatistic = function (statistic) {

      var statistic_ = {
        templateId: $scope.template.id,
        statisticId: statistic.id,
        updated: new Date().getTime()
      };

      //
      // Send the 'DELETE' method to the API so it's removed from the database
      //
      Statistic.delete(statistic_);

      //
      // Update the Statistics list so that it no longer displays the deleted
      // items
      //
      $location.path('/applications/' + $scope.application.id + '/collections/' + $scope.template.id + '/statistics');
    };


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

        //
        // Return the requested Statistic after the Template is loaded
        //
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
  }]);
