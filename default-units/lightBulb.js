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
            id: "changeBrightness",
            label: "Change Brightness"
        }],
        state: [
            {
                id: "brightness", label: "Brightness",
                type: {
                    id: "integer"
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

        if (this.isSimulated()) {
            this.state = {
                brightness: 0
            };
        }
        else {
            if (!hue) {
                hue = require('node-hue-api');
            }

            this.lightState = hue.lightState.create();

            console.log("**************** lightstate", this.lightState);
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    LightBulb.prototype.getState = function () {
        if (this.isSimulated()) {
            return this.state;
        }
        else {
            return {
                brightness: this.lightState.bright
            };
        }
    };

    /**
     *
     */
    LightBulb.prototype.setState = function (state) {
        console.log("Set state ", state);
        if (this.isSimulated()) {
            this.state = state;

            this.publishStateChange();
        }
        else {
            this.device.hueApi.setLightState(this.configuration.id, {
                bright: state.brightness
            }).then(function () {
                this.publishStateChange();
            }.bind(this));
        }
    };

    /**
     *
     */
    LightBulb.prototype.on = function () {
        if (this.isSimulated()) {
            this.state.on = true;

            this.publishStateChange();
        } else {
            this.device.hueApi.setLightState(this.configuration.id, this.lightState.on()).then(function () {
                this.publishStateChange();
            }.bind(this));

        }
    };

    /**
     *
     */
    LightBulb.prototype.off = function () {
        if (this.isSimulated()) {
            this.state.on = false;

            this.publishStateChange();
        } else {
            this.device.hueApi.setLightState(this.configuration.id, this.lightState.off()).then(function () {
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
    LightBulb.prototype.changeBrightness = function (parameters) {
        this.setState(parameters);
    };
};
