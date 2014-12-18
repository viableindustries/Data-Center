'use strict';

/**
 * @ngdoc directive
 * @name commonsCloudAdminApp.directive:select
 * @description
 * # select
 */
angular.module('commonsCloudAdminApp')
  .directive('select', function () {
    return {
      restrict: "E",
      require: "?ngModel",
      scope: false,
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) {
          return;
        }
        element.bind("keyup", function() {
          element.triggerHandler("change");
        })
      }
   }
  });