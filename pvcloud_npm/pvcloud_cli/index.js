#! /usr/bin/env node

(function () {
    var options = {
        DEBUG: true,
        DEBUG_COUNT: 0
    };
    var pvcloud = require("pvcloud_lib").pvcloudAPI;
    var fs = require("fs");
    var pvCloudCLModule = function () {

        var configFilePath = "./config.json";

        var currentConfig = {};

        var defaultConfig = {
            DeviceName: "",
            BaseURL: "",
            AppKey: "",
            ElementKey: ""
        };

        function commandLineExecution() {
            log("commandLineExecution()");
            var params = processParameters(process.argv);
            log(params);
            switch (params.action) {
                case "test":
                    options.DEBUG=true;
                    log("CLEx: test");
                    log(pvcloud.test());
                    log(pvcloud);
                    break;
                case "init":
                    log("CLEx: init");
                    init(params);
                    break;
                case "write":
                    log("CLEx: write");
                    if (!checkConfig())
                        return;
                    break;
            }
        }

        /**
         * This function processes parameters received from interpreter 
         * It supports 3 types of parameters:
         *    - Sequenced parameters (first one is "action", second one is "action modifier1" etc..
         *    - double-dash parameters (--simple, --version, etc)
         *    - named parameters (label="SENSOR1", base_url="http:myservice.com/pvcloud")
         * @param {array} argv parameters received from interpreter
         * @returns {nm$_index.index_L3.index_L7.processParameters.parameters}
         */
        function processParameters(argv) {
            var sequencedParametersIndex = 2;
            var parameters = {};

            for (var i = 2; i < argv.length; i++) {

                //1. LOOK FOR NAMED PARAMETER
                //2. LOOK FOR DOUBLE-DASH PARAMETER
                //3. LOOK FOR SEQUENCED PARAMETER

                currentParameter = argv[i];

                if (currentParameter.indexOf("=") >= 0) {//named parameter found
                    var separatedContent = currentParameter.split("=");
                    parameters[separatedContent[0]] = separatedContent[1];
                } else if (currentParameter.indexOf("--") >= 0) {//double-dash parameter found
                    var ddashPosition = currentParameter.indexOf("--");
                    var flagName = currentParameter.substring(ddashPosition + 2, currentParameter.length).trim();
                    parameters[flagName] = true;

                } else { // process as sequenced parameter
                    if (sequencedParametersIndex === 2 && !parameters.action) {
                        parameters.action = currentParameter;
                        sequencedParametersIndex++;
                    } else {
                        switch (parameters.action) {
                            case "init":
                                if (sequencedParametersIndex === 3 && !parameters.base_url) {
                                    parameters.base_url = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 4 && !parameters.username) {
                                    parameters.username = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 5 && !parameters.password) {
                                    parameters.password = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 6 && !parameters.app_descriptor) {
                                    parameters.app_descriptor = currentParameter;
                                    sequencedParametersIndex++;
                                }
                                break;
                            case "write":
                                if (sequencedParametersIndex === 3 && !parameters.label) {
                                    parameters.label = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 4 && !parameters.value) {
                                    parameters.value = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 5 && !parameters.captured_datetime) {
                                    parameters.captured_datetime = currentParameter;
                                    sequencedParametersIndex++;
                                }
                                break;
                            case "read":
                                if (sequencedParametersIndex === 3 && !parameters.label) {
                                    parameters.label = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 4 && !parameters.value) {
                                    parameters.value = currentParameter;
                                    sequencedParametersIndex++;
                                }
                                break;
                        }
                    }
                }
            }


            return parameters;
        }

        function checkConfig() {
            var configOnFile = loadConfig();
            if (!configOnFile || configOnFile.ElementKey === undefined) {
                console.log("PVCloud is not configured. Consider running the following command");
                console.log("    pvcloud init");
            }
        }
        function loadConfig() {

            fs.exists(configFilePath, function (exists) {
                if (exists) {
                    console.log("Config file found! Loading...");
                    return require(configFilePath);
                } else {
                    console.log("Config file missing! Creating file...");
                    var configString = JSON.stringify(defaultConfig);
                    fs.writeFile(configFilePath, configString);
                }
            });
        }

        function init(parameters) {
            log("init(parameters)");
            console.log("------------------------");
            console.log("- pvCloud INIT Routine -");
            console.log("------------------------");

            log("PUNTO 0");
            log(parameters);
            
            init_promptMissingParameters(parameters, function () {
                log("PUNTO 1");
                if (init_validateParameters(parameters)) {
                    log("VALIDATED PARAMETERS");
                    log(parameters);
                    init_executeAction(parameters);
                } else {
                    console.log("INVALID PARAMETERS");
                }

            });
        }

        function init_promptMissingParameters(parameters, callback) {
            log("PROMPT MISSING PARAMETERS");
            var promptSpec = [];
            if (!parameters.base_url) {
                promptSpec.push("Base URL");
            }

            if (!parameters.username) {
                promptSpec.push("Account");
            }
            if (!parameters.password) {
                promptSpec.push("Password");
            }
            if (!parameters.app_descriptor) {
                promptSpec.push("App Name or ID");
            }

            if (promptSpec.length > 0) {
                
                console.log("In this process we will collect configuration data to connect this instance of pvCloud Client to a pvCloud IoT App.");
                var prompt = require('prompt');
                prompt.start();
                prompt.get(promptSpec, function (err, result) {
                    parameters = fillParams(parameters, result, "Base URL", "base_url");
                    parameters = fillParams(parameters, result, "Account", "username");
                    parameters = fillParams(parameters, result, "Password", "password");
                    parameters = fillParams(parameters, result, "App Name or ID", "app_descriptor");
                    callback(parameters);
                    prompt.stop();
                });
            } else {
                callback(parameters);
            }

            function fillParams(parameters, resultContainer, promptKey, paramKey) {
                if (resultContainer[promptKey]) {
                    parameters[paramKey] = resultContainer[promptKey];
                }

                return parameters;
            }

        }

        function init_validateParameters(parameters) {
            return true;
        }

        function init_executeAction(parameters) {
            log("init_executeAction");
            log(parameters);
            switch (parameters.action) {
                case "init":
                    log("Executing INIT action");
                    init_login(parameters);
                    
                    //....
                    break;
            }
        }
        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        function init_login(parameters) {
            log("init_login()");
            pvcloud.Login(
                    parameters.base_url,
                    parameters.username,
                    parameters.password,
                    function (error, response, body) {//SUCCESS
                        var bodyObject = JSON.parse(response.body);
                        loginInfo = bodyObject.data;
                        parameters.account_id = loginInfo.account_id;
                        parameters.token = loginInfo.token;

                        init_connect(parameters);
                    },
                    function (error, response, body) {//ERROR
                        log("ERROR @ LOGIN");
                        log(error);
                        log(response.body);
                    },
                    function (error, response, body) {//FINALLY
                        console.log("FINALLY @ LOGIN");
                    });
        }
        function init_connect(parameters) {
            log("init_connect");
            var app_id = 0;
            var app_name = "";
            
            log(parameters);
            if (isNumeric(parameters.app_descriptor)) {
                app_id = parameters.app_descriptor;
            } else {
                app_name = parameters.app_descriptor;
            }

            pvcloud.Connect(
                    parameters.base_url,
                    parameters.account_id,
                    parameters.token,
                    "" /*element key*/,
                    app_id,
                    app_name,
                    function (error, request, body) { //SUCCESS
                        log("SUCCESS!");
                        log(body);
                    },
                    function (error, request, body) {//ERROR
                        console.log("ERROR @ CONNECT");
                        console.log(error);
                    },
                    function (error, request, body) {//FINALLY
                        console.log("FINALLY @ CONNECT");
                    });
        }

        function init_saveConfig(parameters) {

        }

        /**
         * Performs login action and outputs the result to the console.
         * @param {type} parameters Arguments are [3] = username, [4] = password, 
         * @returns {undefined}
         */
        function doLogin(parameters) {
            var username = parameters.username;
            var password = parameters.password;
            var baseURL = "http://crmakers.intel.com:8080/pvcloud_test/";
            console.log(parameters);
            return;
            var successCallback = function (error, request, body) {
                var result = body;
                if (parameters.simple) {
                    console.log(result);
                } else {
                    console.log(body.toke);
                }
            };
            var errorCallback = function (error, request, body) {
                console.log("ERROR");
                console.log(error);
            };
            var finallyCallback = function (error, request, body) {

            };

            pvcloud.Login(baseURL, username, password, successCallback, errorCallback, finallyCallback);
        }

        /**
         * Logs debug data to console if DEBUG is set to true.
         * @param {String} message
         * @returns {undefined}
         */


        function log(message) {
            if (options.DEBUG === true) {
                options.DEBUG_COUNT++;
                var dt = getFormattedDateTime();
                if (typeof message === "object") {
                    console.log("#" + options.DEBUG_COUNT + " - " + dt + " : -------------------");
                    console.log(message);
                } else {
                    console.log("#" + options.DEBUG_COUNT + " - " + dt + " : " + message);
                }
            }
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

        commandLineExecution();
        return {};
        ;
    }();
    exports.Client = pvCloudCLModule;
})();


