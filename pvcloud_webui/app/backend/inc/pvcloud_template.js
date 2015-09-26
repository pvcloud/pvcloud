/**
 * node pvcloud_api.js action=add_value value="abc 123" label="pvCloud_TEST" type="ALPHA OR WATEVER"
 */

var request = require('request');
var pvCloudModule = function (app_id, api_key, account_id, baseURL) {


    var DEBUG = false;
    var executeNow = function () {
        log("started");
        log("process.argv: ");
        log(process.argv);
        app_id = app_id || 0;
        api_key = api_key || "";
        account_id = account_id || 0;
        baseURL = baseURL || "";
        var parameters = captureParameters();
        if (parameters.debug) {
            DEBUG = parameters.debug;
        }

        if (validateParameters(parameters)) {
            log("-----------------------------------------");
            log("-----------------------------------------");
            log("VALIDATED PARAMS");
            log(parameters);
            switch (parameters.action) {
                case "add_value":
                    pvCloud_AddValue(parameters.label, parameters.value, parameters.type, parameters.captured_datetime);
                    break;
                case "get_last_value":
                    pvCloud_GetLastValue(parameters.label);
                    break;
                case "get_last_value_simple":
                    pvCloud_GetLastValue_Simple(parameters.label);
                    break;
                case "get_values":
                    pvCloud_GetValues(parameters.label, parameters.last_limit);
                    break;
                case "clear_values":
                    pvCloud_ClearValues(parameters.label);
                    break;
            }
        }
    }();

    /* PRIVATE FUNCTIONS */
    function captureParameters() {
        log("captureParameters()");
        var parameters = {};
        process.argv.forEach(function (val, index /*, array*/) {
            /*  
             *  index 0: a reference to the running node program
             *  index 1: a reference to the JS program being executed
             *  index 2 and beyond: parameters passed to the program
             */

            if (index >= 2) {
                var param = val.split("=");
                parameters[param[0]] = param[1];
            }//END IF
        }); //END FOREACH

        log("Parameters Captured:");
        log(parameters);
        return parameters;
    }

    function validateParameters(parameters) {
        var action = parameters.action;
        switch (action) {
            case "add_value":
                log("VALIDATE PARAMS: ADD VALUE ACTION");
                if (parameters.value === undefined) {
                    console.log("PVCLOUD_ERR: MISSING VALUE");
                    return false;
                }

                if (parameters.label === undefined) {
                    console.log("PVCLOUD_ERR: MISSING LABEL");
                    return false;
                }

                if (parameters.type === undefined) {
                    parameters.type = "TEXT";
                }

                if (parameters.captured_datetime === undefined) {
                    var rawDate = new Date();
                    var year = rawDate.getFullYear();
                    var month = rawDate.getMonth();
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
                    parameters.captured_datetime = year + "-" + month + "-" + day + "+" + hour + ":" + minute + ":" + second;
                } else {
                    var pattern01 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2})/;
                    var pattern02 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2}):(\d)/;
                    if (!parameters.captured_datetime.match(pattern01) && !parameters.captured_datetime.match(pattern02)) {
                        console.log("PVCLOUD_ERR: WRONG PATTERN IN CAPTURED DATETIME");
                        return false;
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
                console.log("PVCLOUD_ERR: UNKNOWN ACTION ==>" + action);
                return false;
        }

        return true;
    }

    function log(message) {
        if (DEBUG) {
            console.log(message);
        }
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
                    console.log(value);
                } else {
                    console.log("PVCLOUD_ERR: LABEL NOT FOUND");
                }

            } catch (ex) {
                console.log("PVCLOUD_ERR: " + ex);
            }
        };

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
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                log("SUCCESS!!!--------------------------------------------");
                if (successCallback)
                    successCallback(response, body, error);
                else
                    console.log(body);
            } else {
                log("ERROR!!!----------------------------------------------");
                log("STATUS CODE:" + response.statusCode);
                log("RESPONSE:---------------------------------------------");
                log(response);
                log("ERROR:------------------------------------------------");
                log(error);
                log("PVCLOUD ERROR PROCESSING:-----------------------------");
                if (error) {
                    console.log("PVCLOUD_ERR: " + error);
                } else {
                    console.log("PVCLOUD_ERR: " + response);
                }

                if (errorCallback)
                    errorCallback(response, body, error);
            }

            if (finallyCallback)
                finallyCallback(response, body, error);
        });
    }

    return {
        Add: pvCloud_AddValue,
        Clear: pvCloud_ClearValues,
        GetLastValue: pvCloud_GetLastValue,
        GetValues: pvCloud_GetValues
    };
};