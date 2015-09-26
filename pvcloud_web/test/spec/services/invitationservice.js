'use strict';

describe('Service: invitationService', function () {

  // load the service's module
  beforeEach(module('pvcloudApp'));

  // instantiate service
  var invitationService;
  beforeEach(inject(function (_invitationService_) {
    invitationService = _invitationService_;
  }));

  it('should do something', function () {
    expect(!!invitationService).toBe(true);
  });

});
