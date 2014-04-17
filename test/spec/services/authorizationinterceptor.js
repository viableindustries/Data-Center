'use strict';

describe('Service: AuthorizationInterceptor', function () {

  // load the service's module
  beforeEach(module('commonsCloudAdminApp'));

  // instantiate service
  var AuthorizationInterceptor;
  beforeEach(inject(function (_AuthorizationInterceptor_) {
    AuthorizationInterceptor = _AuthorizationInterceptor_;
  }));

  it('should do something', function () {
    expect(!!AuthorizationInterceptor).toBe(true);
  });

});
