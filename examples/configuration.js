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
        configuration: {host: "192.168.1.4", userName: "2752a546106c35443652a19216b6953f"},
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
        }], sensors: []
    }],
    groups: [{
        id: "group1",
        label: "Lounge",
        icon: "icon sl-house-1",
        devices: [],
        actors: ["philipsHueBridge.lightBulbCouch"]
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
