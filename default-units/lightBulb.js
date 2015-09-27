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
            id: "setBrightnessPercentage",
            label: "Set Brightness (%)"
        }],
        state: [
            {
                id: "brightness", label: "Brightness",
                type: {
                    id: "integer"
                }
            }, {
                id: "brightnessPercentage", label: "Brightness (%)",
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
            brightnessPercentage: 0,
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

            deferred.resolve();
        }


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

        this.state = state;

        if (this.isSimulated()) {
            this.publishStateChange();
        }
        else {
            this.device.hueApi.setLightState(this.configuration.id, hue.lightState.create().on().brightness(this.state.brightnessPercentage)).then(function () {
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
    LightBulb.prototype.setBrightnessPercentage = function (parameters) {
        this.state.brightnessPercentage = parameters.brightnessPercentage;
        this.state.brightness = parameters.brightnessPercentage / 100;

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hueApi.setLightState(this.configuration.id, hue.lightState.create().on().brightness(this.state.brightnessPercentage)).then(function () {
                this.publishStateChange();
            }.bind(this));
        }
    };
};
