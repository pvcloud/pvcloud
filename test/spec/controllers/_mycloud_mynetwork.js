'use strict';

describe('Controller: MycloudMynetworkCtrl', function () {

  // load the controller's module
  beforeEach(module('pvcloudApp'));

  var MycloudMynetworkCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MycloudMynetworkCtrl = $controller('MycloudMynetworkCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
