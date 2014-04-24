'use strict';

describe('Controller: CollaboratorsCtrl', function () {

  // load the controller's module
  beforeEach(module('commonsCloudAdminApp'));

  var CollaboratorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CollaboratorsCtrl = $controller('CollaboratorsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
