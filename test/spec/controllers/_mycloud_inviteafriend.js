'use strict';

describe('Controller: MycloudInviteafriendCtrl', function () {

  // load the controller's module
  beforeEach(module('pvcloudApp'));

  var MycloudInviteafriendCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MycloudInviteafriendCtrl = $controller('MycloudInviteafriendCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
