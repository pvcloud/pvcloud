'use strict';

angular.module('pvcloudApp').factory('WidgetService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var widgetGetListResource = $resource(baseURL + "widget_get_list_by_page.php?account_id=:account_id&token=:token&page_id=:page_id", {});

    function getWidgetsOfPageID(account_id, token, page_id) {
        return widgetGetListResource.get({account_id: account_id, token: token, page_id: page_id});
    }

    return {
        GetWidgetsOfPageID: getWidgetsOfPageID
    };
});