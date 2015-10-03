var assert = require("assert");

describe('[thing-it] Philips Hue Plugin', function () {
    var testDriver;

    before(function () {
        testDriver = require("thing-it-test").createTestDriver({logLevel: "error"});

        testDriver.registerDevicePlugin(__dirname + "/../hueBridge");
        testDriver.registerUnitPlugin(__dirname + "/../default-units/lightBulb");
        testDriver.registerUnitPlugin(__dirname + "/../default-units/livingColorLamp");
    });
    describe('Start Configuration', function () {
        this.timeout(5000);

        it('should complete without error', function () {
            return testDriver.start({
                configuration: require("../examples/configuration.js"),
                heartbeat: 10
            });
        });
    });
    describe('Brightness = 0', function () {
        this.timeout(5000);

        before(function () {
            testDriver.removeAllListeners();
        });
        it('should produce Actor State Change message', function (done) {
            testDriver.addListener({
                publishActorStateChange: function (device, actor, state) {
                    if (actor.id === "lightBulbBedroom" && device.id === "philipsHueBridge" && state.brightnessPercent === 0) {
                        done();
                    }
                    else {
                        done('Unexpected Actor State Change message');
                    }
                }
            });

            //testDriver.philipsHueBridge.lightBulbBedroom.setBrightnessPercent({brightnessPercent: 100});
            //testDriver.philipsHueBridge.livingColorLampBar.setBrightnessPercent({brightnessPercent: 100});
            testDriver.philipsHueBridge.lightBulbBedroom.setBrightnessPercent({brightnessPercent: 0});
            //testDriver.philipsHueBridge.livingColorLampBar.setRgbHex({rgbHex: "#FF0000"});
        });
    });
    describe('Brightness = 100', function () {
        this.timeout(5000);

        before(function () {
            testDriver.removeAllListeners();
        });
        it('should produce Actor State Change message', function (done) {
            testDriver.addListener({
                publishActorStateChange: function (device, actor, state) {
                    if (actor.id === "lightBulbBedroom" && device.id === "philipsHueBridge" && state.brightnessPercent === 100) {
                        done();
                    }
                    else {
                        done("Unexpected Actor State Change message.");
                    }
                }
            });

            testDriver.philipsHueBridge.lightBulbBedroom.setBrightnessPercent({brightnessPercent: 100});
        });
    });
});





