'use strict';

describe('Controller: FieldsCtrl', function () {

  // load the controller's module
  beforeEach(module('commonsCloudAdminApp'));

  var FieldsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FieldsCtrl = $controller('FieldsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
