'use strict';

angular.module('commonsCloudAdminApp')
  .provider('User', function() {

    this.$get = ['$resource', '$rootScope', function($resource, $rootScope) {

      var User = $resource('//api.commonscloud.org/v2/user/me.json');

      User.getUser = function () {
        User.get().$promise.then(function(response) {
          $rootScope.user = response.response;
          console.log('User.getUser() fired successfully', $rootScope.user);
        }, function (error) {
          console.error('Couldn\'t retrieve user information from server.');
        });
      };

      return User;
    }];

  });
