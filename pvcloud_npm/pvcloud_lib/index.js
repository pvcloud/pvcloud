(function () {
    var request = require("request");
    var fs = require('fs');
    var parameters = {
        async: false
    };

    var DEBUG = false;
    /**
     * Wraps the inner call of an HTTP Request
     * @param {type} url URL to call
     * @param {type} successCallback Function to call when HTTP Request is successful (Status code 200). Receives parameters response, body, error
     * @param {type} errorCallback Function to call when HTTP Request is NOT successful (Status code not 200). Receives parameters response, body, error
     * @param {type} finallyCallback Function to call at the end of the process, passing parameters response, body, error
     * @returns {undefined}
     */
    function requestWrapper(url, successCallback, errorCallback, finallyCallback) {
        if (parameters.async) {
            resultToFile(parameters.label, "PVCLOUD_WAITING_FOR_RESPONSE");
        }

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

    function requestWrapperPost(url, successCallback, errorCallback, finallyCallback, label, path, captured_datetime) {
        log("requestWrapper()");
        log("URL: ");
        log(url);

        if (parameters.async) {
            resultToFile(parameters.label, "PVCLOUD_WAITING_FOR_RESPONSE");
        }

        var fileRead = fs.createReadStream(path);

        var formData = {
            vse_label: label,
            captured_datetime: captured_datetime,
            app_id: app_id,
            account_id: account_id,
            api_key: api_key,
            fileToUpload: fileRead

        };

        request.post({url: url, formData: formData}, function (error, response, body) {
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

    function OutputResult(result) {
        log("OutputResult---------------------------");
        log(result);
        if (parameters.async) { //OUTPUT RESULT IN BASIC LANGUAGE TO FILE
            resultToFile(parameters.label, result);
        }
    }

    function resultToFile(tag, result) {
        if (!tag)
            tag = "any";

        var filePath = parameters.async_path || "";

        log("WRITING TO FILE...");

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
            log("END OF resultToFile()");
        } catch (ex) {
            errorLog(ex);
        }
    }

    /**
     * Reads content of a result file.
     * @param {string} tag
     * @param {function receives (err, data) parameters} callback
     * @returns {undefined}
     */
    function readResultFromFile(tag, callback) {
        var filePath = parameters.async_path || "";
        var resultFile = filePath + "/out_pvcloud_" + tag + ".txt";
        log("READING FROM FILE...");
        log(resultFile);

        fs.readFile(resultFile, callback);
    }

    /**
     * Logs debug data to console if DEBUG is set to true.
     * @param {String} message
     * @returns {undefined}
     */
    function log(message) {
        if (DEBUG) {
            console.log(message);
        }
    }

    function errorLog(message) {
        message = getFormattedDateTime() + " - " + message;
        message += "\n";
        log("errorLog()");

        var errorLogFilePath = parameters.error_log_file || "/error_pvcloud.log";
        log(errorLogFilePath);
    }

    var pvCloudAPI = {
        test: function () {
            return "SIMPLE SMOKE TEST";
        },
        /**
         * Sends a value "asynchronously" using the file-based mechanism. 
         * @param {string} label
         * @param {string, integer, long, json simple object} value
         * @param {string} type
         * @param {datetime} captured_datetime
         * @param {function} successCallback
         * @param {function} errorCallback
         * @param {function} finallyCallback
         * @returns {undefined}
         */
        Write: function (baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback, debugOption) {
            var wsURL = baseURL;
            wsURL += "vse_add_value.php";
            wsURL += '?app_id=' + app_id;
            wsURL += '&api_key=' + api_key;
            wsURL += '&account_id=' + account_id;
            wsURL += '&label=' + label;
            wsURL += '&value=' + value;
            wsURL += '&type=' + type;
            wsURL += '&captured_datetime=' + captured_datetime;

            requestWrapper(wsURL, successCallback, errorCallback, finallyCallback);
        },
        /**
         * Post File Mechanism
         * @param {type} label
         * @param {type} file_path
         * @param {type} captured_datetime
         * @param {type} successCallback
         * @param {type} errorCallback
         * @param {type} finallyCallback
         * @returns {undefined}
         */
        PostFile: function (label, file_path, captured_datetime, successCallback, errorCallback, finallyCallback) {
            var wsURL = baseURL += "vse_add_file.php";
            log(wsURL);

            log("CALLING REQUEST WRAPPER POST--------------------------------------------");

            requestWrapperPost(wsURL, successCallback, errorCallback, finallyCallback, label, file_path, captured_datetime);

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
            log("consoleAPI.Read('" + label + "')");
            var wsURL = baseURL;
            wsURL += "vse_get_value_last.php";
            wsURL += '?app_id=' + app_id;
            wsURL += '&api_key=' + api_key;
            wsURL += '&account_id=' + account_id;
            wsURL += '&optional_label=' + label;
            requestWrapper(wsURL, successCallback, errorCallback, finallyCallback);
        },
        /**
         * Reads the results of an request operation (file determined by tag/label) and prints its value to the console.
         * @param {string} label the tag for determining the file name.
         * @returns {undefined}
         */
        Check: function (label) {
            log("consoleAPI.Check('" + label + "')");
            readResultFromFile(label, function (err, data) {
                if (err) {
                    errorLog(err);
                    console.log("PVCLOUD_ERROR");
                } else {
                    console.log(data);
                }
            });
        }
    };

    exports.pvcloudAPI = pvCloudAPI;

})();