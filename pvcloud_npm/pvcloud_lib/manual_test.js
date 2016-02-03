var idx = require("./index.js");

var pvcloud = idx.pvcloudAPI;

dosimpletest();

function dosimpletest() {
    var waiting = true;
    var myresponse = {};
    var baseURL = "https://costaricamakers.com/pvcloud_pre/backend/";
    var account_id = 5;
    var app_id = 9;
    var api_key = '8f5fb6fae58b9f597b2a3ccb8019966914661867';
    var label = "test";
    var value = "VALUE";
    var type = "STRING";
    var captured_datetime = "2016-01-01";
    var debugOption = false;
    var successCallback = function (response) {
        waiting = false;
        clearTimeout(timeout);
        console.log("CALL BACK SUCCESS");
        myresponse = response;
    };
    var errorCallback = function (response) {
        waiting = false;
        clearTimeout(timeout);
        console.log("CALL BACK ERROR");
        var wasCalled = true;
    };
    var finallyCallback = function (response) {
        waiting = false;
        clearTimeout(timeout);
        console.log("CALL BACK FINALLY");
    };
    console.log("CALLING pvcloud.WRITE");
    
    var timeout = setTimeout(function(){
        console.log("TIMED OUT!");
        waiting=false;
    }, 5000);
    pvcloud.Write(baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback, debugOption);
    
    console.log("waiting...");
    
    while(waiting){
        
    }
    
    console.log(myresponse);
}