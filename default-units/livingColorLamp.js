module.exports = {
    metadata: {
        plugin: "livingColorLamp",
        label: "Living Color Lamp",
        role: "actor",
        family: "livingColorLamp",
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
            id: "hsl",
            label: "Set HSL"
        }, {
            id: "shortAlert",
            label: "Short Alert"
        }, {
            id: "longAlert",
            label: "Long Alert"
        }],
        state: [
            {
                id: "on", label: "On",
                type: {
                    id: "boolean"
                }
            },
            {
                id: "brightness", label: "Brightness",
                type: {
                    id: "integer"
                }
            },
            {
                id: "hue", label: "Hue",
                type: {
                    id: "integer"
                }
            },
            {
                id: "saturation", label: "Saturation",
                type: {
                    id: "integer"
                }
            },
            {
                id: "x", label: "X",
                type: {
                    id: "integer"
                }
            },
            {
                id: "y", label: "Y",
                type: {
                    id: "integer"
                }
            },
            {
                id: "colorTemperature", label: "Color Temperature",
                type: {
                    id: "integer"
                }
            },
            {
                id: "alert", label: "Alert",
                type: {
                    id: "string"
                }
            },
            {
                id: "effect", label: "Effect",
                type: {
                    id: "string"
                }
            },
            {
                id: "colorMode", label: "Color Mode",
                type: {
                    id: "string"
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
        return new LivingColorLamp();
    }
};

var q = require('q');

/**
 *
 */
function LivingColorLamp() {
    /**
     *
     */
    LivingColorLamp.prototype.start = function () {
        var deferred = q.defer();

        if (this.isSimulated()) {
            this.state = {
                on: true,
                brightness: 254,
                hue: 34515,
                saturation: 236,
                x: 0.3138,
                y: 0.3239,
                colorTemperature: 153,
                alert: "none",
                effect: "none",
                colorMode: "ct",
                reachable: true
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
    LivingColorLamp.prototype.getState = function () {
        if (this.isSimulated()) {
            return this.state;
        }
        else {
            return {
                on: this.lightState.on,
                brightness: this.lightState.bright,
                hue: this.lightState.hue,
                saturation: this.lightState.sat,
                x: this.lightState.xy[0],
                y: this.lightState.xy[1],
                colorTemperature: this.lightState.ct,
                alert: this.lightState.alert,
                effect: this.lightState.effect,
                colorMode: this.lightState.colormode,
                reachable: this.lightState.reachable
            };
        }
    };

    /**
     *
     */
    LivingColorLamp.prototype.setState = function (state) {
        if (this.isSimulated()) {
            this.state = state;

            this.publishStateChange();
        }
        else {
            this.device.hue.setLightState(this.configuration.id, {
                on: state.on,
                bright: state.brightness,
                hue: state.hue,
                sat: state.saturation,
                xy: [state.x, state.y],
                ct: state.colorTemperature,
                alert: state.alert,
                effect: state.effect,
                colormode: state.colorMode,
                reachable: state.reachable
            }).then(function () {
                this.publishStateChange();
            }.bind(this));
        }
    };

    /**
     *
     */
    LivingColorLamp.prototype.on = function () {
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
    LivingColorLamp.prototype.off = function () {
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
    LivingColorLamp.prototype.toggle = function () {
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
    LivingColorLamp.prototype.hsl = function (parameters) {
        if (this.isSimulated()) {
            this.state.hue = parameters.hue;
            this.state.saturation = parameters.saturation;
            this.state.brightness = parameters.brightness;

            this.publishStateChange();
        } else {
            this.device.hue.setLightState(this.configuration.id, this.lightState.hsl(parameters.hue, parameters.saturation, parameters.brightness)).
                then(function () {
                    this.publishStateChange();
                }.bind(this));
        }
    };

    /**
     *
     */
    LivingColorLamp.prototype.shortAlert = function (parameters) {
        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hue.setLightState(this.configuration.id, this.lightState.shortAlert()).
                then(function () {
                    this.publishStateChange();
                }.bind(this));
        }
    };


    /**
     *
     */
    LivingColorLamp.prototype.longAlert = function (parameters) {
        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hue.setLightState(this.configuration.id, this.lightState.longAlert()).
                then(function () {
                    this.publishStateChange();
                }.bind(this));
        }
    };
};
