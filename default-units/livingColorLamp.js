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
        }, {
            id: "setBrightness",
            label: "Set Brightness"
        }, {
            id: "setRgbHex",
            label: "Set RGB Hexadecimal"
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
var hue;

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
            var rgb = hslToRgb(this.state.hue, this.state.saturation, this.state.brightness);

            this.state.rgbHex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        }
        else {
            var rgb = hslToRgb(this.lightState.hue, this.lightState.sat, this.lightState.bright);

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
                reachable: this.lightState.reachable,
                rgbHex: rgbToHex(rgb[0], rgb[1], rgb[2])
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

    /**
     *
     */
    LivingColorLamp.prototype.setBrightness = function (parameters) {
        if (this.isSimulated()) {
            this.state.brightness = parameters.brightness / 100 * 255; // TODO Correct?

            this.publishStateChange();
        } else {
            this.device.hue.setLightState(this.configuration.id, this.lightState.brightness(parameters.brightness)).
                then(function () {
                    this.publishStateChange();
                }.bind(this));
        }
    };

    /**
     *
     */
    LivingColorLamp.prototype.setRgbHex = function (parameters) {
        var rgb = hexToRgb(parameters.rgbHex);
        var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        if (this.isSimulated()) {
            this.state.hue = hsl[0];
            this.state.saturation = hsl[1];
            this.state.brightness = hsl[2];

            this.publishStateChange();
        } else {
            this.device.hue.setLightState(this.configuration.id, this.lightState.rgb(rgb.r, rgb.g, rgb.b)).
                then(function () {
                    this.publishStateChange();
                }.bind(this));
        }
    };
};

/**
 *
 * @param hex
 * @returns
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 *
 * @param r
 * @param g
 * @param b
 * @returns {String}
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}


