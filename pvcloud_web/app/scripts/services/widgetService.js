'use strict';

angular.module('pvcloudApp').factory('WidgetService', function ($resource, $http, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var widgetGetListResource = $resource(baseURL + "widget_get_list_by_page.php?account_id=:account_id&token=:token&page_id=:page_id", {});
    var widgetGetResource = $resource(baseURL + "widget_page_get_by_id.php?account_id=:account_id&token=:token&widget_id=:widget_id", {});
    var widgetTypesGetResource = $resource(baseURL + "widget_type_get.php?account_id=:account_id&token=:token", {});

    function getWidgetsOfPageID(account_id, token, page_id) {
        return widgetGetListResource.get({account_id: account_id, token: token, page_id: page_id});
    }
    
    function getWidgetAndPageByID(account_id, token, widget_id) {
        return widgetGetResource.get({account_id: account_id, token: token, widget_id: widget_id});
    }
    
    function WidgetInsert(account_id, token, Widget){
        console.log("WidgetInsert --> http.post");
        var postData = {   
                account_id: account_id, 
                token: token, 
                title: Widget.title, 
                description: Widget.description, 
                page_id: Widget.page_id, 
                widget_type_id:Widget.widget_type_id, 
                order:1, 
                refresh_frequency_sec:Widget.frequency
            };
            
            console.log(postData);
        
        return  $http.post(baseURL + "webui_api.php/widget_add", postData);
    }
    
    
    function WidgetUpdate(){
        
    
    }
    
     function GetWidgetTypes(account_id, token){
        return widgetTypesGetResource.get({account_id: account_id, token: token});
     }

    return {
        GetWidgetsOfPageID: getWidgetsOfPageID,
        GetWidgetAndPageByID: getWidgetAndPageByID,
        WidgetInsert:WidgetInsert,
        WidgetUpdate:WidgetUpdate,
        GetWidgetTypes: GetWidgetTypes
    };
});

