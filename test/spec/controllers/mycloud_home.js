'use strict';

describe('Controller: MycloudHomeCtrl', function () {

  // load the controller's module
  beforeEach(module('pvcloudApp'));

  var MycloudHomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MycloudHomeCtrl = $controller('MycloudHomeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
