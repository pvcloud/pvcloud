(function () {
    var request = require("request");
    var options = {
        DEBUG: false,
        DEBUG_COUNT: 0
    };
    var pvCloudAPI = function () {
        return{
            test: function () {
                return "SIMPLE SMOKE TEST";
            },
            /**
             * Performs a LOGIN operation to a target pvCloud server defined in baseURL
             * @param {type} baseURL target pvCloud Server
             * @param {type} userName user account
             * @param {type} password password
             * @param {type} successCallback callback function for successful web service call. Receives (error, response, body) signature. body.data contains login results. When successful it contains also temporarly login token.
             * @param {type} errorCallback callback function for error web service call. Receives (error, response, body) signature
             * @param {type} finallyCallback callback function to be executed whether there was an error or not. Receives (error, response, body) signature
             * @returns {undefined}
             */
            Login: function (baseURL, userName, password, successCallback, errorCallback, finallyCallback) {
                var loginURL = baseURL + "vse.php/login";
                var PostData = {email: userName, pwd: password};
                postWrapper(loginURL, PostData, successCallback, errorCallback, finallyCallback);
            },
            /**
             * Obtains the data required for connecting an IoT Element to an IoT App
             * @param {type} baseURL pvCloud Server Instance
             * @param {type} account_id Account that owns the App to connect to
             * @param {type} loginToken Active token obtained on a previous login interaction
             * @param {type} elementKey Active long-term element key identificator to be used instead of a login token
             * @param {type} app_id ID of the app to connect
             * @param {type} app_name Name of the app to connect to be used instead of the app_id (app named under the context of the account)
             * @param {type} successCallback Callback function to process successful connect interaction. Receives error, response, body. Where body.data contains the information required to perform long term connection to an ioT App.
             * @param {type} errorCallback
             * @param {type} finallyCallback
             * @returns {undefined}
             */
            Connect: function (baseURL, account_id, loginToken, elementKey, app_id, app_name, successCallback, errorCallback, finallyCallback) {
                var appConnectURL = baseURL + "vse.php/connect";
                var PostData = {
                    account_id: account_id,
                    token: loginToken,
                    element_key: elementKey,
                    app_id: app_id,
                    app_name: app_name
                };
                postWrapper(appConnectURL, PostData, successCallback, errorCallback, finallyCallback);
            }
        };

    }();

    function postWrapper(url, postData, successCallback, errorCallback, finallyCallback) {
        log("requestWrapper()");
        log("URL: ");
        log(url);
        request.post({url: url, formData: postData}, function (error, response, body) {
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