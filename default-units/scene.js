module.exports = {
    metadata: {
        plugin: "scene",
        label: "Scene",
        role: "actor",
        family: "scene",
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
        }],
        state: [{
            label: "Scene Active",
            id: "sceneActive",
            type: {
                id: "boolean"
            }
        }],
        configuration: [{
            label: "Scene Name",
            id: "sceneName",
            type: {
                id: "string"
            },
        }, {
            label: "Room Name",
            id: "roomName",
            type:{
                id: "string"
            }
        }]
    },
    create: function () {
        return new Scene();
    }
};

var q = require('q');
var hue = require('node-hue-api');

function Scene(){
    /**
     *
     */
    Scene.prototype.start = function(){
        if(!this.sceneActive){
            this.sceneActive = false;
        }
        this.publishStateChange();
    };

    /**
     *
     */
    Scene.prototype.stop = function () {

    };

    /**
     *
     */
    Scene.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    Scene.prototype.setState = function (state){
    };


    /**
     *
     */
    Scene.prototype.on = function () {
        this.state.sceneActive = true;
        var sceneId;
        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            this.device.hueApi.scenes()
                .then(function(scene){
                    for(n in scene){
                        if(scene[n].name === this.configuration.sceneName){
                            sceneId = scene[n].id;
                            this.device.hueApi.activateScene(sceneId).then(function(result){
                                this.logDebug("Scene Active: ", result);
                                this.publishStateChange();
                            }.bind(this)).done();
                        }
                    }
                }.bind(this)).done();
        }
    };

    /**
     *
     */
    Scene.prototype.off = function () {
        this.state.sceneActive = false;

        if (this.isSimulated()) {
            this.publishStateChange();
        } else {
            var groupId;
            this.device.hueApi.groups().then(function(group){
                for(n in group){
                    if(group[n].name === this.configuration.roomName){
                        groupId = group[n].id;
                        console.log(groupId);
                        this.device.hueApi.setGroupLightState(groupId, hue.lightState.create().off()).then(function (result) {
                            this.logDebug("Scene Not Active: ",result);
                            this.publishStateChange();
                        }.bind(this)).done();
                    }
                }
            }.bind(this)).done();
        }
    };

    /**
     *
     */
    Scene.prototype.toggle = function () {
        if (this.state.on) {
            this.off();
        }
        else {
            this.on();
        }
    };
}