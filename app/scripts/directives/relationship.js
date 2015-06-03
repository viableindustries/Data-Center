'use strict';

angular.module('commonsCloudAdminApp')
  .directive('relationship', function ($http, $timeout) {
  function link(scope, el, attrs) {
    //create variables for needed DOM elements
    var container = el.children()[0];
    var input = angular.element(container.children[0]);
    var dropdown = angular.element(container.children[1]);
    var timeout;
    scope.relationship_focus = false;

    scope.template_ = {
      name: (scope.template === undefined) ? 'default' : scope.template
    }
    scope.class_ = (scope.class === undefined) ? 'form-control': scope.class;

    //$http request to be fired on search
    var getFilteredResults = function(table){
      var url = '//api.commonscloud.org/v2/' + table + '.json';

      $http({
        method: 'GET',
        url: url,
        params: {
          'q': {
            'filters':
            [
              {
                'name': 'name',
                'op': 'ilike',
                'val': scope.searchText + '%'
              }
            ]
          },
          'results_per_page': 500
        }
      }).success(function(data){
        //assign feature objects to scope for use in template
        scope.features = data.response.features;
      });
    };

    var set = function(arr) {
      return arr.reduce(function (a, val) {
        if (a.indexOf(val) === -1) {
            a.push(val);
        }
        return a;
      }, []);
    };

    //search with timeout to prevent it from firing on every keystroke
    scope.search = function(){
      $timeout.cancel(timeout);

      timeout = $timeout(function () {
        getFilteredResults(scope.table);
      }, 200);
    };

    scope.addFeatureToRelationships = function(feature){

      if (angular.isArray(scope.model)) {
        // scope.human_readable_values.push(feature);
        scope.model.push(feature);
      } else {
        scope.model = [];
        // scope.human_readable_values.push(feature);
        scope.model.push(feature);
      }

      scope.model = set(scope.model);

      // Clear out input field
      scope.searchText = '';
      scope.features = [];
    };

    scope.removeFeatureFromRelationships = function(index) {
      scope.model.splice(index, 1);
    };

    scope.resetField = function() {
      scope.searchText = '';
      scope.features = [];
      scope.relationship_focus = false;
      console.log('Field reset');
    };

  }

  return {
    scope: {
      table: '=',
      model: '=',
      fields: '=',
      placeholder: '=',
      class: '=',
      template: '=bind'
    },
    templateUrl: '/views/includes/relationship.html',
    restrict: 'E',
    link: link
  };
});
