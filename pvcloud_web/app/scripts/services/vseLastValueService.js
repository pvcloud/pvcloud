'use strict';

angular.module('pvcloudApp').factory('vseLastValueService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var vseGetValueResource = $resource(baseURL + "vse_get_value_last_response.php?optional_label=:pmLabel&app_id=:appId&account_id=:account_id&token=:token&api_key=:apiKey", 
    {});

    function getValue(pmLabel, appId, account_id, token, apiKey) {
        return vseGetValueResource.get({optional_label: pmLabel,app_id:appId,account_id: account_id, token: token, api_key: apiKey});
    }

    return {
        GetValue: getValue
    };
});