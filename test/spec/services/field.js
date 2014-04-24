'use strict';

describe('Service: Field', function () {

  // load the service's module
  beforeEach(module('commonsCloudAdminApp'));

  // instantiate service
  var Field;
  beforeEach(inject(function (_Field_) {
    Field = _Field_;
  }));

  it('should do something', function () {
    expect(!!Field).toBe(true);
  });

});
