'use strict';

angular.module('commonsCloudAdminApp')
  .directive('featureSearch', function ($http, $timeout) {
	function link(scope, el, attrs) {
		//create variables for needed DOM elements
		var container = el.children()[0];
		var input = angular.element(container.children[0]);
		scope.searchText = input[0].value;
		var dropdown = angular.element(container.children[1]);
		var timeout;

		console.log('scope', scope);

		//open and close dropdown
		input.on('focus', function(){
			dropdown.removeClass('hidden');
		});

		// input.on('blur', function(){
		// 	dropdown.addClass('hidden');
		// });

		//$http request to be fired on search
		var getFilteredResults = function(){
			var table = scope.model.relationship;
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

		//search with timeout to prevent it from firing on every keystroke
		scope.search = function(){

			if (scope.searchText.length >= 3) {
				$timeout.cancel(timeout);

				timeout = $timeout(function () {
					getFilteredResults();
				}, 500);
			}
		};

		scope.createTag = function(){
			console.log('selected');
		};
	}

	return {
	  scope: {
			model: '='
	  },
	  templateUrl: '/views/featuresearch-template.html',
	  restrict: 'E',
	  link: link
	};
});