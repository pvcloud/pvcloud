'use strict';

angular.module('pvcloudApp').factory('PageService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var pageGetResource = $resource(baseURL + "page_get_ui.php?account_id=:account_id&token=:token&page_id=:page_id", {});

    function getPage(account_id, token, page_id) {
        return pageGetResource.get({account_id: account_id, token: token, page_id: page_id});
    }

    return {
        GetPage: getPage
    };
});