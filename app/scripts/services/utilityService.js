'use strict';

angular.module('pvcloudApp').factory('utilityService', function ($resource) {
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
        ProcessServiceResponse: processServiceResponse
    };
});