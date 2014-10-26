cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ququplay.websocket.WebSocket/www/phonegap-websocket.js",
        "id": "com.ququplay.websocket.WebSocket.websocket",
        "clobbers": [
            "WebSocket"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.speech/SpeechRecognizer.js",
        "id": "com.phonegap.plugins.speech.SpeechRecognizer",
        "clobbers": [
            "plugins.speechrecognizer"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.startapp/www/startApp.js",
        "id": "org.apache.cordova.startapp.startapp",
        "merges": [
            "navigator.startApp"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ququplay.websocket.WebSocket": "0.1.0",
    "com.phonegap.plugins.speech": "1.0.0",
    "org.apache.cordova.startapp": "0.3.0"
}
// BOTTOM OF METADATA
});