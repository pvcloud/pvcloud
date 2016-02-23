var request = require("request");
var pvcloud = require("../index.js");
pvcloud = pvcloud.pvcloudAPI;
var baseURL = "http://crmakers.intel.com:8080/pvcloud_test/backend/";
//baseURL = "http://janunezc-mobl4.amr.corp.intel.com:8080/pvcloud/backend/";
var loginInfo;

var elementKey = "";
var infoStep = 0;

describe("pvCloud API Object", function () {
    info("API OBJECT TEST");

    it("Must not empty", function () {
        info("API NOT EMPTY");
        expect(pvcloud).not.toBe(undefined);
    });
    it("Must have the minimal API functions declared", function () {
        info("API MINIMAL FUNCTIONS");
        expect(pvcloud.Login).not.toBe(undefined);
//        expect(pvcloud.Read).not.toBe(undefined);
//        expect(pvcloud.Write).not.toBe(undefined);
        //expect(pvcloud.PostFile).not.toBe(undefined);
        //expect(pvcloud.Check).not.toBe(undefined);
    });
    it("Must run Test Point Properly", function () {
        info("SMOKE TEST");
        var smoketestResult = pvcloud.test();
        expect(smoketestResult).toBe("SIMPLE SMOKE TEST");
    });
});


describe("pvCloud User Context", function () {

    it("Should be able to LOGIN with proper credentials", function (done) {
        var testHint = "LOGIN PROPER CREDENTIALS";

        var username = "test@costaricamakers.com";
        var password = "abcd";

        var successReached = false;
        var errorReached = false;

        var successCallback = function (error, response, body) {
            successReached = true;
            info(testHint + ": Success Callback Reached!");

            var body = JSON.parse(response.body);
            loginInfo = body.data;
            info(testHint + ": TOKEN CAPTURED!");
            info(loginInfo);
            expect(body.status).toBe("OK");
            expect(error).toBeFalsy();
            expect(response).not.toBe(undefined);
            expect(body).not.toBe(undefined);

        };
        var errorCallback = function (error, response, body) {
            errorReached = true;
            info(testHint + ": Error Callback Reached!");
            expect(error).not.toBe(undefined);
            expect("Executing This").not.toBe("Executing This");

        };
        var finallyCallback = function (error, response, body) {
            info(testHint + ": Finally Callback Reached");

            expect(successReached).toBe(true);
            expect(errorReached).toBe(false);
            done();
        };

        pvcloud.Login(baseURL, username, password, successCallback, errorCallback, finallyCallback);

    });

    it("Must reject invalid credentials", function (done) {
        var testHint = "LOGIN WRONG CREDENTIALS";
        var wrong_username = "test@costaricamakers.com";
        var wrong_password = "-----";
        var successCallback = function (error, response, body) {
            info(testHint + ": Success Callback Reached!");
        };
        var errorCallback = function (error, response, body) {
            info(testHint + ": Error Callback Reached!");
        };
        var finallyCallback = function (error, response, body) {
            info(testHint + ": Finally Callback Reached");
            info(body);
            var body = JSON.parse(response.body);
            expect(body.status).toBe("ERROR");
            done();
        };

        pvcloud.Login(baseURL, wrong_username, wrong_password, successCallback, errorCallback, finallyCallback);

    });

    describe("User Login Context Token", function () {
        it("TOKEN NOT EMPTY", function () {
            info("TOKEN NOT EMPTY (good!)");
            console.log(loginInfo);
            expect(loginInfo).not.toBe(undefined);
        });

        it("SHOULD BE ABLE TO CONNECT TO AN APP (Via App_ID)", function (done) {
            var testHint = "BASIC APP CONNECT";
            var successReached = false;
            var errorReached = false;
            info("TESTING RE CONNECT INTERACTION!");

            var successCallback = function (error, response, body) {
                successReached = true;
                info(testHint + ": Success Callback Reached!");
                var connectInfo;
                var myBody = JSON.parse(body);
                connectInfo = myBody.data;
                elementKey = connectInfo.element_key;
                info(testHint + ": CONNECT INFO!");
                info(connectInfo);
                expect(myBody.status).toBe("OK");
                info(testHint + ": EXCEPTION");
                info(myBody);
                
                
                expect(error).toBeFalsy();
                expect(response).not.toBe(undefined);
                expect(myBody).not.toBe(undefined);

            };
            var errorCallback = function (error, response, body) {
                errorReached = true;
                info(testHint + ": Error Callback Reached!");
                expect(error).not.toBe(undefined);
            };
            var finallyCallback = function (error, response, body) {
                info(testHint + ": Finally Callback Reached");

                expect(successReached).toBe(true);
                expect(errorReached).toBe(false);
                done();
            };

            pvcloud.Connect(
                    baseURL,
                    loginInfo.account_id,
                    loginInfo.token,
                    "", /*Not Element Key*/
                    18, /*TEST APP ID*/
                    "", /*Not App Name*/
                    successCallback,
                    errorCallback,
                    finallyCallback
                    );
        });
        
        it("SHOULD BE ABLE TO RECONNECT TO ANOTHER APP (Via ElementKey and AppName)", function (done) {
            var testHint = "APP RECONNECT WITH ELEMENT KEY AND APPNAME ";
            var successReached = false;
            var errorReached = false;
            info("TESTING APP CONNECT INTERACTION!");

            var successCallback = function (error, response, body) {
                successReached = true;
                info(testHint + ": Success Callback Reached!");

                var body = JSON.parse(response.body);
                loginInfo = body.data;
                info(testHint + ": CONNECT INFO!");
                info(loginInfo);
                expect(body.status).toBe("OK");
                info(testHint + ": EXCEPTION");
                info(body);
                expect(error).toBeFalsy();
                expect(response).not.toBe(undefined);
                expect(body).not.toBe(undefined);

            };
            var errorCallback = function (error, response, body) {
                errorReached = true;
                info(testHint + ": Error Callback Reached!");
                expect(error).not.toBe(undefined);
            };
            var finallyCallback = function (error, response, body) {
                info(testHint + ": Finally Callback Reached");

                expect(successReached).toBe(true);
                expect(errorReached).toBe(false);
                done();
            };


            info("ELEMENT KEY------");
            info(elementKey);
            info(loginInfo.account_id);
            pvcloud.Connect(
                    baseURL,
                    loginInfo.account_id,
                    "", /*NO TOKEN*/
                    elementKey, 
                    0, /*TEST APP ID*/
                    "PRUEBA 2", /*TEST App Name*/
                    successCallback,
                    errorCallback,
                    finallyCallback
                    );
        });
    });


});


