var pvcloud = require("../index.js");
pvcloud = pvcloud.pvcloudAPI;

console.log(pvcloud);

describe("pvCloud API Object", function () {
    it("Must not empty", function () {
        expect(pvcloud).not.toBe(undefined);
    });

    it("Must have the minimal API functions declared", function () {
        expect(pvcloud.read).not.toBe(undefined);
        expect(pvcloud.write).not.toBe(undefined);
        expect(pvcloud.post_file).not.toBe(undefined);
        expect(pvcloud.check).not.toBe(undefined);
    });

    it("Must run Test Point Properly", function () {
        var smoketestResult = pvcloud.test();
        console.log(smoketestResult);
        expect(smoketestResult).toBe("THIS WAS JUST A TEST");
    });
});
