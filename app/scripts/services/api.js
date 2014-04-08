'use strict';

angular.module('adminApp')
  .factory('api', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var api = {};
    var filters = [];
    var base = 'http://127.0.0.1:5000/v2/';
    var default_extension = '.json';

    api.getCurrentUser = function (callback) {
      $http({
        method: 'GET',
        url: 'http://127.0.0.1:5000/user/me.json',
        cache: true,
        withCredentials: true
      }).success(function (data){
        callback(data);
      }).error(function (status, headers){
        console.log('Error: ', status);
        console.log('Headers: ', headers);
      });
    };

    api.getApplications = function (callback, filters) {
      $http({
        method: 'GET',
        url: 'http://127.0.0.1:5000/v2/applications.json',
        cache: true,
        withCredentials: true
      }).success(function (data){
        callback(data);
      }).error(function (status, headers){
        console.log('Error: ', status);
        console.log('Headers: ', headers);
      });
    };

    api.getFeatureCollection = function (callback, collection, filters) {
      $http({
        method: 'GET',
        url: base.concat(collection),
        params: {
          'q': filters
        },
        cache: true
      }).success(function (data){
        callback(data);
      }).error(function (status, headers){
        console.log('Error: ', status);
        console.log('Headers: ', headers);
      });
    };

    api.getFeature = function (callback, collection, feature_id, filters, extension) {
      $http({
        method: 'GET',
        url: base.concat(collection, '/', feature_id, default_extension || extension),
        params: {
          'q': filters
        },
        cache: true
      }).success(function (data){
        callback(data);
      }).error(function (status, headers){
        console.log('Error: ', status);
        console.log('Headers: ', headers);
      });
    };

    return api;

  });
