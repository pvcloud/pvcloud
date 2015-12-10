#! /usr/bin/env node

(function () {
    var pvcloud = require('pvcloud_lib');
    var pvCloudCLModule = function () {
        if (process.argv.length > 2) {
            executeAsCommandLine();
        } else {
            throw ("Missing parameters");
        }

        function executeAsCommandLine() {
            var action = process.argv[2];
            switch(action){
                case "write":
                    pvcloud.pvCloudLib.Write();
                    break;
                case "read":
                    pvcloud.pvCloudLib.Read();
                    break;
                case "test":
                    console.log("test point was reached successfully");
                    break;
                default:
                    console.log("Invalid action '" + action + "' requested.");
                    
            }
        }

        return pvcloud;
    }();
})();


