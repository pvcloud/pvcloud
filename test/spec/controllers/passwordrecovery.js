'use strict';

describe('Controller: PasswordrecoveryCtrl', function () {

  // load the controller's module
  beforeEach(module('pvcloudApp'));

  var PasswordrecoveryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasswordrecoveryCtrl = $controller('PasswordrecoveryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
