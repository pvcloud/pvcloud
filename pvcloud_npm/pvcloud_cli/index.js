#! /usr/bin/env node

(function () {
    var DEBUG = false;

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
    }();

    var pvCloudCLModule = function () {
        if (process.argv.length > 2) {
            var parameters = populateParameters();

            console.log(parameters);
            executeAsCommandLine(parameters);
        } else {
            throw ("Missing parameters");
        }


        function executeAsCommandLine(parameters) {
            var action = process.argv[2];
            switch (action) {

                case "write":
                    pvCloudAPI.Write(parameters.label, parameters.value, parameters.type, parameters.captured_datetime);
                    break;
                case "post_file":
                    pvCloudAPI.PostFile(parameters.label, parameters.file_path, parameters.captured_datetime);
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
            var params = [];
            process.argv.forEach(function (val, index /*, array*/) {
                /*  
                 *  index 0: a reference to the running node program
                 *  index 1: a reference to the JS program being executed
                 *  index 2 and beyond: parameters passed to the program
                 */

                if (index >= 2) {
                    params.push(val);
                }//END IF
            }); //END FOREACH

            log("Parameters Captured:");
            log(params);

            if (params.debug) {
                DEBUG = params.debug;
            }

            return params;
        }



        return pvCloudAPI;
    }();
})();


