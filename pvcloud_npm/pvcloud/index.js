#! /usr/bin/env node

(function () {
    var pvCloudAPI = function () {
        if (process.argv.length > 2) {
            executeAsCommandLine();
        } else {
            executeAsJSAPI();
        }

        function executeAsCommandLine() {
            var action = process.argv[2];
            switch(action){
                case "write":
                    write();
                    break;
                case "read":
                    read();
                    break;
                default:
                    console.log("Invalid action '" + action + "' requested.");
                    
            }
        }
        
        function executeAsJSAPI(){
            //So far nothing should happen here...
        }

        function write(label, value) {
            console.log("THIS IS WRITE FUNCTION");
        }

        function read(label) {
            console.log("THIS IS READ FUNCTION");
        }

        return {
            Write: write,
            Read: read
        };
    }();

    exports.pvCloudAPI = pvCloudAPI;
})();

