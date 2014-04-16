'use strict';

angular
  .module('commonsCloudAdminApp', [
    'ivpusic.cookie',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider, $httpProvider, $locationProvider) {

    // Setup routes for our application
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/authorize', {
        templateUrl: 'views/authorize.html',
        controller: 'AuthorizeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // If you remove this, you break the whole application
    $locationProvider.html5Mode(true).hashPrefix('!');

    // Intercept requests from our server
    var interceptor = ['$rootScope', '$q', function(scope, $q) {

      var success = function ( response ) {
        return response;
      };

      var error = function ( response ) {
        if ( response.status === 401) {
          var deferred = $q.defer();
          scope.$broadcast('event:unauthorized');
          return deferred.promise;
        }
        return $q.reject( response );
      };

      return function( promise ) {
        return promise.then( success, error );
      };

    }];
    $httpProvider.responseInterceptors.push( interceptor );


  });
