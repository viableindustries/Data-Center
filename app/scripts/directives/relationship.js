'use strict';

angular.module('commonsCloudAdminApp')
  .directive('relationship', function ($http, $timeout) {
	function link(scope, el, attrs) {
		//create variables for needed DOM elements
		var container = el.children()[0];
		var input = angular.element(container.children[0]);
		scope.searchText = input[0].value;
    scope.model_values = []
		var dropdown = angular.element(container.children[1]);
		var timeout;

		console.log('scope', scope);

		//$http request to be fired on search
		var getFilteredResults = function(){
			var table = scope.field.relationship;
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

				//select DOM elements to create click events on them
				// var elements = container.children[1].children[0].children;
				var elements = el[0].children[0].children[1].children[0].children;
				angular.forEach(elements, function(value, key){
					console.log('element', elements[key]);
				});

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
					getFilteredResults();
				}, 500);
			}
		};

		scope.addFeatureToRelationships = function(feature){
			console.log('selected', feature);
      scope.model_values.push(feature.id);

      // Remove duplicates from array
      scope.model_values = set(scope.model_values);

      // Add values to the actual field model (this is in the controller, not this directive)
      scope.model = scope.model_values;

      // Clear out input field
      scope.searchText = '';
      scope.features = [];
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
