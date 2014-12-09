    'use strict';

angular.module('pvcloudApp').factory('DeviceRegistryService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBaseURL();
    var deviceRegistryResource = $resource(baseURL + "device_get_list_by_account.php?account_id=:account_id&token=:token", {});

    function getDeviceListForAccountID(account_id, token) {
        return deviceRegistryResource.get({account_id: account_id, token:token});
    }

    return {
        GetDeviceListForAccountID: getDeviceListForAccountID
    };
});