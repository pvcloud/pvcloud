'use strict';

angular.module('pvcloudApp').factory('vseWidgetValuesService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var vseGetWidgetValuesResource = $resource(baseURL + "vse_get_list_for_widget.php?widget_id=:widget_id&last_entry_id=:last_entry_id&optional_max_limit=:optional_max_limit&app_id=:app_id&account_id=:account_id&token=:token&api_key=:api_key", 
    {});

    function getWidgetValues(widget_id,last_entry_id, optional_max_limit, app_id, account_id, token, api_key) {
        return vseGetWidgetValuesResource.get({widget_id: widget_id, last_entry_id: last_entry_id,optional_max_limit: optional_max_limit,app_id:app_id,account_id: account_id, token: token, api_key: api_key});
    }

    return {
        GetWidgetValues: getWidgetValues
    };
});