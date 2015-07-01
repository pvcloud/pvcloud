/**
 * node pvcloud_api.js action=add_value value="abc 123" value_label="pvCloud_TEST" value_type="ALPHA OR WATEVER" captured_datetime="2014-12-19+12:27"
 */

var request = require('request');

var pvCloudModule = function (app_id, api_key, account_id, baseURL) {
    var DEBUG = false;

    log("started");
    log("process.argv: ");
    log(process.argv);

    app_id = app_id || 0;
    api_key = api_key || "";
    account_id = account_id || 0;
    baseURL = baseURL || "";

    var parameters = captureParameters();

    if (validateParameters()) {
        switch (parameters.action) {
            case "add_value":
                pvCloud_AddValue(parameters.value_label, parameters.value, parameters.value_type, parameters.captured_datetime);
                break;
            case "get_last_value":
                pvCloud_GetLastValue(parameters.value_label);
                break;
            case "get_last_value_simple":
                pvCloud_GetLastValue_Simple(parameters.value_label);
                break;                
            case "get_values":
                pvCloud_GetValues(parameters.value_label, parameters.last_limit);
                break;
            case "clear_values":
                pvCloud_ClearValues(parameters.value_label);
                break;
        }
    }


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

    function validateParameters() {
        var action = parameters.action;
        switch (action) {
            case "add_value":
                if (parameters.value === undefined)
                    throw("Invalid or missing parameter for action add_value: value");
                if (parameters.value_label === undefined)
                    throw("Invalid or missing parameter for action add_value: value_label");
                if (parameters.value_type === undefined)
                    throw("Invalid or missing parameter for action add_value: value_type");
                if (parameters.captured_datetime === undefined)
                    throw("Invalid or missing parameter for action add_value: captured_datetime");
                else {
                    var pattern01 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2})/;
                    var pattern02 = /(\d{4})-(\d{2})-(\d{2})\+(\d{2}):(\d{2}):(\d)/;
                    if (!parameters.captured_datetime.match(pattern01) && !parameters.captured_datetime.match(pattern02)) {
                        throw("Invalid or missing parameter for action add_value: captured_datetime. Wrong Pattern");
                    }
                }
                break;
            case "get_last_value":
                if (parameters.value_label === undefined)
                    parameters.value_label = "";
                break;
            case "get_last_value_simple":
                if (parameters.value_label === undefined)
                    parameters.value_label = "";
                break;                
            case "get_values":
                if (parameters.value_label === undefined)
                    parameters.value_label = "";
                break;
            case "clear_values":
                if (parameters.value_label === undefined)
                    parameters.value_label = "";
                break;
            default:
                //throw ("Invalid Action");
        }

        return true;
    }

    function log(message) {
        if (DEBUG) {
            console.log(message);
        }
    }

    function pvCloud_AddValue(value_label, value, value_type, captured_datetime, callback) {
        log("AddValue()");
        var wsURL = baseURL;
        wsURL += "vse_add_value.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;

        wsURL += '&label=' + value_label;
        wsURL += '&value=' + value;
        wsURL += '&type=' + value_type;
        wsURL += '&captured_datetime=' + captured_datetime;

        log(wsURL);

        request(wsURL, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log(body);
            } else {
                console.log(response);
                console.log(error);
            }
            if (callback) {
                callback(error, response, body);
            }
        });
    }

    function pvCloud_ClearValues(value_label, callback) {
        var wsURL = baseURL;
        wsURL += "vse_clear_values.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;

        wsURL += '&optional_label=' + value_label;

        request(wsURL, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log(body);
            } else {
                console.log(response);
                console.log(error);
            }
            if (callback) {
                callback(error, response, body);
            }
        });
    }

    function pvCloud_GetLastValue(value_label, callback) {
        var wsURL = baseURL;
        wsURL += "vse_get_value_last.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;

        wsURL += '&optional_label=' + value_label;

        request(wsURL, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log(body);
            } else {
                console.log(response);
                console.log(error);
            }
            if (callback) {
                callback(error, response, body);
            }
        });
    }
    
    function pvCloud_GetLastValue_Simple(value_label, callback) {
        var wsURL = baseURL;
        wsURL += "vse_get_value_last.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;

        wsURL += '&optional_label=' + value_label;

        request(wsURL, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log(JSON.parse(body).vse_value);
            } else {
                console.log(response);
                console.log(error);
            }
            if (callback) {
                callback(error, response, body);
            }
        });
    }    
    

    function pvCloud_GetValues(value_label, last_limit, callback) {
        var wsURL = baseURL;
        wsURL += "vse_get_values.php";
        wsURL += '?app_id=' + app_id;
        wsURL += '&api_key=' + api_key;
        wsURL += '&account_id=' + account_id;

        wsURL += '&optional_label=' + value_label;
        wsURL += '&optional_last_limit=' + last_limit;

        request(wsURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body);
            } else {
                console.log(response);
                console.log(error);
            }
            if (callback) {
                callback(error, response, body);
            }
        });
    }

    return {
        Add: pvCloud_AddValue,
        Clear: pvCloud_ClearValues,
        GetLastValue: pvCloud_GetLastValue,
        GetValues: pvCloud_GetValues
    };
};