module.exports = {
    label: "Suite 1302 Lighting",
    id: "suite1302Lighting",
    autoDiscoveryDeviceTypes: [{
        plugin: "philips-hue/hueBridge",
        confirmRegistration: true,
        persistRegistration: false,
        defaultConfiguration: {
        },
        options: {}
    }],
    devices: [{
        label: "Philips Hue Bridge",
        id: "philipsHueBridge",
        plugin: "philips-hue/hueBridge",
        logLevel: "debug",
        configuration: {host: "192.168.1.4", userName: "6a61bcc3553ea0f220fc7a4196781a7"},
        actors: [{
            id: "lightBulbKitchenCounter",
            label: "Light Bulb Kitchen Counter",
            type: "lightBulb",
            configuration: {
                id: 1
            }
        }, {
            id: "lightBulbCouch",
            label: "Light Bulb Couch",
            type: "lightBulb",
            configuration: {
                id: 2
            }
        }, , {
            id: "livingColorLampBar",
            label: "Living Color Lamp Bar",
            type: "livingColorLamp",
            configuration: {
                id: 3
            }
        }], sensors: []
    }],
    groups: [{
        id: "group1",
        label: "Lounge",
        icon: "icon sl-house-1",
        devices: [],
        actors: ["philipsHueBridge.lightBulbKitchenCounter", "philipsHueBridge.lightBulbCouch"]
    }, {
        id: "group2",
        label: "Bar",
        icon: "icon sl-cocktail-1",
        devices: [],
        actors: ["philipsHueBridge.livingColorLampBar"]
    }],
    services: [{
        id: "blackout",
        label: "Blackout",
        type: "script",
        content: {
            script: ""
        }
    }],
    eventProcessors: [],
    data: []
};
