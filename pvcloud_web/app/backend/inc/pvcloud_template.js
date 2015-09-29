/**
 * node pvcloud_api.js action=add_value value="abc 123" label="pvCloud_TEST" type="ALPHA OR WATEVER"
 */

var request = require('request');
var fs = require('fs');
var pvCloudModule = function (app_id, api_key, account_id, baseURL) {
    var DEBUG = false;
    var pvCloudAPI = function () {
        return {
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
            Write: function (label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback) {
                log("consoleAPI.Write('" + label + "','" + value + "','" + type + "')");
                var wsURL = baseURL;
                wsURL += "vse_add_value.php";
                wsURL += '?app_id=' + app_id;
                wsURL += '&api_key=' + api_key;
                wsURL += '&account_id=' + account_id;
                wsURL += '&label=' + label;
                wsURL += '&value=' + value;
                wsURL += '&type=' + type;
                wsURL += '&captured_datetime=' + captured_datetime;
                log(wsURL);

                log("CALLING REQUEST WRAPPER--------------------------------------------");
                requestWrapper(wsURL, successCallback, errorCallback, finallyCallback);
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
    }();
    var parameters = {};

    commandLineExecution();


    /* PRIVATE FUNCTIONS */
    function commandLineExecution() {
        log("started");
        log("process.argv: ");
        log(process.argv);
        app_id = app_id || 0;
        api_key = api_key || "";
        account_id = account_id || 0;
        baseURL = baseURL || "";

        parameters = populateParameters();

        var paramValidation = validateParameters();

        switch (paramValidation) {
            case "": //NO VALIDATION ERRORS
                log("PARAM VALIDATION SUCCESSFUL");
                log(parameters);
                executeAction();
                break;
            default:
                log("UNHANDLED VALIDATION ERROR");
                log(paramValidation);
                OutputResult(paramValidation);
        }
    }

    /**
     * Resolves parameters in command call and returns them.
     * Valid parameters include:
     * action=write,read,check
     * debug=true/false
     * async=true/false
     * label="some text"
     * value="some text"
     * type="some text"
     * captured_datetime="yyyy-mm-dd hh:mm:ss"
     * async_path="/some/file/path"
     * @returns {SimpleObject}
     */
    function populateParameters() {
        log("captureParameters()");
        var params = {};
        process.argv.forEach(function (val, index /*, array*/) {
            /*  
             *  index 0: a reference to the running node program
             *  index 1: a reference to the JS program being executed
             *  index 2 and beyond: parameters passed to the program
             */

            if (index >= 2) {
                var param = val.split("=");
                params[param[0]] = param[1];
            }//END IF
        }); //END FOREACH

        log("Parameters Captured:");
        log(params);

        if (params.debug) {
            DEBUG = params.debug;
        }

        return params;
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

    /**
     * Validates paramameters and sets defaults
     * @returns {String} String containing the first error found during validation or empty string if there was no errors found.
     */
    function validateParameters() {
        var action = parameters.action;
        switch (action) {
            case "write":
                log("VALIDATE PARAMS: write");

                if (parameters.label === undefined) {
                    return("PVCLOUD_ERR: MISSING LABEL");
                }

                if (parameters.value === undefined) {
                    return "PVCLOUD_ERROR: MISSING VALUE";
                }

                if (parameters.type === undefined) {
                    parameters.type = "TEXT";
                }

                if (parameters.captured_datetime === undefined) {
                    parameters.captured_datetime = getFormattedDateTime();
                } else {
                    var pattern01 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2})/;
                    var pattern02 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2}):(\d)/;
                    if (!parameters.captured_datetime.match(pattern01) && !parameters.captured_datetime.match(pattern02)) {
                        return "PVCLOUD_ERR: WRONG PATTERN IN CAPTURED DATETIME";
                    }
                }

                break;

            case "read":
                log("VALIDATE PARAMS: read");
                if (parameters.label === undefined)
                    parameters.label = "";
                break;

            case "add_value":
                log("VALIDATE PARAMS: ADD VALUE ACTION");
                if (parameters.value === undefined) {
                    return "PVCLOUD_ERR: MISSING VALUE";
                }

                if (parameters.label === undefined) {
                    return "PVCLOUD_ERR: MISSING LABEL";
                }

                if (parameters.type === undefined) {
                    parameters.type = "TEXT";
                }

                if (parameters.captured_datetime === undefined) {
                    parameters.captured_datetime = getFormattedDateTime();
                } else {
                    var pattern01 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2})/;
                    var pattern02 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2}):(\d)/;
                    if (!parameters.captured_datetime.match(pattern01) && !parameters.captured_datetime.match(pattern02)) {
                        return "PVCLOUD_ERR: WRONG PATTERN IN CAPTURED DATETIME";
                    }
                }
                break;
            case "get_last_value":
                log("VALIDATE PARAMS: GET LAST VALUE");
                if (parameters.label === undefined)
                    parameters.label = "";
                break;
            case "get_last_value_simple":
                log("VALIDATE PARAMS: GET LAST VALUE SIMPLE");
                if (parameters.label === undefined)
                    parameters.label = "";
                break;
            case "get_values":
                log("VALIDATE PARAMS: GET VALUES");
                if (parameters.label === undefined)
                    parameters.label = "";
                break;
            case "clear_values":
                log("VALIDATE PARAMS: CLEAR VALUES");
                if (parameters.label === undefined)
                    parameters.label = "";
                break;
            default:
                return "PVCLOUD_ERR: UNKNOWN ACTION ==>" + action;
        }

        return "";
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

        fs.appendFile(errorLogFilePath, message, function (err) {
            if (err) {
                console.log(err);
                console.log("ERROR @ errorLog()");
                console.log("Try adding an error_log_file parameter");
                console.log(err);
            }
        });

    }

    function executeAction() {
        switch (parameters.action) {
            case "write":
                pvCloudAPI.Write(parameters.label, parameters.value, parameters.type, parameters.captured_datetime);
                break;
            case "read":
                pvCloudAPI.Read(parameters.label);
                break;
            case "check":
                pvCloudAPI.Check(parameters.label);
                break;
            case "add_value":
                pvCloud_AddValue(parameters.label, parameters.value, parameters.type, parameters.captured_datetime);
                break;
            case "get_last_value":
                pvCloud_GetLastValue(parameters.label);
                break;
            case "get_last_value_simple":
                pvCloud_GetLastValue_Simple(parameters.label, parameters.resultFile);
                break;
            case "get_values":
                pvCloud_GetValues(parameters.label, parameters.last_limit);
                break;
            case "clear_values":
                pvCloud_ClearValues(parameters.label);
                break;
        }
    }

    function OutputResult(result) {
        log("OutputResult---------------------------");
        log(result);
        if (parameters.async) { //OUTPUT RESULT IN BASIC LANGUAGE TO FILE
            resultToFile(parameters.label, result);
        }

        console.log(result);
    }

    function    resultToFile(tag, result) {
        if (!tag)
            tag = "any";

        var filePath = parameters.async_path || "";

        log("WRITING TO FILE...");

        try {
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



    function pvCloud_AddValue(label, value, type, captured_datetime, callback) {
        log("pvCloud_AddValue()");
        var wsURL = baseURL;
        wsURL += "vse_add_value.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;
        wsURL += '&label=' + label;
        wsURL += '&value=' + value;
        wsURL += '&type=' + type;
        wsURL += '&captured_datetime=' + captured_datetime;
        log(wsURL);
        log("CALLING REQUEST!!!--------------------------------------------");
        requestWrapper(wsURL, undefined, undefined, callback);
    }

    function pvCloud_ClearValues(label, callback) {
        log("pvCloud_ClearValues");
        var wsURL = baseURL;
        wsURL += "vse_clear_values.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;
        wsURL += '&optional_label=' + label;
        requestWrapper(wsURL, undefined, undefined, callback);
    }

    function pvCloud_GetLastValue(label, callback) {
        log("pvCloud_GetLastValue");
        var wsURL = baseURL;
        wsURL += "vse_get_value_last.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;
        wsURL += '&optional_label=' + label;
        requestWrapper(wsURL, undefined, undefined, callback);
    }

    function pvCloud_GetLastValue_Simple(label, callback) {
        log("pvCloud_GetLastValue_Simple");
        var wsURL = baseURL;
        wsURL += "vse_get_value_last.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;
        wsURL += '&optional_label=' + label;
        var onsuccess = function (response, body, error) {
            try {
                var responseObject = JSON.parse(body);
                if (responseObject) {
                    var value = responseObject.vse_value;
                    outputResult(label, value);
                } else {
                    var errorMessage = "PVCLOUD_ERR: LABEL NOT FOUND";
                    outputResult(label, errorMessage);
                }
            } catch (ex) {
                outputResult(label, ex);
            }
        };
        outputResult(label, "PVCLOUD_WAITING_FOR_RESPONSE");
        requestWrapper(wsURL, onsuccess/*NOTICE THIS!!!*/, undefined, callback);
    }

    function pvCloud_GetValues(label, last_limit, callback) {
        log("pvCloud_GetValues");
        var wsURL = baseURL;
        wsURL += "vse_get_values.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;
        wsURL += '&optional_label=' + label;
        wsURL += '&optional_limit=' + last_limit;
        requestWrapper(wsURL, undefined, undefined, callback);
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


    return {
        SimpleAPI: pvCloudAPI,
        Add: pvCloud_AddValue,
        Clear: pvCloud_ClearValues,
        GetLastValue: pvCloud_GetLastValue,
        GetValues: pvCloud_GetValues
    };
};
