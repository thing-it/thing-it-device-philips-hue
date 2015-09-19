# thing-it-device-philips-hue

[![NPM](https://nodei.co/npm/thing-it-device-philips-hue.png)](https://nodei.co/npm/thing-it-device-philips-hue/)
[![NPM](https://nodei.co/npm-dl/thing-it-device-philips-hue.png)](https://nodei.co/npm/thing-it-device-philips-hue/)

[thing-it-node] Device Plugin for Philips Hue Bridge to control Philips Hue Light Bulbs and Philips Hue Living Color Lamps.

This allows you to 

* control Philips Hue Bulbs and Lamps over the Internet,
* define complex scenes, storyboards and timer controlled execution 

by means of [thing-it-node](https://github.com/marcgille/thing-it-node) and [thing-it.com](http://www.thing-it.com).

## Autodiscovery

The **[thing-it-device-philips-hue]** plugin supports Autodiscovery.

Add

```
autoDiscoveryDeviceTypes: [{
        plugin: "philips-hue/hueBridge",
        confirmRegistration: false,
        persistRegistration: false,
        defaultConfiguration: {
        },
        options: {}
    }]
```

in your Node Configuration (e.g. the [sample configuration]("./examples.configuration")) or enable Autodiscovery for the [thing-it-device-philips-hue] Device in your 
[thing-it.com](http://www.thing-it.com) Mesh and start [thing-it-node] with even an empty configuration (besides the above).

Start [thing-it-node], connect your Philips Hue Bridge to the same network as the [thing-it-node] Box and push the 
Link Button on the Philips Hue Bridge.

[thing-it-node] will automatically add all Light Bulbs and Living Color Lamps to your [thing-it-node] Configuration and 
you will be able control these from [thing-it] Mobile.

## Mobile UI

The following screenshot shows the Node Page of the [sample configuration]("./examples.configuration"):

<p align="center"><a href="./documentation/images/mobile-ui.png"><img src="./documentation/images/mobile-ui.png" width="70%" height="70%"></a></p>
