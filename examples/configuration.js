module.exports = {
    label: "Suite 1302 Lighting",
    id: "suite1302Lighting",
    autoDiscoveryDeviceTypes: [{
        plugin: "philips-hue/hueBridge",
        confirmRegistration: true,
        persistRegistration: false,
        defaultConfiguration: {},
        options: {}
    }],
    devices: [{
        label: "Philips Hue Bridge",
        id: "philipsHueBridge",
        plugin: "philips-hue/hueBridge",
        logLevel: "debug",
        configuration: {host: "192.168.1.4", userName: "6a61bcc3553ea0f220fc7a4196781a7"},
        actors: [{
            id: "lightBulbBedroom",
            label: "Light Bulb Bedroom",
            type: "lightBulb",
            configuration: {
                id: 2
            },
            logLevel: "debug"
        }, {
            id: "livingColorLampBar",
            label: "Living Color Lamp Bar",
            type: "livingColorLamp",
            configuration: {
                id: 3
            },
            logLevel: "debug"
        }], sensors: []
    }],
    groups: [],
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
