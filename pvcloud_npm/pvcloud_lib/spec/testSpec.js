var request = require("request");
var pvcloud = require("../index.js");
pvcloud = pvcloud.pvcloudAPI;


describe("pvCloud API Object", function () {
    info("");
    info("API OBJECT TEST");

    info("pvCloud API Object");
    info(pvcloud);
    it("Must not empty", function () {
        expect(pvcloud).not.toBe(undefined);
    });
    it("Must have the minimal API functions declared", function () {
        expect(pvcloud.Read).not.toBe(undefined);
        expect(pvcloud.Write).not.toBe(undefined);
        //expect(pvcloud.PostFile).not.toBe(undefined);
        //expect(pvcloud.Check).not.toBe(undefined);
    });
    it("Must run Test Point Properly", function () {
        var smoketestResult = pvcloud.test();
        expect(smoketestResult).toBe("SIMPLE SMOKE TEST");
    });
});

//describe("pvCloud Library Sync WRITE Call.", function () {
//    info("");
//    info("WRITE CALL TEST");
//    var callResponse;
//    it("should be able to make WRITE SYNCHRONOUS Call and pass through FINALLY callback", function (done) {
//
//        var baseURL = "https://costaricamakers.com/pvcloud_pre/backend/";
//        var account_id = 5;
//        var app_id = 9;
//        var api_key = '8f5fb6fae58b9f597b2a3ccb8019966914661867';
//        var label = "test";
//        var value = "VALUE";
//        var type = "STRING";
//        var captured_datetime = "2016-01-01";
//
//        var successCallback = function (response) {
//            info("Success Callback Reached!");
//            callResponse = response;
//        };
//        var errorCallback = function (response) {
//            info("Error Callback Reached!");
//            callResponse = response;
//        };
//        var finallyCallback = function (response) {
//            info("Finally Callback Reached!");
//            done();
//        };
//
//        pvcloud.Write(baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback);
//    });
//
//    it("returns proper data", function () {
//        expect(callResponse).not.toBe(undefined);
//        expect(callResponse.body).not.toBe(undefined);
//
//        info("EXTRACTING DATA FROM RESPONSE...");
//        data = JSON.parse(callResponse.body);
//        expect(data).not.toBe(undefined);
//
//        info(data);
//        expect(data.entry_id).toBeGreaterThan(1);
//
//    });
//});

describe("pvCloud Library NO_WAIT WRITE Call.", function () {
    info("");
    info("WRITE CALL TEST");
    var callResponse;
    it("should be able to make WRITE ASYNC Call and pass through FINALLY callback", function (done) {
        console.log("JASMINE DEFAULT TIMEOUT");
        console.log(jasmine.DEFAULT_TIMEOUT_INTERVAL);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
        var baseURL = "https://costaricamakers.com/pvcloud_pre/backend/";
        var account_id = 5;
        var app_id = 9;
        var api_key = '8f5fb6fae58b9f597b2a3ccb8019966914661867';
        var label = "test";
        var value = "VALUE";
        var type = "STRING";
        var captured_datetime = "2016-01-01";

        var successCallback = function (response) {
            info("Success Callback Reached!");
            callResponse = response;
        };
        var errorCallback = function (response) {
            info("Error Callback Reached!");
            callResponse = response;
        };
        var finallyCallback = function (response) {
            info("Finally Callback Reached!");
            setTimeout(function(){
                done();
            }, 2000);
            
        };

        pvcloud.Write(baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback, true /*NO_WAIT*/);
    });

    it("returns proper data", function () {
        expect(callResponse).not.toBe(undefined);
        expect(callResponse.body).not.toBe(undefined);

        info("EXTRACTING DATA FROM RESPONSE...");
        data = JSON.parse(callResponse.body);
        expect(data).not.toBe(undefined);

        info(data);
        expect(data.entry_id).toBeGreaterThan(1);

    });
});

function info(value) {
    console.log(value);
    console.log("----------------------------------");
}
