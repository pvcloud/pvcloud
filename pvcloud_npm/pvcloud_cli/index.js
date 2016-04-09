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
                    options.DEBUG = true;
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
         *    - Sequenced parameters (first one is "action", second one is "action modifier1" etc.
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
            log(parameters);

            log("Checking for missing parameters @ INIT...");
            init_promptMissingParameters(parameters, function () {
                log("init() - Validating Parameters...");
                if (init_validateParameters(parameters)) {
                    log("init() - Parameters are Valid.");
                    log(parameters);
                    init_Execute(parameters);
                } else {
                    console.log("INVALID PARAMETERS");
                }

            });
        }

        function init_promptMissingParameters(parameters, callback) {
            log("init_promptMissingParameters(parameters, callback)");

            var prompt = require('prompt');
            log(parameters);
            var promptSpec = {};
            var missingParamCount = 0;
            if (!parameters.base_url) {
                log("Base URL not provided as parameter... adding to prompt queue");
                promptSpec.base_url = {description: "Base URL"};
                missingParamCount++;
            }

            if (!parameters.username) {
                log("User Name not provided as parameter... adding to prompt queue");
                promptSpec.username = {description: "Account"};
                missingParamCount++;
            }
            if (!parameters.password) {
                log("Password not provided as parameter... adding to prompt queue");
                promptSpec.password = {description: "Type your password here:", hidden: true};
                missingParamCount++;
            }
            if (!parameters.app_descriptor) {
                log("App Descriptor not provided as parameter... adding to prompt queue");
                promptSpec.app_descriptor = {message: "App Name or ID"};
                missingParamCount++;
            }

            if (missingParamCount > 0) {
                log("Prompt Queue Size:" + missingParamCount);
                var schema = {};
                schema.properties = promptSpec;
                log(promptSpec);
                console.log("In this process we will collect configuration data to connect this instance of pvCloud Client to a pvCloud IoT App.");

                var prompt = require('prompt');

                prompt.start();
                prompt.get(schema, function (err, result) {
                    log(result);
                    log(parameters);

                    extendObject(parameters, result);
                    log("New PARAMETERS Object:");
                    log(parameters);
                    callback(parameters);
                    prompt.stop();
                });
            } else {
                log("Prompt Queue was empty. Calling callback...");
                callback(parameters);
            }
        }

        function init_validateParameters(parameters) {
            return true;
        }

        function init_Execute(parameters) {
            log("init_Execute()");
            log(parameters);

            init_login(parameters, function () {
                init_connect(parameters, function () {
                    init_save(parameters, function () {
                        log("INIT SEQUENCE SUCCESSFUL!");
                        log(parameters);
                    });
                });
            });
        }

        function isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        
        function extendObject(parameters, resultContainer) {
            for (var propertyname in resultContainer) {
                parameters[propertyname] = resultContainer[propertyname];
            }
        }
        
        function init_login(parameters, callback) {
            log("init_login()");
            pvcloud.Login(
                    parameters.base_url,
                    parameters.username,
                    parameters.password,
                    function (error, response, body) {//SUCCESS
                        log("pvcloud.Login > Success. Parsing result...");
                        var bodyObject = JSON.parse(body);
                        log("Parsed Body:   ");
                        log(bodyObject);

                        if (bodyObject.status === "OK") {
                            log("Status is OK. Grabing Login Info...");
                            loginInfo = bodyObject.data;

                            log(loginInfo);

                            log("Adding account and token to parameters...");
                            parameters.account_id = loginInfo.account_id;
                            parameters.token = loginInfo.token;

                            callback();
                        } else {
                            log("!!! STATUS NOT OK!!!");
                            log(bodyObject.status);
                            console.log(bodyObject.message);
                        }
                    },
                    function (error, response, body) {//ERROR
                        console.log("An error occurred during LOGIN process. Please check your URL and Credentials");
                        log("ERROR @ LOGIN");
                        log(error);
                        log("ERROR - BODY @ LOGIN");
                        log(body);
                    },
                    function (error, response, body) {//FINALLY
                        log("FINALLY @ LOGIN");
                    });
        }

        function init_connect(parameters, callback) {
            log("init_connect()");
            log(parameters);

            var app_id = 0;
            var app_name = "";

            log("Determining if app_descriptor will be AppID or Name...");
            if (isNumeric(parameters.app_descriptor)) {
                log("   Using AppID");
                app_id = parameters.app_descriptor;
            } else {
                log("   Using AppName");
                app_name = parameters.app_descriptor;
            }

            log("Calling pvcloud.Connect()");
            pvcloud.Connect(
                    parameters.base_url,
                    parameters.account_id,
                    parameters.token,
                    "" /*element key*/,
                    app_id,
                    app_name,
                    function (error, response, body) { //SUCCESS
                        log("SUCCESS @ pvcloud.Connect");
                        log(body);

                        var bodyObject = JSON.parse(response.body);

                        var connectProperties = {
                            account_id: bodyObject.data.account_id,
                            app_id: bodyObject.data.app_id,
                            app_key: bodyObject.data.app_key,
                            element_key: bodyObject.data.element_key
                        };

                        if (bodyObject.status !== "OK") {
                            console.log(bodyObject.message);
                        } else {
                            extendObject(parameters, connectProperties);
                        }
                        parameters.complete = true;
                        callback();
                    },
                    function (error, request, body) {//ERROR
                        console.log("ERROR @ CONNECT");
                        console.log(error);
                    },
                    function (error, request, body) {//FINALLY
                        log("FINALLY @ CONNECT");
                    });
        }

        function init_save(parameters, callback) {
            log("init_save()");
            log(parameters);
            callback();
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
            log(parameters);
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
        return {
            Init: init
        };
    }();
    exports.Client = pvCloudCLModule;
})();


