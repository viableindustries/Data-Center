'use strict';

describe('Directive: mapbox', function () {

  // load the directive's module
  beforeEach(module('commonsCloudAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mapbox></mapbox>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapbox directive');
  }));
});