//describe("pvCloud Library WAIT WRITE Call.", function () {
//    info("WRITE CALL TEST (WAIT)");
//    var callResponse;
//    it("should be able to make WRITE SYNCHRONOUS Call and pass through FINALLY callback", function (done) {
//        var testHint = "WRITE CALL WAIT";
//        var account_id = 1;
//        var app_id = 9;
//        var api_key = '1ff73344d60297700b45b8368c927395ffedebec';
//        var label = "test";
//        var value = "VALUE";
//        var type = "STRING";
//        var captured_datetime = "2016-01-01";
//
//        var successCallback = function (error, response, body) {
//            info(testHint + ": Success Callback Reached!");
//            callResponse = response;
//        };
//        var errorCallback = function (error, response, body) {
//            info(testHint + ": Error Callback Reached!");
//            callResponse = response;
//        };
//        var finallyCallback = function (error, response, body) {
//            info(testHint + ": Finally Callback Reached!");
//            done();
//        };
//
//        pvcloud.Write(baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback);
//    });
//
//    it("returns proper data", function () {
//        var testHint = "PROPER DATA";
//        expect(callResponse).not.toBe(undefined);
//        expect(callResponse.body).not.toBe(undefined);
//
//        info(testHint + ": EXTRACTING DATA FROM RESPONSE...");
//        info(callResponse.body);
//        data = JSON.parse(callResponse.body);
//        expect(data).not.toBe(undefined);
//        expect(data.entry_id).toBeGreaterThan(1);
//
//    });
//});
//
//describe("pvCloud Library NO_WAIT WRITE Call.", function () {
//    info("WRITE CALL TEST (NO_WAIT)");
//    var callResponse;
//    it("should be able to make WRITE ASYNC Call and pass through FINALLY callback", function (done) {
//        var testHint = "WRITE NOWAIT";
//        info("JASMINE DEFAULT TIMEOUT");
//        info(jasmine.DEFAULT_TIMEOUT_INTERVAL);
//        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//        var account_id = 1;
//        var app_id = 9;
//        var api_key = '1ff73344d60297700b45b8368c927395ffedebec';
//        var label = "test";
//        var value = "VALUE";
//        var type = "STRING";
//        var captured_datetime = "2016-01-01";
//
//        var successCallback = function (error, response, body) {
//            info(testHint + ": Success Callback Reached!");
//            callResponse = response;
//        };
//        var errorCallback = function (error, response, body) {
//            info(testHint + ": Error Callback Reached!");
//            callResponse = response;
//        };
//        var finallyCallback = function (error, response, body) {
//            info(testHint + ": Finally Callback Reached!");
//
//            info(testHint + ": Waiting 1 Second for File Operation Flushout...");
//            setTimeout(function () {
//                info(testHint + ": DONE!");
//                done();
//            }, 1000);
//
//        };
//
//        pvcloud.Write(baseURL, account_id, app_id, api_key, label, value, type, captured_datetime, successCallback, errorCallback, finallyCallback, true /*NO_WAIT*/);
//    });
//
//    it("returns proper data", function () {
//        var testHint = "RETURNS PROPER DATA"
//        expect(callResponse).not.toBe(undefined);
//        expect(callResponse.body).not.toBe(undefined);
//
//        info(testHint + ": EXTRACTING DATA FROM RESPONSE...");
//        data = JSON.parse(callResponse.body);
//        expect(data).not.toBe(undefined);
//        expect(data.entry_id).toBeGreaterThan(1);
//
//    });
//});

function info(message) {
    infoStep++;
    console.log("-------------------------------------------");
    var dt = getFormattedDateTime();
    if (typeof message == "object") {
        console.log("INFO (" + infoStep + " - " + dt + ") : -------------------");
        console.log(message);
    } else {
        console.log("INFO (" + infoStep + " - " + dt + ") :" + message);
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