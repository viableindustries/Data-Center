'use strict';

describe('Controller: ApplicationsingleCtrl', function () {

  // load the controller's module
  beforeEach(module('commonsCloudAdminApp'));

  var ApplicationsingleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationsingleCtrl = $controller('ApplicationsingleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
