#! /usr/bin/env node

(function () {
    var options = {
        DEBUG: false,
        DEBUG_COUNT: 0
    };
    var pvcloud = require("pvcloud_lib").pvcloudAPI;
    var http = require('http'),
            fs = require('fs');
    var fs = require("fs");
    var rootPath = __dirname;
    var pvCloudCLModule = function () {

        var configFilePath = __dirname + "/config.json";

        var defaultConfig = {
            device_name: "",
            base_url: "",
            app_key: "",
            element_key: ""
        };

        function commandLineExecution() {
            var package_json = require("./package.json");
            var parameters = processParameters(process.argv);
            if (parameters.debug === true) {
                options.DEBUG = true;
            } else {
                options.DEBUG = false;
            }
            log("ARGUMENTS:");
            log(process.argv);

            log("PARAMETERS FOUND:");
            log(parameters);

            log("CONFIG FILE PATH: " + configFilePath);
            log("commandLineExecution()");
            log("WELCOME TO PVCLOUD CLIENT v." + package_json.version);
            var configuredDeviceName = config_get("device_name");
            log(configuredDeviceName);
            if (parameters.action !== "init" && (configuredDeviceName === "" || !configuredDeviceName)) {
                console.log("This device is not configured yet. Please run pvcloud init command to begin.");
                return;
            }

            log(parameters);
            switch (parameters.action) {
                case "test":
                    options.DEBUG = true;
                    var devname = config_get("device_name");
                    console.log(devname);
                    log("CLEx: test");
                    log(pvcloud.test());
                    log(pvcloud);
                    break;
                case "init":
                    log("CLEx: init");
                    doInit(parameters);
                    break;
                case "write":
                    log("CLEx: write");
                    doWrite(parameters);
                    break;
                case "read":
                    log("CLEx: read");
                    doRead(parameters);
                    break;
                case "read_async":
                    log("CLEx: read_async");
                    doReadAsync(parameters);
                    break;
                case "send_file":
                    log("CLEx: send_file");
                    doSendFile(parameters);
                    break;
                case "delete":
                    log("CLEx: delete");
                    doDelete(parameters);
                    break;
                case "server":
                    log("CLEx: server");
                    doServer(parameters);
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
                                } else if (sequencedParametersIndex === 7 && !parameters.device_name) {
                                    parameters.device_name = currentParameter;
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
                                } else if (sequencedParametersIndex === 4 && !parameters.count) {
                                    parameters.count = currentParameter;
                                    sequencedParametersIndex++;
                                }
                                break;
                            case "read_async":
                                if (sequencedParametersIndex === 3 && !parameters.label) {
                                    parameters.label = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 4 && !parameters.result_path) {
                                    parameters.result_path = currentParameter;
                                    sequencedParametersIndex++;
                                }
                                break;
                            case "send_file":
                                if (sequencedParametersIndex === 3 && !parameters.label) {
                                    parameters.label = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 4 && !parameters.file_path) {
                                    parameters.file_path = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 5 && !parameters.captured_datetime) {
                                    parameters.captured_datetime = currentParameter;
                                    sequencedParametersIndex++;
                                }
                                break;
                            case "delete":
                                if (sequencedParametersIndex === 3 && !parameters.label) {
                                    parameters.label = currentParameter;
                                    sequencedParametersIndex++;
                                } else if (sequencedParametersIndex === 4 && !parameters.count) {
                                    parameters.count = currentParameter;
                                    sequencedParametersIndex++;
                                }
                                break;
                        }
                    }
                }
            }

            return parameters;
        }

        function config_load() {
            var exists = fs.existsSync(configFilePath);
            if (!exists) {
                log("Config file missing! Creating default file...");
                config_save(defaultConfig);
            }
            log("Config file found! Loading...");
            return require(configFilePath);
        }

        function config_save(configObject) {
            log("config_save");
            var configString = JSON.stringify(configObject);
            log(configObject);
            fs.writeFileSync(configFilePath, configString);
        }

        function config_get(key) {
            var configObject = config_load();
            return configObject[key];
        }

        function config_set(key, value) {
            var configObject = config_load();
            configObject[key] = value;
            config_save(configObject);
        }

        function doInit(parameters) {
            log("init(parameters)");
            console.log("------------------------");
            console.log("- pvCloud INIT Routine -");
            console.log("------------------------");
            log(parameters);
            log("Getting existing configuration...");
            var configuration = config_load();
            console.log(configuration);
            log("init() - Validating Parameters...");
            var validationErrors = init_validateParameters(parameters);
            if (validationErrors.length === 0) {
                log("init() - Parameters are Valid.");
                log(parameters);
                init_Execute(parameters);
            } else {
                console.log("Parameters Validation Failed!");
                console.log("use pvcloud {base_url} {username} {password} {app_descriptor} {device_name}");
                for (var i in validationErrors) {
                    console.log(" (!) " + validationErrors[i]);

                }
            }

        }

        function init_validateParameters(parameters) {
            var errors = [];
            if (!parameters.base_url)
                errors.push("base_url parameter is missing");
            if (!parameters.username)
                errors.push("username parameter is missing");
            if (!parameters.password)
                errors.push("password parameter is missing");
            if (!parameters.app_descriptor)
                errors.push("app_descriptor parameter is missing");
            if (!parameters.device_name)
                errors.push("app_descriptor parameter is missing");
            return errors;
        }

        function init_Execute(parameters) {
            log("init_Execute()");
            log(parameters);
            init_login(parameters, function () {
                console.log("Login Complete. Doing connect...");
                init_connect(parameters, function () {
                    console.log("Connect Complete. Saving Config...");
                    init_save(parameters, function () {
                        console.log("INIT Sequence Complete. Config Saved!");
                        log("INIT SEQUENCE SUCCESSFUL!");
                        log(parameters);
                    });
                });
            });
        }

        function doWrite(parameters) {
            log("------------------------");
            log("- pvCloud WRITE Routine-");
            log("------------------------");
            log(parameters);
            log("Getting existing configuration...");
            var configuration = config_load();
            log(configuration);

            log("Loading required config into parameters...");
            parameters.base_url = configuration.base_url;
            parameters.account_id = configuration.account_id;
            parameters.app_id = configuration.app_id;
            parameters.app_key = configuration.app_key;
            parameters.element_key = configuration.element_key;

            write_send(parameters);
        }

        function write_send(parameters) {
            log("wirite_send()");
            pvcloud.Write(
                    parameters.base_url,
                    parameters.app_id,
                    parameters.app_key,
                    parameters.element_key,
                    parameters.label,
                    parameters.value,
                    getFormattedDateTime(),
                    function (error, response, body) {//SUCCESS
                        log("SUCCESS!!!");
                        console.log(body);
                    },
                    function (error, response, body) {//ERROR
                        log("ERROR!!!");
                        log(error);
                        log(response);
                    },
                    function (error, response, body) {//FINALLY
                        log("FINALLY!");
                        log(body);
                    });
        }

        function doRead(parameters) {
            log("------------------------");
            log("- pvCloud READ Routine-");
            log("------------------------");
            log(parameters);
            log("Getting existing configuration...");
            var configuration = config_load();
            log(configuration);

            log("Loading required config into parameters...");
            parameters.base_url = configuration.base_url;
            parameters.account_id = configuration.account_id;
            parameters.app_id = configuration.app_id;
            parameters.app_key = configuration.app_key;
            parameters.element_key = configuration.element_key;

            read_get(parameters);
        }

        function read_get(parameters) {
            log("read_get()");
            pvcloud.Read(
                    parameters.base_url,
                    parameters.app_id,
                    parameters.app_key,
                    parameters.element_key,
                    parameters.label,
                    parameters.count,
                    function (error, response, body) {//SUCCESS
                        log("SUCCESS!!!");
                        console.log(body);
                    },
                    function (error, response, body) {//ERROR
                        log("ERROR!!!");
                        log(error);
                        log(response);
                    },
                    function (error, response, body) {//FINALLY
                        log("FINALLY!");
                        log(body);
                    });
        }

        function doReadAsync(parameters) {
            log("------------------------");
            log("- pvCloud READ Routine-");
            log("------------------------");
            log(parameters);
            log("Getting existing configuration...");
            var configuration = config_load();
            log(configuration);

            log("Loading required config into parameters...");
            parameters.base_url = configuration.base_url;
            parameters.account_id = configuration.account_id;
            parameters.app_id = configuration.app_id;
            parameters.app_key = configuration.app_key;
            parameters.element_key = configuration.element_key;

            read_async_get(parameters);
        }

        function read_async_get(parameters) {
            log("read_get()");
            read_async_status_to_file(parameters.result_path, parameters.label, parameters.action, "CALLING WEB SERVICE");
            read_async_value_to_file(parameters.result_path, parameters.label, parameters.action, "...READING...");
            pvcloud.Read(
                    parameters.base_url,
                    parameters.app_id,
                    parameters.app_key,
                    parameters.element_key,
                    parameters.label,
                    1,
                    function (error, response, body) {//SUCCESS
                        log("SUCCESS!!!");
                        read_async_status_to_file(parameters.result_path, parameters.label, parameters.action, "SUCCESS");
                        var bodyObject = JSON.parse(body);
                        log(bodyObject);
                        var read_data = bodyObject.data;
                        log("READ DATA");
                        log(read_data);

                        if (read_data.length > 0) {
                            read_async_value_to_file(parameters.result_path, parameters.label, parameters.action, read_data[0].vse_value);
                        } else {
                            read_async_value_to_file(parameters.result_path, parameters.label, parameters.action, "...NOT FOUND...");
                        }
                        console.log(body);
                    },
                    function (error, response, body) {//ERROR
                        log("ERROR!!!");
                        log(error);
                        log(response);
                        read_async_status_to_file(parameters.result_path, parameters.label, parameters.action, "ERROR");
                        read_async_value_to_file(parameters.result_path, parameters.label, parameters.action, "ERROR: " + body);
                    },
                    function (error, response, body) {//FINALLY
                        log("FINALLY!");
                        log(body);
                    });
        }

        function read_async_status_to_file(folder_path, label, operation, status) {
            if (!label || label === "*")
                label = "ALL";

            var filePath = folder_path + "/pvc_status_";
            filePath = filePath + label + "_" + operation;

            log("WRITING TO STATUS FILE...");
            try {
                log(filePath);

                var stream = fs.createWriteStream(filePath);
                log("OPENING STREAM");
                stream.once('open', function (fd) {
                    try {
                        log("STREAM WRITE");
                        log("STATUS");
                        log(status);

                        stream.write(status);
                        stream.end();
                        stream.close();
                        log("FS END REACHED!");
                    } catch (ex) {
                        log("EXCEPTION!");
                        log(ex);
                    }
                });

                log("END OF STATUS TO FILE");

                log("END OF read_async_status_to_file()");
            } catch (ex) {
                log("EXCEPTION ON BIG TRY");
                log(ex);
            }
        }

        function read_async_value_to_file(folder_path, label, operation, strValue) {
            if (!label || label === "*")
                label = "ALL";

            var filePath = folder_path + "/pvc_value_";
            filePath = filePath + label + "_" + operation;

            log("WRITING TO VALUE FILE...");
            try {
                log(filePath);

                var stream = fs.createWriteStream(filePath);
                log("OPENING STREAM");
                stream.once('open', function (fd) {
                    try {
                        log("STREAM WRITE");
                        log("STATUS");
                        log(strValue);

                        stream.write(strValue);
                        stream.end();
                        stream.close();
                        log("FS END REACHED!");
                    } catch (ex) {
                        log("EXCEPTION!");
                        log(ex);
                    }
                });

                log("END OF VALUE TO FILE");

                log("END OF read_async_value_to_file()");
            } catch (ex) {
                log("EXCEPTION ON BIG TRY");
                log(ex);
            }
        }

        function doSendFile(parameters) {
            log("------------------------");
            log("- pvCloud SEND FILE Routine-");
            log("------------------------");
            log(parameters);
            log("Getting existing configuration...");
            var configuration = config_load();
            log(configuration);

            log("Loading required config into parameters...");
            parameters.base_url = configuration.base_url;
            parameters.account_id = configuration.account_id;
            parameters.app_id = configuration.app_id;
            parameters.app_key = configuration.app_key;
            parameters.element_key = configuration.element_key;

            send_file(parameters);
        }

        function send_file(parameters) {
            log("send_file()");

            pvcloud.SendFile(
                    parameters.base_url,
                    parameters.app_id,
                    parameters.app_key,
                    parameters.element_key,
                    parameters.label,
                    parameters.file_path,
                    getFormattedDateTime(),
                    function (error, response, body) {//SUCCESS
                        log("SUCCESS!!!");
                        console.log(body);
                    },
                    function (error, response, body) {//ERROR
                        log("ERROR!!!");
                        log(error);
                        log(response);
                    },
                    function (error, response, body) {//FINALLY
                        log("FINALLY!");
                        log(body);
                    });
        }

        function doDelete(parameters) {
            log("--------------------------");
            log("- pvCloud DELETE Routine -");
            log("--------------------------");
            log(parameters);
            log("Getting existing configuration...");
            var configuration = config_load();
            log(configuration);

            log("Loading required config into parameters...");
            parameters.base_url = configuration.base_url;
            parameters.account_id = configuration.account_id;
            parameters.app_id = configuration.app_id;
            parameters.app_key = configuration.app_key;
            parameters.element_key = configuration.element_key;

            delete_send(parameters);
        }

        function delete_send(parameters) {
            log("delete_send()");
            pvcloud.Delete(
                    parameters.base_url,
                    parameters.app_id,
                    parameters.app_key,
                    parameters.element_key,
                    parameters.label,
                    parameters.count,
                    function (error, response, body) {//SUCCESS
                        log("SUCCESS!!!");
                        console.log(body);
                    },
                    function (error, response, body) {//ERROR
                        log("ERROR!!!");
                        log(error);
                        log(response);
                    },
                    function (error, response, body) {//FINALLY
                        log("FINALLY!");
                        log(body);
                    });
        }

        function doServer(parameters) {
            console.log("Server Routine");
            var serverPort = 8086;



            var express = require('express');
            var app = express();

            app.get('/', function (req, res) {
                var filepath = __dirname+ "/htdocs/config.html";
                console.log(filepath);
                fs.readFile(filepath, 'utf8', function (err, data) {
                    res.end(data);
                });
            });

            app.get('/getconfig', function (req, res) {
                fs.readFile(__dirname + "/" + "config.json", 'utf8', function (err, data) {
                    objData = JSON.parse(data);
                    objData.element_key = "*****";
                    objData.app_key = "*****";
                    res.end(JSON.stringify(objData));
                });
            });
            app.get('/:resource', function (req, res) {
                var resource = req.params.resource;
                fs.readFile(__dirname + "/htdocs/" + resource, 'utf8', function (err, data) {
                    res.end(data);
                });
            });

            app.get('/jquery-ui-1.11.4.custom/:resource', function (req, res) {
                var resource = req.params.resource;
                fs.readFile(__dirname + "/htdocs/jquery-ui-1.11.4.custom/" + resource, 'utf8', function (err, data) {
                    res.end(data);
                });
            });

            app.get('/jquery-ui-1.11.4.custom/images/:resource', function (req, res) {
                var resource = req.params.resource;
                fs.readFile(__dirname + "/htdocs/jquery-ui-1.11.4.custom/images/" + resource, 'utf8', function (err, data) {
                    res.end(data);
                });
            });

            app.get('/jquery-ui-1.11.4.custom/external/jquery/:resource', function (req, res) {
                var resource = req.params.resource;
                fs.readFile(__dirname + "/htdocs/jquery-ui-1.11.4.custom/external/jquery/" + resource, 'utf8', function (err, data) {
                    res.end(data);
                });
            });

            var server = app.listen(serverPort, function () {

                var host = server.address().address;
                var port = server.address().port;

                console.log("Example app listening at http://%s:%s", host, port);

            });

            console.log("listening to port " + serverPort);
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
                        log("BODY!!!");
                        log(body);
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
            var newConfig = config_load();
            newConfig["base_url"] = parameters.base_url;
            newConfig["account_id"] = parameters.account_id;
            newConfig["app_id"] = parameters.app_id;
            newConfig["app_key"] = parameters.app_key;
            newConfig["element_key"] = parameters.element_key;
            newConfig["device_name"] = parameters.device_name;

            config_save(newConfig);
            callback();
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
            Init: doInit
        };
    }();
    exports.Client = pvCloudCLModule;
})();


