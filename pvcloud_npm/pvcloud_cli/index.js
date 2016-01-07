#! /usr/bin/env node

(function () {
    var DEBUG = false;

    var pvCloudAPI = require("pvcloud_lib").pvcloudAPI;

    var pvCloudCLModule = function () {
        if (process.argv.length > 2) {
            executeAsCommandLine();
        } else {
            throw ("Missing parameters");
        }


        function executeAsCommandLine(parameters) {
            var action = process.argv[2];
            switch (action) {
                case "test":
                    console.log(pvCloudAPI.test());
                    break;
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


    }();
})();


