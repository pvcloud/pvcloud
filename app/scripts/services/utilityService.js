'use strict';

angular.module('pvcloudApp').factory('UtilityService', function ($resource) {

    function getBackendBaseURL() {
        var baseURL = "";
        
        if (window.location.host === "localhost:9000") {
            baseURL = "http://localhost:8080/pvcloud_backend/";
        } else {
            baseURL = "/pvcloud_backend/";
        }

        return baseURL;
    }
    function getCORSRequestURL(){
        return window.location.host;      
    }

    function processServiceResponse(response, successFunction, errorFunction, exceptionFunction) {
        console.log("PROCESS_SERVICE_RESPONSE");
        console.log(response);
        switch (response.status) {
            case "OK":
                console.log("CASE OK");
                if (successFunction)
                    successFunction(response);
                else
                    console.log(response);
                break;
            case "ERROR":
                console.log("CASE ERROR");
                if (errorFunction)
                    errorFunction(response);
                else
                    console.log(response);
                break;
            case "EXCEPTION":
                console.log("CASE EXCEPTION");
                if (exceptionFunction)
                    exceptionFunction(response);
                else
                    console.log(response);
                break;
            default:
        }
    }
    return {
        ProcessServiceResponse: processServiceResponse,
        GetBackendBaseURL:getBackendBaseURL,
        GetCORSRequestURL:getCORSRequestURL
    };
});