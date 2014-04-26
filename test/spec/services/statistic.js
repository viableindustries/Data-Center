'use strict';

describe('Service: Statistic', function () {

  // load the service's module
  beforeEach(module('commonsCloudAdminApp'));

  // instantiate service
  var Statistic;
  beforeEach(inject(function (_Statistic_) {
    Statistic = _Statistic_;
  }));

  it('should do something', function () {
    expect(!!Statistic).toBe(true);
  });

});
