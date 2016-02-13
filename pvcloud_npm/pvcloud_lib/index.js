(function () {
    var request = require("request");
    var fs = require('fs');
    var options = {
        DEBUG: false,
        ERROR_LOG_FILE: "error_pvcloud.log",
        NO_WAIT_STATUS_BASE_FILE: "status_pvcloud_", /*to be completed with label_operation*/
        NO_WAIT_RESULT_BASE_FILE: "result_pvcloud_", /*to be completed with label_operation*/
        DEBUG_COUNT: 0
    };
    var pvCloudAPI = {
        bearerToken: undefined,
        connectedAppID: undefined,
        
        test: function () {
            return "SIMPLE SMOKE TEST";
        },
        /**
         * Performs a LOGIN operation to a target pvCloud server defined in baseURL
         * @param {type} baseURL target pvCloud Server
         * @param {type} userName user account
         * @param {type} password password
         * @param {type} successCallback callback function for successful web service call. Receives (error, response, body) signature
         * @param {type} errorCallback callback function for error web service call. Receives (error, response, body) signature
         * @param {type} finallyCallback callback function to be executed whether there was an error or not. Receives (error, response, body) signature
         * @returns {undefined}
         */
        Login: function (baseURL, userName, password, successCallback, errorCallback, finallyCallback) {
            var loginURL = baseURL + "session_login.php?email="+userName+"&pwd="+password;
            var PostData = {email:userName, pwd:password};
            var myFinallyCallback = function(error, response, body){
                pvCloudAPI.connectedAppID = undefined;
                finallyCallback(error, response, body);
            };
            
            postWrapper(loginURL, PostData, successCallback, errorCallback, myFinallyCallback);
        },
        
        /**
         * Connects to a particular App (defined by AppID) belonging to a previously logged-in account.
         * @param {int} app_id The ID of the app to connect the device to
         * @param {type} successCallback
         * @param {type} errorCallback
         * @param {type} finallyCallback
         * @returns {undefined}
         */
        ConnectByAppID: function(app_id, successCallback, errorCallback, finallyCallback){
            
        },
        
        /**
         * Connects to a particular App (defined by AppName) belonging to a previously logged-in account.
         * @param {int} app_id The ID of the app to connect the device to
         * @param {type} successCallback
         * @param {type} errorCallback
         * @param {type} finallyCallback
         * @returns {undefined}
         */
        ConnectByAppName: function(app_id, successCallback, errorCallback, finallyCallback){
            return {};
        },
        
        /**
         * Sends a value "asynchronously" using the file-based mechanism. 
         * @param {string} baseURL 
         * @param {int} account_id
         * @param {int} app_id
         * @param {int} api_key
         * @param {string} label
         * @param {string, integer, long, json simple object} value
         * @param {string} type
         * @param {datetime} captured_datetime
         * @param {function} successCallback
         * @param {function} errorCallback
         * @param {function} finallyCallback
         * @param {boolean} no_wait
         * @returns {undefined}
         */
        Write: function (baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback, no_wait) {
            log("pvCloud.Write() - BEGIN");
            var wsURL = baseURL;
            wsURL += "vse_add_value.php";
            wsURL += '?app_id=' + app_id;
            wsURL += '&api_key=' + api_key;
            wsURL += '&account_id=' + account_id;
            wsURL += '&label=' + label;
            wsURL += '&value=' + value;
            wsURL += '&type=' + type;
            wsURL += '&captured_datetime=' + captured_datetime;
            var opData = {
                label: label,
                operation: "WRITE"
            };
            log("pvCloud.Write() - Calling requestWrapper");
            requestWrapper(wsURL, successCallback, errorCallback, finallyCallback, no_wait, opData);
            log("pvCloud.Write() - END");
        },
        /**
         * Requests a last_value from pvCloud in an asyncrhouous fashion using the file mechanism for the given label (or any label if not provided)
         * @param {string} label
         * @param {function} successCallback
         * @param {function} errorCallback
         * @param {function} finallyCallback
         * @returns {undefined}
         */
        Read: function (label, successCallback, errorCallback, finallyCallback) {

        }

    };
    function OutputResult(result) {
        log("OutputResult---------------------------");
        log(result);
        //THIS CONSOLE LOG IS VERY IMPORTANT!!! DONT REMOVE!
        console.log(result);
    }

    /**
     * Wraps the inner call of an HTTP Request
     * @param {type} url URL to call
     * @param {type} successCallback Function to call when HTTP Request is successful (Status code 200). Receives parameters error, response, body
     * @param {type} errorCallback Function to call when HTTP Request is NOT successful (Status code not 200). Receives parameters error, response, body
     * @param {type} finallyCallback Function to call at the end of the process, passing parameters error, response, body
     * @param {type} no_wait option to execute in async/no_wait mode where results of a call are stored in a file.
     * @returns {undefined}
     */
    function requestWrapper(url, successCallback, errorCallback, finallyCallback, no_wait, operationData) {
        log("requestWrapper() - BEGIN");
        log("URL: " + url);
        if (no_wait) {
            statusToFile(operationData.label, operationData.operation, "WAITING FOR RESPONSE");
            resultToFile(operationData.label, operationData.operation, "");
        }

        log("requestWrapper() - Calling request()");
        request(url, function (error, response, body) {
            if (!error && response && response.statusCode === 200) {
                log("SUCCESS!!!--------------------------------------------");
                if (no_wait) {
                    try {
                        var bodyObject = JSON.parse(body);
                        var value = bodyObject.vse_value;
                        log("WRITING SUCCESS!");
                        log(operationData);
                        statusToFile(operationData.label, operationData.operation, "SUCCESS");
                    } catch (ex) {
                        logError("NO_WAIT CALL COULD NOT PARSE RESULT");
                        logError(ex);
                        statusToFile(operationData.label, operationData.operation, "ERROR: UNABLE TO PARSE RESULT");
                    }
                } else {
                    OutputResult(body);
                }

                if (successCallback)
                    successCallback(error,response, body);
            } else if (response && response.statusCode) {
                log("WRONG STATUS CODE:---------------------------------------------");
                log(response.statusCode);
                log("RESPONSE!!!----------------------------------------------");
                log(response);
                logError("REQUEST FAILED WITH STATUS CODE: " + response.statusCode);
                if (no_wait) {
                    //statusToFile(operationData.label, operationData.operation, "ERROR: WRONG STATUS CODE (" + response.statusCode + ")");
                }

                if (errorCallback) {
                    errorCallback(error, response, body);
                }

                //TODO: STOPPED HERE LOGIC FOR NO_WAIT

            } else if (error) {
                log("ERROR:------------------------------------------------");
                log(error);
                log("PVCLOUD ERROR PROCESSING:-----------------------------");
                logError(error);
                if (errorCallback)
                    errorCallback(error,response, body);
                else {
                    OutputResult("PVCLOUD_ERROR");
                }
            } else {
                log("UNKNOWN FAILURE:---------------------------------------");
                log(error);
                logError(response);
                if (errorCallback)
                    errorCallback(error, response, body);
                else
                    OutputResult("PVCLOUD_FAILURE");
            }

            if (finallyCallback)
                finallyCallback(error, response, body);
        });
        log("requestWrapper() - END");
    }

    function postWrapper(url, postData, successCallback, errorCallback, finallyCallback) {
        log("requestWrapper()");
        log("URL: ");
        log(url);
        request.post({url: url, formData: postData}, function (error, response, body) {
            if (!error && response && response.statusCode === 200) {
                log("SUCCESS!!!--------------------------------------------");
                if (successCallback)
                    successCallback(error, response, body);
            } else if (error){
                if(errorCallback){
                    errorCallback(error, response, body);
                }
            } else if (response && response.statusCode) {
                log("WRONG STATUS CODE:---------------------------------------------");
                log(response.statusCode);
                log("RESPONSE!!!----------------------------------------------");
                log(response);
                logError("REQUEST FAILED WITH STATUS CODE: " + response.statusCode);
                if (errorCallback) {
                    errorCallback(error, response, body);
                } else {
                    OutputResult("PVCLOUD_ERROR");
                }

            } else if (error) {
                log("ERROR:------------------------------------------------");
                log(error);
                log("PVCLOUD ERROR PROCESSING:-----------------------------");
                logError(error);
                if (errorCallback)
                    errorCallback(error, response, body);
                else {
                    OutputResult("PVCLOUD_ERROR");
                }
            } else {
                log("UNKNOWN FAILURE:---------------------------------------");
                log(error);
                logError(response);
                if (errorCallback)
                    errorCallback(error, response, body);
                else
                    OutputResult("PVCLOUD_FAILURE");
            }

            if (finallyCallback)
                finallyCallback(error, response, body);
        });
    }

    function resultToFile(tag, result) {
        log("resultToFile() - BEGIN");
        if (!tag)
            tag = "any";
        //var filePath = parameters.async_path || "";

        log("resultToFile() - Write to file is disabled...");
        try {
            /*
             var resultFile = filePath + "/out_pvcloud_" + tag + ".txt";
             log(resultFile);
             var stream = fs.createWriteStream(resultFile);
             stream.once('open', function (fd) {
             try {
             stream.write(result);
             stream.end();
             stream.close();
             log("FS END REACHED!");
             } catch (ex) {
             errorLog(ex);
             }
             });
             */
            log("resultToFile() - END NOEX");
        } catch (ex) {
            log("resultToFile() - EXCEPTION");
            log(ex);
            logError(ex);
        }
        log("resultToFile() - END");
    }

    function statusToFile(label, operation, status) {
        log("statusToFile() - BEGIN");
        if (!label)
            label = "ALL";
        var filePath = options.NO_WAIT_STATUS_BASE_FILE;
        filePath = filePath + label + "_" + operation;
        log("statusToFile() - FILE PATH: " + filePath);
        try {
            log(filePath);
            var stream = fs.createWriteStream(filePath);
            log("statusToFile() - Setting up stream...");
            stream.once('open', function (fd) {
                log("statusToFile() - stream function()");
                try {
                    log("statusToFile() - WRITING STATUS: " + status);
                    stream.write(status);
                    stream.end();
                    stream.close();
                    log("statusToFile() - END OF stram function() NOEX");
                } catch (ex) {
                    log("statusToFile() - EXCEPTION!");
                    log(ex);
                    logError(ex);
                }
            });
            log("statusToFile() - END OF FIRST TRY (NO EX)");
        } catch (ex) {
            log("statusToFile() - EXCEPTION @ FIRST TRY");
            log(ex);
            logError(ex);
        }
    }


    /**
     * Logs debug data to console if DEBUG is set to true.
     * @param {String} message
     * @returns {undefined}
     */
    function log(message) {
        options.DEBUG_COUNT++;
        if (options.DEBUG === true) {
            var dt = getFormattedDateTime();
            if (typeof message === "object") {
                console.log("#" + options.DEBUG_COUNT + " - " + dt + " : -------------------");
                console.log(message);
            } else {
                console.log("#" + options.DEBUG_COUNT + " - " + dt + " : " + message);
            }
        }
    }

    function logError(message) {
        message = getFormattedDateTime() + " - " + message + "\n";
        var errorLogFilePath = options.ERROR_LOG_FILE;
        log(errorLogFilePath);
    }

    function getFormattedDateTime() {
        var rawDate = new Date();
        var year = rawDate.getFullYear();
        var month = rawDate.getMonth() + 1;
        var day = rawDate.getDate();
        var hour = rawDate.getHours();
        var minute = rawDate.getMinutes();
        var second = rawDate.getSeconds();
        if (month < 10)
            month = "0" + month;
        if (day < 10)
            day = "0" + day;
        if (hour < 10)
            hour = "0" + hour;
        if (minute < 10)
            minute = "0" + minute;
        if (second < 10)
            second = "0" + second;
        return year + "-" + month + "-" + day + "+" + hour + ":" + minute + ":" + second;
    }

    exports.pvcloudAPI = pvCloudAPI;
})();