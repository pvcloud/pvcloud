'use strict';

angular.module('pvcloudApp').factory('addVseValueService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();

    var addVseValueResource = $resource(baseURL + "vse_add_value.php?label=:label&value=:value&type=:type&app_id=:appId&account_id=:account_id&token=:token&api_key=:apiKey", 
    {},
    {
    save: {
        method: 'POST',
        params: {
            
        },
        isArray: false
        
    }
    });
    
    
    var addVseValueResource1 = $resource(baseURL + "vse_add_value.php?label=:label&value=:value&type=:type&app_id=:appId&account_id=:account_id&token=:token&api_key=:apiKey", 
    {} );
    
    
    function addValue(label, value, type, appId, account_id, token, apiKey, success,error) {
        addVseValueResource.save({
            label: label,
            value: value,
            type: type,
            app_id:appId,
            account_id: account_id, 
            token: token, 
            api_key: apiKey
            
        },success,error);
        //return vseGetValueResource.get({optional_label: pmLabel,app_id:appId,account_id: account_id, token: token, api_key: apiKey});
    }
    
    function addValue1(label, value, type, appId, account_id, token, apiKey, success,error) {
        addVseValueResource.get({
            label: label,
            value: value,
            type: type,
            app_id:appId,
            account_id: account_id, 
            token: token, 
            api_key: apiKey
            
        },success,error);
        //return vseGetValueResource.get({optional_label: pmLabel,app_id:appId,account_id: account_id, token: token, api_key: apiKey});
    }

    return {
        AddValue: addValue,
        AddValue1: addValue1
    };
});