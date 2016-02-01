var request = require("request");
var pvcloud = require("../index.js");
pvcloud = pvcloud.pvcloudAPI;
var baseURL = "https://costaricamakers.com/pvcloud_pre/backend/";
var token;
describe("pvCloud API Object", function () {
    info("API OBJECT TEST");

    it("Must not empty", function () {
        expect(pvcloud).not.toBe(undefined);
    });
    it("Must have the minimal API functions declared", function () {
        expect(pvcloud.Login).not.toBe(undefined);
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


describe("pvCloud Login", function () {

    it("Must reject invalid credentials", function (done) {
        var wrong_username = "test@costaricamakers.com";
        var wrong_password = "-----";
        var successCallback = function (response) {
            info("Success Callback Reached!")         
        };
        var errorCallback = function (response) {
            info("Error Callback Reached!");            
        };
        var finallyCallback = function (response) {
            info("Finally Callback Reached");
            info(response.body);
            
            var body = JSON.parse(response.body);
            expect(body.status).toBe("ERROR");
            done();
        };

        pvcloud.Login(baseURL, wrong_username, wrong_password, successCallback, errorCallback, finallyCallback);

    });
    
    
    it("Must accept valid credentials", function (done) {
        var username = "test@costaricamakers.com";
        var password = "abcd";
        var successCallback = function (response) {
            info("Success Callback Reached!");
           
        };
        var errorCallback = function (response) {
            info("Error Callback Reached!");
            
        };
        var finallyCallback = function (response) {
            info("Finally Callback Reached");
            info("correct")
            info(response.body);
             var body = JSON.parse(response.body);
            expect(body.status).toBe("OK");
            token = body.token;
            done();
        };

        pvcloud.Login(baseURL, username, password, successCallback, errorCallback, finallyCallback);

    });    
});

describe("pvCloud Library WAIT WRITE Call.", function () {
   info("WRITE CALL TEST (WAIT)");
   var callResponse;
   it("should be able to make WRITE SYNCHRONOUS Call and pass through FINALLY callback", function (done) {

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
           done();
       };

       pvcloud.Write(baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback);
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

describe("pvCloud Library NO_WAIT WRITE Call.", function () {
    info("WRITE CALL TEST (NO_WAIT)");
    var callResponse;
    it("should be able to make WRITE ASYNC Call and pass through FINALLY callback", function (done) {
        info("JASMINE DEFAULT TIMEOUT");
        info(jasmine.DEFAULT_TIMEOUT_INTERVAL);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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

            info("Waiting 1 Second for File Operation Flushout...");
            setTimeout(function () {
                info("DONE!");
                done();
            }, 1000);

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

function info(message) {
    console.log("-------------------------------------------");
    var dt = getFormattedDateTime();
    if (typeof message == "object") {
        console.log("INFO (" + dt + ") : -------------------");
        console.log(message);
    } else {
        console.log("INFO (" + dt + ") :" + message);
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