'use strict';

angular.module('commonsCloudAdminApp')
  .factory('CommonsCloudAPI', function ($http) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      getApplications: function () {
        
        return true;
      }
    };
  });
