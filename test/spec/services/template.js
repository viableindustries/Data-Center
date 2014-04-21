'use strict';

describe('Service: Template', function () {

  // load the service's module
  beforeEach(module('commonsCloudAdminApp'));

  // instantiate service
  var Template;
  beforeEach(inject(function (_Template_) {
    Template = _Template_;
  }));

  it('should do something', function () {
    expect(!!Template).toBe(true);
  });

});
