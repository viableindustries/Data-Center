'use strict';

describe('Controller: AuthorizeCtrl', function () {

  // load the controller's module
  beforeEach(module('commonsCloudAdminApp'));

  var AuthorizeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AuthorizeCtrl = $controller('AuthorizeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
