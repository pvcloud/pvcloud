'use strict';

angular.module('pvcloudApp').factory('DeviceRegistryService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();
    var deviceAddNewItemResource = $resource(baseURL + "device_register.php?account_id=:account_id&token=:token&device_nickname=:device_nickname&device_description=:device_description", {});
    var deviceRegistryResource = $resource(baseURL + "device_get_list_by_account.php?account_id=:account_id&token=:token", {});
    var deviceRegenerateAPIKeyResource = $resource(baseURL + "device_generate_api_key.php?account_id=:account_id&token=:token&device_id=:device_id", {});
    var deviceUpdateResource = $resource(baseURL + "device_modify.php?account_id=:account_id&token=:token&device_id=:device_id&device_nickname=:device_nickname&device_description=:device_description", {});
    var deviceDeleteResource = $resource(baseURL + "device_delete.php?account_id=:account_id&token=:token&device_id=:device_id", {});

    function getDeviceListForAccountID(account_id, token) {
        return deviceRegistryResource.get({account_id: account_id, token: token});
    }

    function registerNewDevice(account_id, token, device_nickname, device_description) {
        return deviceAddNewItemResource.get({account_id: account_id, token: token, device_nickname: device_nickname, device_description: device_description});
    }

    function regenerateAPIKey(account_id, token, device_id) {
        return deviceRegenerateAPIKeyResource.get({account_id: account_id, token: token, device_id: device_id});
    }

    function updateDevice(account_id, token, device_id, device_nickname, device_description) {
        return deviceUpdateResource.get({account_id: account_id, token: token, device_id: device_id, device_nickname: device_nickname, device_description: device_description});
    }

    function deleteDevice(account_id, token, device_id) {
        return deviceDeleteResource.get({account_id: account_id, token: token, device_id: device_id});
    }

    return {
        GetDeviceListForAccountID: getDeviceListForAccountID,
        RegisterNewDevice: registerNewDevice,
        RegenerateAPIKey: regenerateAPIKey,
        UpdateDevice: updateDevice,
        DeleteDevice: deleteDevice
    };
});