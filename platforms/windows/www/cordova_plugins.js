cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "phonegap-plugin-push.PushNotification",
    "file": "plugins/phonegap-plugin-push/www/push.js",
    "pluginId": "phonegap-plugin-push",
    "clobbers": [
      "PushNotification"
    ]
  },
  {
    "id": "phonegap-plugin-push.PushPlugin",
    "file": "plugins/phonegap-plugin-push/src/windows/PushPluginProxy.js",
    "pluginId": "phonegap-plugin-push",
    "runs": true
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-splashscreen.SplashScreenProxy",
    "file": "plugins/cordova-plugin-splashscreen/www/windows/SplashScreenProxy.js",
    "pluginId": "cordova-plugin-splashscreen",
    "runs": true
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "phonegap-plugin-push": "2.2.3",
  "cordova-plugin-splash": "1.0.0",
  "cordova-plugin-splashscreen": "5.0.2"
};
// BOTTOM OF METADATA
});