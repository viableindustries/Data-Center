'use strict';

describe('Service: CommonsCloudAPI', function () {

  // load the service's module
  beforeEach(module('commonsCloudAdminApp'));

  // instantiate service
  var CommonsCloudAPI;
  beforeEach(inject(function (_CommonsCloudAPI_) {
    CommonsCloudAPI = _CommonsCloudAPI_;
  }));

  it('should do something', function () {
    expect(!!CommonsCloudAPI).toBe(true);
  });

});
