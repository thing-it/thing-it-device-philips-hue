var hue = require('node-hue-api');

this.hueApi = hue.HueApi('192.168.0.213', 'SZhAUanuPiWJg5Uyx-LYshuhmLW2CHT66OUQjvAA');

this.hueApi.groups().then((groups) => {
   console.log('Groups: ' + JSON.stringify(groups));
});