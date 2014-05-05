'use strict';

angular.module('commonsCloudAdminApp')
  .provider('Statistic', function () {

    this.$get = ['$resource', function ($resource) {

      var Statistic = $resource('//api.commonscloud.org/v2/templates/:templateId/statistics/:statisticId.json', {

      }, {
        get: {
          method: 'GET',
          transformResponse: function (data, headersGetter) {

            var statistic = angular.fromJson(data);

            return statistic.response;
          }

        },
        query: {
          method: 'GET',
          isArray: true,
          url: '//api.commonscloud.org/v2/templates/:templateId/statistics.json',
          transformResponse: function (data, headersGetter) {

            var statistics = angular.fromJson(data);

            return statistics.response.statistics;
          }
        },
        save: {
          method: 'POST',
          url: '//api.commonscloud.org/v2/templates/:templateId/statistics.json'
        },
        update: {
          method: 'PATCH'
        }
      });

      return Statistic;
    }];

  });
