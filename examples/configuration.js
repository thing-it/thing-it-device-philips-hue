module.exports = {
    label: "Suite 1302 Lighting",
    id: "suite1302Lighting",
    devices: [{
        label: "Philips Hue Bridge",
        id: "philipsHueBridge",
        plugin: "philips-hue/hueBridge",
        logLevel: "debug",
        configuration: {},
        actors: [{
            id: "lightBulbKitchenCounter",
            label: "Light Bulb Kitchen Counter",
            type: "lightBulb",
            configuration: {
                "index": 1
            }
        }, {
            id: "lightBulbCouch",
            label: "Light Bulb Couch",
            type: "lightBulb",
            configuration: {
                "index": 2
            }
        }, {
            id: "lightBulbBar",
            label: "Light Bulb Bar",
            type: "lightBulb",
            configuration: {
                "index": 3
            }
        }], sensors: []
    }],
    groups: [],
    services: [{
        id: "blackout",
        label: "Blackout",
        type: "script",
        content: {
            script: "artNetUniverse1.rgbLed1.off(); artNetUniverse1.rgbLed2.off();artNetUniverse1.simpleLight.off();" +
            "artNetUniverse1.fogMachine.off();artNetUniverse1.movingHead.off();"
        }
    }],
    eventProcessors: [],
    data: []
};
