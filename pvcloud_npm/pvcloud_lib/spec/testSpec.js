var request = require("request");
var pvcloud = require("../index.js");

pvcloud = pvcloud.pvcloudAPI;

var connectParameters = {
    base_url: "http://crmakers.intel.com:8080/pvcloud_test/",
    account_descriptor: "test@costaricamakers.com",
    app_descriptor: "TEST",
    app_descriptor_2: 19, /*PRUEBA 2*/
    app_key: "0d5e15a2b225f4367d413183bab761317da08ed8",
    app_key_2: "a6b2dc09407c2e1c38da88d100ac58b5cc826024"
};

var connectInfo = {
    account_id: 0,
    app_id: 0,
    element_key: ""
};

var infoStep = 0;

describe("pvCloud API Object", function () {
    info("API OBJECT TEST");

    it("Must not empty", function () {
        info("API NOT EMPTY");
        expect(pvcloud).not.toBe(undefined);
    });
    it("Must have the minimal API functions declared", function () {
        info("API MINIMAL FUNCTIONS");
        expect(pvcloud.Connect).not.toBe(undefined);
        expect(pvcloud.Read).not.toBe(undefined);
        expect(pvcloud.Write).not.toBe(undefined);
        expect(pvcloud.SendFile).not.toBe(undefined);
    });

    it("Must run Test Point Properly", function () {
        info("SMOKE TEST");
        var smoketestResult = pvcloud.test();
        expect(smoketestResult).toBe("SIMPLE SMOKE TEST");
    });
});

