var request = require("request");
var pvcloud = require("../index.js");
pvcloud = pvcloud.pvcloudAPI;
var baseURL = "http://crmakers.intel.com:8080/pvcloud_test/backend/";
var loginInfo;
var appConnectInfo;
var account_id = 0;
var app_id = 0;
var app_key = "";
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
                appConnectInfo = body.data;
                info(testHint + ": CONNECT INFO!");
                info(appConnectInfo);
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

        describe("UNDER App Context (have an app_key and element_key on our side.", function () {
            
            it("SHOULD BE ABLE TO CALL OUT APP_KEY AND ELEMENT_KEY", function (done) {
                info("APP CONNECT INFO");
                info(appConnectInfo);
                expect(appConnectInfo).not.toBe(undefined);
                expect(appConnectInfo.account_id).toBe(2);
                expect(appConnectInfo.app_id).toBe(19);
                done();
            });

            it("SHOULD BE ABLE TO WRITE DATA TO TEST APP USING LAST CONNECT INFO", function (done) {
                var testHint = "SEND DATA TO AN APP ";
                var errorReached = false;
                var successReached = false;
                var successCallback = function (error, response, body) {
                    successReached = true;
                    info(testHint + ": Success Callback Reached!");

                    var body = JSON.parse(response.body);
                    var dataWritten = body.data;
                    info(testHint + ": DATA WRITTEN!");
                    info(dataWritten);
                    expect(body.status).toBe("OK");
                    expect(error).toBeFalsy();
                    expect(response).not.toBe(undefined);
                    expect(body).not.toBe(undefined);

                };
                var errorCallback = function (error, response, body) {
                    errorReached = true;
                    info(testHint + ": Error Callback Reached!!!!!");
                    info("BODY----------------------");
                    info(body);
                    expect(error).not.toBe(undefined);
                };
                var finallyCallback = function (error, response, body) {
                    info(testHint + ": Finally Callback Reached");

                    expect(successReached).toBe(true);
                    expect(errorReached).toBe(false);
                    done();
                };


                var label = "TEST LABEL";
                var value = "TEST VALUE";

                pvcloud.Write(
                        baseURL,
                        appConnectInfo.app_id,
                        appConnectInfo.app_key,
                        appConnectInfo.element_key,
                        label,
                        value,
                        undefined,
                        successCallback,
                        errorCallback,
                        finallyCallback);
            });

            it("SHOULD BE ABLE TO READ DATA FROM TEST APP USING LAST CONNECT INFO", function (done) {
                var testHint = "READ DATA FROM APP ";
                var errorReached = false;
                var successReached = false;
                var successCallback = function (error, response, body) {
                    successReached = true;
                    info(testHint + ": Success Callback Reached!");

                    var bodyObject = JSON.parse(body);
                    var dataReceived = bodyObject.data;
                    info(testHint + ": DATA RECEIVED!");
                    info(dataReceived);
                    info(dataReceived.length);
                    expect(bodyObject.status).toBe("OK");
                    expect(error).toBeFalsy();
                    expect(response).not.toBe(undefined);
                    expect(bodyObject).not.toBe(undefined);

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


                var label = "TEST LABEL";
                var count = 2;
                pvcloud.Read(
                        baseURL,
                        appConnectInfo.app_id,
                        appConnectInfo.app_key,
                        appConnectInfo.element_key,
                        label,
                        count,
                        successCallback,
                        errorCallback,
                        finallyCallback);
            });
            
            it("SHOULD BE ABLE TO READ ALL DATA USING * WILDCARDS", function (done) {
                var testHint = "READ DATA FROM APP ";
                var errorReached = false;
                var successReached = false;
                var successCallback = function (error, response, body) {
                    successReached = true;
                    info(testHint + ": Success Callback Reached!");

                    var bodyObject = JSON.parse(body);
                    var dataReceived = bodyObject.data;
                    info(testHint + ": DATA RECEIVED!");
                    info(dataReceived);
                    info(dataReceived.length);
                    expect(bodyObject.status).toBe("OK");
                    expect(error).toBeFalsy();
                    expect(response).not.toBe(undefined);
                    expect(bodyObject).not.toBe(undefined);

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


                var label = "TEST LABEL 1235";

                pvcloud.Read(
                        baseURL,
                        appConnectInfo.app_id,
                        appConnectInfo.app_key,
                        appConnectInfo.element_key,
                        "*",
                        200000,
                        successCallback,
                        errorCallback,
                        finallyCallback);
            });

            it("SHOULD BE ABLE TO DELETE TWO RECORDS OF DATA USING * WILDCARDS", function (done) {
                var testHint = "READ DATA FROM APP ";
                var errorReached = false;
                var successReached = false;
                var successCallback = function (error, response, body) {
                    successReached = true;
                    info(testHint + ": Success Callback Reached!");

                    var bodyObject = JSON.parse(body);
                    var dataReceived = bodyObject.data;
                    info(testHint + ": DATA RECEIVED!");
                    info(dataReceived);
                    info(dataReceived.length);
                    expect(bodyObject.status).toBe("OK");
                    expect(error).toBeFalsy();
                    expect(response).not.toBe(undefined);
                    expect(bodyObject).not.toBe(undefined);

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


                pvcloud.Delete(
                        baseURL,
                        appConnectInfo.app_id,
                        appConnectInfo.app_key,
                        appConnectInfo.element_key,
                        "*",
                        2,
                        successCallback,
                        errorCallback,
                        finallyCallback);
            });

            it("SHOULD BE ABLE TO DELETE ALL DATA USING * WILDCARDS", function (done) {
                var testHint = "READ DATA FROM APP ";
                var errorReached = false;
                var successReached = false;
                var successCallback = function (error, response, body) {
                    successReached = true;
                    info(testHint + ": Success Callback Reached!");

                    var bodyObject = JSON.parse(body);
                    var dataReceived = bodyObject.data;
                    info(testHint + ": DATA RECEIVED!");
                    info(dataReceived);
                    info(dataReceived.length);
                    expect(bodyObject.status).toBe("OK");
                    expect(error).toBeFalsy();
                    expect(response).not.toBe(undefined);
                    expect(bodyObject).not.toBe(undefined);

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

                pvcloud.Delete(
                        baseURL,
                        appConnectInfo.app_id,
                        appConnectInfo.app_key,
                        appConnectInfo.element_key,
                        "*",
                        "*",
                        successCallback,
                        errorCallback,
                        finallyCallback);
            });

            it("SHOULD BE ABLE TO UPLOAD A FILE", function (done) {
                var testHint = "SEND FILE TO AN APP ";
                var errorReached = false;
                var successReached = false;
                var successCallback = function (error, response, body) {
                    successReached = true;
                    info(testHint + ": Success Callback Reached!");

                    var body = JSON.parse(response.body);
                    var dataWritten = body.data;
                    info(testHint + ": DATA WRITTEN!");
                    info(dataWritten);
                    expect(body.status).toBe("OK");
                    expect(error).toBeFalsy();
                    expect(response).not.toBe(undefined);
                    expect(body).not.toBe(undefined);

                };
                var errorCallback = function (error, response, body) {
                    errorReached = true;
                    info(testHint + ": Error Callback Reached!!!!!");
                    info("BODY----------------------");
                    info(response.body);                    
                    expect(error).not.toBe(undefined);
                };
                var finallyCallback = function (error, response, body) {
                    info(testHint + ": Finally Callback Reached");
                    info(response.body);
                    expect(successReached).toBe(true);
                    expect(errorReached).toBe(false);
                    done();
                };


                var label = "TEST LABEL";
                var filePath = "index.js";

                pvcloud.SendFile(
                        baseURL,
                        appConnectInfo.app_id,
                        appConnectInfo.app_key,
                        appConnectInfo.element_key,
                        label,
                        filePath,
                        undefined /*Captured Datetime*/,
                        successCallback,
                        errorCallback,
                        finallyCallback);
            });

            //TODO: MISSING TESTS
            // WRITE WITH MISSING PARAMETERS
            // READ FOR SPECIFIC LABEL
            // READ FOR SPECIFIC LABEL NOT PRESENT
            // READ FOR * WILDCARD LABEL
            // READ FOR SPECIFIC LABEL WITH NO COUNT
            // READ FOR SPECIFIC LABEL WITH COUNT
            // READ FOR SPECIFIC LABEL WITH COUNT OF * WILDCARD
            // DELETE FOR LABEL OF * WILDCARD AND SPECIFIC COUNT
            // MISSING ROUTES and other NETWORK FAILURES... how should pvcloud_lib process those?

        });
    });


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