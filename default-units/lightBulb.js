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
            id: "changeIntensity",
            label: "Change Intensity"
        }],
        state: [
            {
                id: "intensity", label: "Intensity",
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
                intensity: 0
            };
        }
        else {
            if (!hue) {
                hue = require('node-hue-api');
            }

            this.lightState = hue.lightState.create();
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
                intensity: this.lightState.bright
            };
        }
    };

    /**
     *
     */
    LightBulb.prototype.setState = function (state) {
        if (this.isSimulated()) {
            this.state = state;

            this.publishStateChange();
        }
        else {
            this.device.hue.setLightState(this.configuration.id, {
                bright: state.intensity
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
            this.device.hue.setLightState(this.configuration.id, this.lightState.on()).then(function () {
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
            this.device.hue.setLightState(this.configuration.id, this.lightState.on()).then(function () {
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
    LightBulb.prototype.changeIntensity = function (parameters) {
        if (this.isSimulated()) {
            this.state.intensity = parameters.intensity;

            this.publishStateChange();
        } else {
            //this.device.hue.setLightState(this.configuration.id, this.lightState.hsl(parameters.hue, parameters.saturation, parameters.brightness)).
            //    then(function () {
            //        this.publishStateChange();
            //    }.bind(this));
        }
    };
};
