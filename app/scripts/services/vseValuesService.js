'use strict';

angular.module('pvcloudApp').factory('vseValuesService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var vseGetValuesResource = $resource(baseURL + "vse_get_list.php?optional_vse_label=:pmLabel&optional_last_limit=:pmLimit&app_id=:appId&account_id=:account_id&token=:token&page_id=:page_id&api_key=:apiKey", 
    {});

    function getValues(pmLabel, pmLimit, appId, account_id, token, apiKey) {
        return vseGetValuesResource.get({optional_vse_label: pmLabel,optional_last_limit: pmLimit,app_id:appId,account_id: account_id, token: token, api_key: apiKey});
    }

    return {
        GetValues: getValues
    };
});