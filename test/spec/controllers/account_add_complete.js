'use strict';

describe('Controller: AccountAddCompleteCtrl', function () {

  // load the controller's module
  beforeEach(module('pvcloudApp'));

  var AccountAddCompleteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountAddCompleteCtrl = $controller('AccountAddCompleteCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
