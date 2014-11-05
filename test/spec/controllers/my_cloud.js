'use strict';

describe('Controller: MyCloudCtrl', function () {

  // load the controller's module
  beforeEach(module('pvcloudApp'));

  var MyCloudCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyCloudCtrl = $controller('MyCloudCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
