(function () {
    var request = require("request");
    var fs = require("fs");
    var options = {
        DEBUG: true,
        DEBUG_COUNT: 0
    };
    var pvCloudAPI = function () {
        return{
            test: function () {
                return "SIMPLE SMOKE TEST";
            },
            /**
             * Connects an IoT Element to an App, using provided data for authentication and verification, all in one single transaction.
             * @param {string} baseURL URL to pvCloud Server Instance
             * @param {string or int} account_descriptor Either Account ID or Email
             * @param {string or int} app_descriptor Either AppID or AppName. If AppName is used, it only matches apps of specific account provided.
             * @param {string or int} secret Either account password, one-time-passcode or app_key
             * @param {string} element_key Existing element_key to be reused. Element will be disconnected from previous app and assigned to the requested app.
             * @param {function} successCallback Function to process successful call
             * @param {function} errorCallback Function to process errors
             * @param {function} finallyCallback Function always called to wrap up
             * @returns {undefined}
             */
            Connect: function (baseURL, account_descriptor, app_descriptor, secret, element_key, successCallback, errorCallback, finallyCallback) {
                log("CONNECT!");
                var appConnectURL = baseURL + "/backend/vse.php/connect";
                var PostData = {
                    account_descriptor: account_descriptor,
                    app_descriptor: app_descriptor,
                    secret: secret,
                    element_key: element_key
                };
                try {
                    log("CALLING POST WRAPPER");
                    postWrapper(appConnectURL, PostData, successCallback, errorCallback, finallyCallback);
                    log("POST WRAPPER CALL RETURNED!");
                } catch (ex) {
                    log("EEEERRRRROOOORRR");
                    log(ex);
                    errorCallback(ex);
                    finallyCallback();
                }
                
                log("DONE WITH CONNECT!!! JUST WAIT FOR CALLBACKS");
            },
            /**
             * Sends data to a pvcloud server for specific app, label and value
             * @param {type} baseURL
             * @param {type} app_id
             * @param {type} app_key
             * @param {type} element_key
             * @param {type} label
             * @param {type} value
             * @param {type} captured_datetime
             * @param {type} successCallback
             * @param {type} errorCallback
             * @param {type} finallyCallback
             * @returns {undefined}
             */
            Write: function (baseURL, app_id, app_key, element_key, label, value, captured_datetime, successCallback, errorCallback, finallyCallback) {
                var appConnectURL = baseURL + "/backend/vse.php/appdata/" + app_id + "/" + app_key + "/" + element_key;

                if (!captured_datetime) {
                    captured_datetime = getFormattedDateTime();
                }

                var PostData = {
                    label: label,
                    value: value,
                    captured_datetime: captured_datetime
                };
                postWrapper(appConnectURL, PostData, successCallback, errorCallback, finallyCallback);
            },
            /**
             * Sends data to a pvcloud server for specific app, label and value
             * @param {type} baseURL
             * @param {type} app_id
             * @param {type} app_key
             * @param {type} element_key
             * @param {type} label
             * @param {type} filePath
             * @param {type} captured_datetime
             * @param {type} successCallback
             * @param {type} errorCallback
             * @param {type} finallyCallback
             * @returns {undefined}
             */
            SendFile: function (baseURL, app_id, app_key, element_key, label, filePath, captured_datetime, successCallback, errorCallback, finallyCallback) {
                var appConnectURL = baseURL + "/backend/vse.php/appfiles/" + app_id + "/" + app_key + "/" + element_key;

                if (!captured_datetime) {
                    captured_datetime = getFormattedDateTime();
                }

                var fileRead = fs.createReadStream(filePath);

                var PostData = {
                    label: label,
                    vse_file: fileRead,
                    captured_datetime: captured_datetime
                };
                postWrapper(appConnectURL, PostData, successCallback, errorCallback, finallyCallback);
            },
            Read: function (baseURL, app_id, app_key, element_key, label, count, successCallback, errorCallback, finallyCallback) {
                var targetURL = baseURL + "/backend/vse.php/appdata/" + app_id + "/" + app_key + "/" + element_key;
                if (label)
                    targetURL += "/" + label;
                if (count)
                    targetURL += "/" + count;

                getWrapper(targetURL, successCallback, errorCallback, finallyCallback);
            },
            Delete: function (baseURL, app_id, app_key, element_key, label, count, successCallback, errorCallback, finallyCallback) {
                var targetURL = baseURL + "/backend/vse.php/appdata/" + app_id + "/" + app_key + "/" + element_key;
                if (label)
                    targetURL += "/" + label;
                if (count)
                    targetURL += "/" + count;

                deleteWrapper(targetURL, successCallback, errorCallback, finallyCallback);
            }

        };
    }();

    function postWrapper(url, postData, successCallback, errorCallback, finallyCallback) {
        log("requestWrapper()");
        log("URL: ");
        log(url);
        log(successCallback);
        log(errorCallback);
        log(finallyCallback);

        request.post({url: url, formData: postData}, function (error, response, body) {
            if (!error && response && response.statusCode === 200) {
                log("SUCCESSFUL REQUEST AND RESPONSE.body");
                log(JSON.parse(body));
                if (successCallback){
                    log("CALLING SUCESS CALLBACK");
                    successCallback(error, response, body);
                }
            } else if (error) {
                if (errorCallback) {
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
                    logError("PVCLOUD_ERROR");
                }

            } else if (error) {
                log("ERROR:------------------------------------------------");
                log(error);
                log("PVCLOUD ERROR PROCESSING:-----------------------------");
                logError(error);
                if (errorCallback)
                    errorCallback(error, response, body);
                else {
                    logError("PVCLOUD_ERROR");
                }
            } else {
                log("UNKNOWN FAILURE:---------------------------------------");
                log(error);
                logError(response);
                if (errorCallback)
                    errorCallback(error, response, body);
                else
                    logError("PVCLOUD_FAILURE");
            }

            if (finallyCallback)
                finallyCallback(error, response, body);
        });
    }

    function getWrapper(url, successCallback, errorCallback, finallyCallback) {
        log("requestWrapper()");
        log("URL: ");
        log(url);
        request.get({url: url}, function (error, response, body) {
            if (!error && response && response.statusCode === 200) {
                log("SUCCESS!!!--------------------------------------------");
                if (successCallback)
                    successCallback(error, response, body);
            } else if (error) {
                if (errorCallback) {
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
                    logError("PVCLOUD_ERROR");
                }

            } else if (error) {
                log("ERROR:------------------------------------------------");
                log(error);
                log("PVCLOUD ERROR PROCESSING:-----------------------------");
                logError(error);
                if (errorCallback)
                    errorCallback(error, response, body);
                else {
                    logError("PVCLOUD_ERROR");
                }
            } else {
                log("UNKNOWN FAILURE:---------------------------------------");
                log(error);
                logError(response);
                if (errorCallback)
                    errorCallback(error, response, body);
                else
                    logError("PVCLOUD_FAILURE");
            }

            if (finallyCallback)
                finallyCallback(error, response, body);
        });
    }

    function deleteWrapper(url, successCallback, errorCallback, finallyCallback) {
        log("requestWrapper()");
        log("URL: ");
        log(url);
        request.del({url: url}, function (error, response, body) {
            if (!error && response && response.statusCode === 200) {
                log("SUCCESS!!!--------------------------------------------");
                if (successCallback)
                    successCallback(error, response, body);
            } else if (error) {
                if (errorCallback) {
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
                    logError("PVCLOUD_ERROR");
                }

            } else if (error) {
                log("ERROR:------------------------------------------------");
                log(error);
                log("PVCLOUD ERROR PROCESSING:-----------------------------");
                logError(error);
                if (errorCallback)
                    errorCallback(error, response, body);
                else {
                    logError("PVCLOUD_ERROR");
                }
            } else {
                log("UNKNOWN FAILURE:---------------------------------------");
                log(error);
                logError(response);
                if (errorCallback)
                    errorCallback(error, response, body);
                else
                    logError("PVCLOUD_FAILURE");
            }

            if (finallyCallback)
                finallyCallback(error, response, body);
        });
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