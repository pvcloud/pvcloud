'use strict';

angular.module('pvcloudApp').factory('WidgetService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var widgetGetListResource = $resource(baseURL + "widget_get_list_by_page.php?account_id=:account_id&token=:token&page_id=:page_id", {});
    var widgetGetResource = $resource(baseURL + "widget_page_get_by_id.php?account_id=:account_id&token=:token&widget_id=:widget_id", {});

    function getWidgetsOfPageID(account_id, token, page_id) {
        return widgetGetListResource.get({account_id: account_id, token: token, page_id: page_id});
    }
    
     function getWidgetAndPageByID(account_id, token, widget_id) {
        return widgetGetResource.get({account_id: account_id, token: token, widget_id: widget_id});
    }

    return {
        GetWidgetsOfPageID: getWidgetsOfPageID,
        GetWidgetAndPageByID: getWidgetAndPageByID
    };
});

