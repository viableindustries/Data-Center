'use strict';

angular.module('commonsCloudAdminApp')
  .provider('User', function() {

    this.$get = ['$resource', function($resource) {

      var User = $resource('//api.commonscloud.org/v2/user/me.json');

      return User;
    }];

  });
