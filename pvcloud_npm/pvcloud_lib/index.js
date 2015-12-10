(function () {
    var pvCloudLib = function () {

        /**
         * Write function sends data to pvcloud
         * @param {string} label name of the piece of data
         * @param {string} value content o the piece of data
         * @returns {undefined}
         */
        function write(label, value) {
            console.log("THIS IS WRITE FUNCTION OK OK. OK!");
        }

        /**
         * 
         * Read function retrieves last value for a given label
         * @param {string} label name of the piece of data to retrieve
         * @param {type} app_id
         * @param {type} api_key
         * @param {type} baseURL
         * @param {type} successCallback Function to call when HTTP Request is successful (Status code 200). Receives parameters response, body, error
         * @param {type} errorCallback Function to call when HTTP Request is NOT successful (Status code not 200). Receives parameters response, body, error
         * @param {type} finallyCallback Function to call at the end of the process, passing parameters response, body, error
         * @returns {string} last value found for the label provided
         */
        function read(label, app_id, api_key, baseURL, successCallback, errorCallback, finallyCallback) {
            
            
            log("consoleAPI.Read('" + label + "')");
            var wsURL = baseURL;
            wsURL += "vse_get_value_last.php";
            wsURL += '?app_id=' + app_id;
            wsURL += '&api_key=' + api_key;
            wsURL += '&optional_label=' + label;
            requestWrapper(wsURL, successCallback, errorCallback, finallyCallback);
        }

        /**
         * Wraps the inner call of an HTTP Request
         * @param {type} url URL to call
         * @param {type} successCallback Function to call when HTTP Request is successful (Status code 200). Receives parameters response, body, error
         * @param {type} errorCallback Function to call when HTTP Request is NOT successful (Status code not 200). Receives parameters response, body, error
         * @param {type} finallyCallback Function to call at the end of the process, passing parameters response, body, error
         * @returns {undefined}
         */
        function requestWrapper(url, successCallback, errorCallback, finallyCallback) {
            log("requestWrapper()");
            log("URL: ");
            log(url);

            request(url, function (error, response, body) {
                if (!error && response && response.statusCode === 200) {
                    log("SUCCESS!!!--------------------------------------------");
                    if (successCallback)
                        successCallback(response, body, error);
                    else {
                        if (parameters.async) {
                            try {
                                var bodyObject = JSON.parse(body);
                                var value = bodyObject.vse_value;
                                OutputResult(value);
                            } catch (ex) {
                                errorLog("ASYNC CALL COULD NOT PARSE RESULT");
                                errorLog(ex);
                                OutputResult("PVCLOUD_ERROR");
                            }
                        } else {
                            OutputResult(body);
                        }
                    }

                } else if (response && response.statusCode) {
                    log("WRONG STATUS CODE:---------------------------------------------");
                    log(response.statusCode);
                    log("RESPONSE!!!----------------------------------------------");
                    log(response);

                    errorLog("REQUEST FAILED WITH STATUS CODE: " + response.statusCode);

                    if (errorCallback) {
                        errorCallback(response, body, error);
                    } else {
                        OutputResult("PVCLOUD_ERROR");
                    }

                } else if (error) {
                    log("ERROR:------------------------------------------------");
                    log(error);
                    log("PVCLOUD ERROR PROCESSING:-----------------------------");
                    errorLog(error);

                    if (errorCallback)
                        errorCallback(response, body, error);
                    else {
                        OutputResult("PVCLOUD_ERROR");

                    }
                } else {
                    log("UNKNOWN FAILURE:---------------------------------------");
                    log(error);
                    errorLog(response);

                    if (errorCallback)
                        errorCallback(response, body, error);
                    else
                        OutputResult("PVCLOUD_FAILURE");
                }

                if (finallyCallback)
                    finallyCallback(response, body, error);
            });
        }

        return {
            Write: write,
            Read: read
        };
    }();

    exports.pvCloudLib = pvCloudLib;
})();