describe("pvCloud", function () {

    it("NICE FAILURE ON BOGUS URL", function (done) {
        var testHint = "BASIC APP CONNECT FAILURE ON BOGUS URL";
        var successReached = false;
        var errorReached = false;
        info("FAIL ON BOGUS URL");


        var successCallback = function (error, response, body) {
            successReached = true;
            info(testHint + ": Success Callback Reached!");
            info(body);
            var myBody = JSON.parse(body);
            connectInfo = myBody.data;
            info(testHint + ": CONNECT INFO!");
            info(connectInfo);
            expect(myBody.status).toBe("OK");
            expect(connectInfo.element_key).not.toBe(undefined);
            expect(connectInfo.element_key).not.toBe("");
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


        console.log("calling pvcloud.Connect()");
        pvcloud.Connect(
                connectParameters.base_url,
                connectParameters.account_descriptor,
                connectParameters.app_descriptor,
                connectParameters.app_key,
                "", /*Not Element Key*/
                successCallback,
                errorCallback,
                finallyCallback
                );
    });
//
//    it("SHOULD BE ABLE TO CONNECT TO AN APP BASED ON API KEY", function (done) {
//        var testHint = "BASIC APP CONNECT VIA API KEY";
//        var successReached = false;
//        var errorReached = false;
//        info("CONNECT INTERACTION");
//
//        var successCallback = function (error, response, body) {
//            successReached = true;
//            info(testHint + ": Success Callback Reached!");
//            info(body);
//            var myBody = JSON.parse(body);
//            connectInfo = myBody.data;
//            info(testHint + ": CONNECT INFO!");
//            info(connectInfo);
//            expect(myBody.status).toBe("OK");
//            expect(connectInfo.element_key).not.toBe(undefined);
//            expect(connectInfo.element_key).not.toBe("");
//            expect(error).toBeFalsy();
//            expect(response).not.toBe(undefined);
//            expect(myBody).not.toBe(undefined);
//        };
//
//        var errorCallback = function (error, response, body) {
//            errorReached = true;
//            info(testHint + ": Error Callback Reached!");
//            expect(error).not.toBe(undefined);
//        };
//
//        var finallyCallback = function (error, response, body) {
//            info(testHint + ": Finally Callback Reached");
//
//            expect(successReached).toBe(true);
//            expect(errorReached).toBe(false);
//            done();
//        };
//
//        pvcloud.Connect(
//                connectParameters.base_url,
//                connectParameters.account_descriptor,
//                connectParameters.app_descriptor,
//                connectParameters.app_key,
//                "", /*Not Element Key*/
//                successCallback,
//                errorCallback,
//                finallyCallback
//                );
//    });
//
//    it("SHOULD BE ABLE TO RECONNECT TO ANOTHER APP (Via ElementKey and AppName)", function (done) {
//        var testHint = "APP RECONNECT WITH ELEMENT KEY AND APPNAME ";
//        var successReached = false;
//        var errorReached = false;
//        info("TESTING APP CONNECT INTERACTION!");
//
//        var successCallback = function (error, response, body) {
//            successReached = true;
//            info(testHint + ": Success Callback Reached!");
//
//            var body = JSON.parse(response.body);
//            var connectResponse = body.data;
//            info(testHint + ": CONNECT RESPONSE!");
//            info(connectResponse);
//            info(body);
//
//            expect(connectResponse.element_key).toBe(connectInfo.element_key);
//            expect(body.status).toBe("OK");
//            expect(error).toBeFalsy();
//            expect(response).not.toBe(undefined);
//            expect(body).not.toBe(undefined);
//
//        };
//        var errorCallback = function (error, response, body) {
//            errorReached = true;
//            info(testHint + ": Error Callback Reached!");
//            expect(error).not.toBe(undefined);
//        };
//        var finallyCallback = function (error, response, body) {
//            info(testHint + ": Finally Callback Reached");
//
//            expect(successReached).toBe(true);
//            expect(errorReached).toBe(false);
//            done();
//        };
//
//
//        info("ELEMENT KEY------");
//        info(connectInfo.element_key);
//        info(connectParameters.account_id);
//        pvcloud.Connect(
//                connectParameters.base_url,
//                connectParameters.account_descriptor,
//                connectParameters.app_descriptor,
//                connectInfo.element_key,
//                successCallback,
//                errorCallback,
//                finallyCallback
//                );
//    });
//
//    describe("UNDER App Context (have an app_key and element_key on our side.", function () {
//
//        it("SHOULD BE ABLE TO CALL OUT APP_KEY AND ELEMENT_KEY", function (done) {
//            info("APP CONNECT INFO");
//            info(connectInfo);
//            expect(connectInfo).not.toBe(undefined);
//            expect(connectInfo.account_id).toBe(2);
//            expect(connectInfo.app_id).toBe(19);
//            done();
//        });
//
//        it("SHOULD BE ABLE TO WRITE DATA TO TEST APP USING LAST CONNECT INFO", function (done) {
//            var testHint = "SEND DATA TO AN APP ";
//            var errorReached = false;
//            var successReached = false;
//            var successCallback = function (error, response, body) {
//                successReached = true;
//                info(testHint + ": Success Callback Reached!");
//
//                var body = JSON.parse(response.body);
//                var dataWritten = body.data;
//                info(testHint + ": DATA WRITTEN!");
//                info(dataWritten);
//                expect(body.status).toBe("OK");
//                expect(error).toBeFalsy();
//                expect(response).not.toBe(undefined);
//                expect(body).not.toBe(undefined);
//
//            };
//            var errorCallback = function (error, response, body) {
//                errorReached = true;
//                info(testHint + ": Error Callback Reached!!!!!");
//                info("BODY----------------------");
//                info(body);
//                expect(error).not.toBe(undefined);
//            };
//            var finallyCallback = function (error, response, body) {
//                info(testHint + ": Finally Callback Reached");
//
//                expect(successReached).toBe(true);
//                expect(errorReached).toBe(false);
//                done();
//            };
//
//
//            var label = "TEST LABEL";
//            var value = "TEST VALUE";
//
//            pvcloud.Write(
//                    baseURL,
//                    connectInfo.app_id,
//                    connectInfo.app_key,
//                    connectInfo.element_key,
//                    label,
//                    value,
//                    undefined,
//                    successCallback,
//                    errorCallback,
//                    finallyCallback);
//        });
//
//        it("SHOULD BE ABLE TO READ DATA FROM TEST APP USING LAST CONNECT INFO", function (done) {
//            var testHint = "READ DATA FROM APP ";
//            var errorReached = false;
//            var successReached = false;
//            var successCallback = function (error, response, body) {
//                successReached = true;
//                info(testHint + ": Success Callback Reached!");
//
//                var bodyObject = JSON.parse(body);
//                var dataReceived = bodyObject.data;
//                info(testHint + ": DATA RECEIVED!");
//                info(dataReceived);
//                info(dataReceived.length);
//                expect(bodyObject.status).toBe("OK");
//                expect(error).toBeFalsy();
//                expect(response).not.toBe(undefined);
//                expect(bodyObject).not.toBe(undefined);
//
//            };
//            var errorCallback = function (error, response, body) {
//                errorReached = true;
//                info(testHint + ": Error Callback Reached!");
//                expect(error).not.toBe(undefined);
//            };
//            var finallyCallback = function (error, response, body) {
//                info(testHint + ": Finally Callback Reached");
//
//                expect(successReached).toBe(true);
//                expect(errorReached).toBe(false);
//                done();
//            };
//
//
//            var label = "TEST LABEL";
//            var count = 2;
//            pvcloud.Read(
//                    baseURL,
//                    connectInfo.app_id,
//                    connectInfo.app_key,
//                    connectInfo.element_key,
//                    label,
//                    count,
//                    successCallback,
//                    errorCallback,
//                    finallyCallback);
//        });
//
//        it("SHOULD BE ABLE TO READ ALL DATA USING * WILDCARDS", function (done) {
//            var testHint = "READ DATA FROM APP ";
//            var errorReached = false;
//            var successReached = false;
//            var successCallback = function (error, response, body) {
//                successReached = true;
//                info(testHint + ": Success Callback Reached!");
//
//                var bodyObject = JSON.parse(body);
//                var dataReceived = bodyObject.data;
//                info(testHint + ": DATA RECEIVED!");
//                info(dataReceived);
//                info(dataReceived.length);
//                expect(bodyObject.status).toBe("OK");
//                expect(error).toBeFalsy();
//                expect(response).not.toBe(undefined);
//                expect(bodyObject).not.toBe(undefined);
//
//            };
//            var errorCallback = function (error, response, body) {
//                errorReached = true;
//                info(testHint + ": Error Callback Reached!");
//                expect(error).not.toBe(undefined);
//            };
//            var finallyCallback = function (error, response, body) {
//                info(testHint + ": Finally Callback Reached");
//
//                expect(successReached).toBe(true);
//                expect(errorReached).toBe(false);
//                done();
//            };
//
//
//            var label = "TEST LABEL 1235";
//
//            pvcloud.Read(
//                    baseURL,
//                    connectInfo.app_id,
//                    connectInfo.app_key,
//                    connectInfo.element_key,
//                    "*",
//                    200000,
//                    successCallback,
//                    errorCallback,
//                    finallyCallback);
//        });
//
//        it("SHOULD BE ABLE TO DELETE TWO RECORDS OF DATA USING * WILDCARDS", function (done) {
//            var testHint = "READ DATA FROM APP ";
//            var errorReached = false;
//            var successReached = false;
//            var successCallback = function (error, response, body) {
//                successReached = true;
//                info(testHint + ": Success Callback Reached!");
//
//                var bodyObject = JSON.parse(body);
//                var dataReceived = bodyObject.data;
//                info(testHint + ": DATA RECEIVED!");
//                info(dataReceived);
//                info(dataReceived.length);
//                expect(bodyObject.status).toBe("OK");
//                expect(error).toBeFalsy();
//                expect(response).not.toBe(undefined);
//                expect(bodyObject).not.toBe(undefined);
//
//            };
//            var errorCallback = function (error, response, body) {
//                errorReached = true;
//                info(testHint + ": Error Callback Reached!");
//                expect(error).not.toBe(undefined);
//            };
//            var finallyCallback = function (error, response, body) {
//                info(testHint + ": Finally Callback Reached");
//
//                expect(successReached).toBe(true);
//                expect(errorReached).toBe(false);
//                done();
//            };
//
//
//            pvcloud.Delete(
//                    baseURL,
//                    connectInfo.app_id,
//                    connectInfo.app_key,
//                    connectInfo.element_key,
//                    "*",
//                    2,
//                    successCallback,
//                    errorCallback,
//                    finallyCallback);
//        });
//
//        it("SHOULD BE ABLE TO DELETE ALL DATA USING * WILDCARDS", function (done) {
//            var testHint = "READ DATA FROM APP ";
//            var errorReached = false;
//            var successReached = false;
//            var successCallback = function (error, response, body) {
//                successReached = true;
//                info(testHint + ": Success Callback Reached!");
//
//                var bodyObject = JSON.parse(body);
//                var dataReceived = bodyObject.data;
//                info(testHint + ": DATA RECEIVED!");
//                info(dataReceived);
//                info(dataReceived.length);
//                expect(bodyObject.status).toBe("OK");
//                expect(error).toBeFalsy();
//                expect(response).not.toBe(undefined);
//                expect(bodyObject).not.toBe(undefined);
//
//            };
//            var errorCallback = function (error, response, body) {
//                errorReached = true;
//                info(testHint + ": Error Callback Reached!");
//                expect(error).not.toBe(undefined);
//            };
//            var finallyCallback = function (error, response, body) {
//                info(testHint + ": Finally Callback Reached");
//
//                expect(successReached).toBe(true);
//                expect(errorReached).toBe(false);
//                done();
//            };
//
//            pvcloud.Delete(
//                    baseURL,
//                    connectInfo.app_id,
//                    connectInfo.app_key,
//                    connectInfo.element_key,
//                    "*",
//                    "*",
//                    successCallback,
//                    errorCallback,
//                    finallyCallback);
//        });
//
//        it("SHOULD BE ABLE TO UPLOAD A FILE", function (done) {
//            var testHint = "SEND FILE TO AN APP ";
//            var errorReached = false;
//            var successReached = false;
//            var successCallback = function (error, response, body) {
//                successReached = true;
//                info(testHint + ": Success Callback Reached!");
//
//                var body = JSON.parse(response.body);
//                var dataWritten = body.data;
//                info(testHint + ": DATA WRITTEN!");
//                info(dataWritten);
//                expect(body.status).toBe("OK");
//                expect(error).toBeFalsy();
//                expect(response).not.toBe(undefined);
//                expect(body).not.toBe(undefined);
//
//            };
//            var errorCallback = function (error, response, body) {
//                errorReached = true;
//                info(testHint + ": Error Callback Reached!!!!!");
//                info("BODY----------------------");
//                info(response.body);
//                expect(error).not.toBe(undefined);
//            };
//            var finallyCallback = function (error, response, body) {
//                info(testHint + ": Finally Callback Reached");
//                info(response.body);
//                expect(successReached).toBe(true);
//                expect(errorReached).toBe(false);
//                done();
//            };
//
//
//            var label = "TEST LABEL";
//            var filePath = "index.js";
//
//            pvcloud.SendFile(
//                    baseURL,
//                    connectInfo.app_id,
//                    connectInfo.app_key,
//                    connectInfo.element_key,
//                    label,
//                    filePath,
//                    undefined /*Captured Datetime*/,
//                    successCallback,
//                    errorCallback,
//                    finallyCallback);
//        });
//
//        //TODO: MISSING TESTS
//        // WRITE WITH MISSING PARAMETERS
//        // READ FOR SPECIFIC LABEL
//        // READ FOR SPECIFIC LABEL NOT PRESENT
//        // READ FOR * WILDCARD LABEL
//        // READ FOR SPECIFIC LABEL WITH NO COUNT
//        // READ FOR SPECIFIC LABEL WITH COUNT
//        // READ FOR SPECIFIC LABEL WITH COUNT OF * WILDCARD
//        // DELETE FOR LABEL OF * WILDCARD AND SPECIFIC COUNT
//        // MISSING ROUTES and other NETWORK FAILURES... how should pvcloud_lib process those?
//
//    });



});

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