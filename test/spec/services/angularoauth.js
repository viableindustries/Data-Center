'use strict';

describe('Service: AngularOAuth', function () {

  // load the service's module
  beforeEach(module('commonsCloudAdminApp'));

  // instantiate service
  var AngularOAuth;
  beforeEach(inject(function (_AngularOAuth_) {
    AngularOAuth = _AngularOAuth_;
  }));

  it('should do something', function () {
    expect(!!AngularOAuth).toBe(true);
  });

});
