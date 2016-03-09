#! /usr/bin/env node

(function () {
    var DEBUG = false;
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

            var params = processParameters(process.argv);

            switch (params.action) {
                case "test":
                    console.log(pvcloud.test());
                    console.log(pvcloud);
                    break;
                case "init":
                    init(params);
                    break;
                case "write":
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
            if (!configOnFile || configOnFile.ElementKey == undefined) {
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
            console.log("------------------------");
            console.log("- pvCloud INIT Routine -");
            console.log("------------------------");
            init_promptMissingParameters(parameters, function () {

                if (init_validateParameters(parameters)) {
                    console.log("VALIDATED");
                } else {
                    console.log("INVALID PARAMETERS");
                }

            });
        }

        function init_promptMissingParameters(parameters, callback) {
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

        commandLineExecution();
        return {};
        ;
    }();
    exports.Client = pvCloudCLModule;
})();


