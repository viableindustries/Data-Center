'use strict';

describe('Service: CommonsOAuth', function () {

  // load the service's module
  beforeEach(module('commonsCloudAdminApp'));

  // instantiate service
  var CommonsOAuth;
  beforeEach(inject(function (_CommonsOAuth_) {
    CommonsOAuth = _CommonsOAuth_;
  }));

  it('should do something', function () {
    expect(!!CommonsOAuth).toBe(true);
  });

});
