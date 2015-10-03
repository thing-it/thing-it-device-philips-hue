module.exports = {
    metadata: {
        plugin: "lightBulb",
        label: "Light Bulb",
        role: "actor",
        family: "lightBulb",
        deviceTypes: ["philips-hue/hueBridge"],
        services: [{
            id: "on",
            label: "On"
        }, {
            id: "off",
            label: "Off"
        }, {
            id: "toggle",
            label: "Toggle"
        }, {
            id: "setBrightnessPercent",
            label: "Set Brightness (%)"
        }],
        state: [
            {
                id: "brightness", label: "Brightness",
                type: {
                    id: "integer"
                }
            }, {
                id: "brightnessPercent", label: "Brightness (%)",
                type: {
                    id: "integer"
                }
            },
            {
                id: "reachable", label: "Reachable",
                type: {
                    id: "boolean"
                }
            }],
        configuration: [{
            label: "ID",
            id: "id",
            type: {
                id: "integer"
            },
            defaultValue: "1"
        }]
    },
    create: function () {
        return new LightBulb();
    }
};

var q = require('q');
var hue;

/**
 *
 */
function LightBulb() {
    /**
     *
     */
    LightBulb.prototype.start = function () {
        var deferred = q.defer();

        this.state = {
            brightness: 0,
            brightnessPercent: 0,
            reachable: false
        };

        if (!this.isSimulated()) {
            if (!hue) {
                hue = require('node-hue-api');
            }

            this.interval = setInterval(function () {
                this.device.hueApi.lightStatus(this.configuration.id)
                    .then(function (lightState) {
                        this.state.reachable = lightState.reachable;
                    }.bind(this)).fail(function (error) {
                        this.state.reachable = false;
                    }.bind(this));
            }.bind(this), 10000);
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    LightBulb.prototype.stop = function () {
        var deferred = q.defer();

        if (this.interval) {
            clearInterval(this.interval);
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    LightBulb.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    LightBulb.prototype.setState = function (state) {
        // TODO Needs work

        this.state = {
            brightness: state.brightness ? state.brightness : this.state.brightness,
            brightnessPercent: state.brightnessPercent ? state.brightnessPercent : this.state.brightnessPercent,
            rgbHex: state.rgbHex ? state.rgbHex : this.state.rgbHex
        };

        if (this.isSimulated()) {
            this.publishStateChange();
        }
        else {
            this.device.hueApi.setLightState(this.configuration.id, hue.lightState.create().on().brightness(this.state.brightnessPercent)).then(function () {
                this.publishStateChange();
            }.bind(this));
        }
    };

    /**
     *
     */
    LightBulb.prototype.on = function () {
        this.state.on = true;
        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hueApi.setLightState(this.configuration.id, hue.lightState.create().on()).then(function () {
                this.publishStateChange();
            }.bind(this));

        }
    };

    /**
     *
     */
    LightBulb.prototype.off = function () {
        this.state.on = false;

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hueApi.setLightState(this.configuration.id, hue.lightState.create().off()).then(function () {
                this.publishStateChange();
            }.bind(this));
        }
    };

    /**
     *
     */
    LightBulb.prototype.toggle = function () {
        if (this.state.on) {
            this.off();
        }
        else {
            this.on();
        }
    };

    /**
     *
     */
    LightBulb.prototype.setBrightnessPercent = function (parameters) {
        this.state.brightnessPercent = parameters.brightnessPercent;
        this.state.brightness = parameters.brightnessPercent / 100;

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hueApi.setLightState(this.configuration.id, hue.lightState.create().on().brightness(this.state.brightnessPercent)).then(function () {
                this.publishStateChange();
            }.bind(this));
        }
    };
};
