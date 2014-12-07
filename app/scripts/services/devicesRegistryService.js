'use strict';

angular.module('pvcloudApp').factory('DeviceRegistryService', function ($resource) {
    var baseURL = "/pvcloud_backend/";
    var deviceRegistryResource = $resource(baseURL + "device_get_list_by_account.php?account_id=:account_id", {});

    function getDeviceListForAccountID(account_id) {
        return deviceRegistryResource.get({account_id: account_id});
    }

    return {
        GetDeviceListForAccountID: getDeviceListForAccountID
    };
});