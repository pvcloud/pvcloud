'use strict';

angular.module('pvcloudApp').factory('WidgetService', function ($resource, $http, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var widgetGetListResource = $resource(baseURL + "widget_get_list_by_page.php?account_id=:account_id&token=:token&page_id=:page_id", {});
    var widgetGetResource = $resource(baseURL + "widget_page_get_by_id.php?account_id=:account_id&token=:token&widget_id=:widget_id", {});

    function getWidgetsOfPageID(account_id, token, page_id) {
        return widgetGetListResource.get({account_id: account_id, token: token, page_id: page_id});
    }
    
    function getWidgetAndPageByID(account_id, token, widget_id) {
        return widgetGetResource.get({account_id: account_id, token: token, widget_id: widget_id});
    }
    
    function WidgetInsert(account_id, token, Widget){
        console.log("WidgetInsert --> http.post");
        return  $http.post(baseURL + "widget_add_post.php", 
            {   
                account_id: account_id, 
                token: token, 
                title: Widget.title, 
                description: Widget.description, 
                page_id: Widget.page_id, 
                widget_type_id:2, 
                order:1, 
                refresh_frequency_sec:5 
            });
    }
    
    
    function WidgetUpdate(){
        
    
    }

    return {
        GetWidgetsOfPageID: getWidgetsOfPageID,
        GetWidgetAndPageByID: getWidgetAndPageByID,
        WidgetInsert:WidgetInsert,
        WidgetUpdate:WidgetUpdate
    };
});

