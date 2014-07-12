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

    //
    // scope.human_readable_values = (scope.model) ? scope.model: [];
    //
    // scope.$watch('model', function (data) {
    //   console.log('model updated', data);
    //   scope.human_readable_values = data;
    // });

    console.log('enumerated value checking', scope.human_readable_values, scope.model);

    scope.getPlaceholderText = function(field) {

      var label = field.label;
      var article = 'a';

      // if ("aeiouAEIOU".indexOf(label) != -1) {
      if (/[aeiouAEIOU]/.test(label)) {
        article = 'an';
      }

      return 'Choose ' + article + ' ' + label;
    };

    scope.placeholder = scope.getPlaceholderText(scope.field);

		//$http request to be fired on search
		var getFilteredResults = function(field){
			var table = field.relationship;
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
								'val': '%' + scope.searchText + '%'
							}
						]
					}
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
    }

		//search with timeout to prevent it from firing on every keystroke
		scope.search = function(){

			if (scope.searchText.length >= 3) {
				$timeout.cancel(timeout);

				timeout = $timeout(function () {
					getFilteredResults(scope.field);
				}, 500);
			}
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
      scope.relationship_focus = false;
		};

    scope.removeFeatureFromRelationships = function(index) {
      // delete scope.human_readable_values.splice(index, 1);
      delete scope.model.splice(index, 1);
    };

	}

	return {
	  scope: {
			field: '=',
      feature: '=',
      model: '='
	  },
	  templateUrl: '/views/includes/relationship.html',
	  restrict: 'E',
	  link: link
	};
});
