'use strict';

angular.module('pvcloudApp').factory('contentService', function ($resource, UtilityService,$http) {
    var baseURL = UtilityService.GetBackendBaseURL();
    var contentResource = $resource(baseURL + "app_get_content.php?account_id=:account_id&token=:token", {});
    var newContentResource = $resource(baseURL + "app_save_content.php", {});

    function getListOfContents(account_id, token) {
        return contentResource.get({account_id: account_id, token: token}); //Put parameters as needed
    }

    function createContent(account_id, token, title, content) {
        return  $http.post(baseURL + "app_save_content.php", {account_id: account_id, token: token, title: title, content: content});

        //return newContentResource.save({},{account_id: account_id, token: token, title: title, content: content});
    }

    return {
        GetListOfContents: getListOfContents,
        CreateContent: createContent        
    };
});