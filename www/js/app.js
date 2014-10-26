/**
 * This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 94041, USA.
 *
 * This is a sample web app demonstrating how to implement a data driven application using NML.js library. This app uses Twitter Bootstrap 3, Jquery 1.10, jsviews and NMLjs. Templates are loaded from the template diretory.
 * Copyright 2014 Clickslide Limited. All rights reserved.
 * @namespace NML.js
 */
/*jshint unused: false */
/* global window, $, appconfig, NML, document */

var app = {
    isGap: false,
    nml: null,
    tmpsrc: null,
    socket: null,
    locked: true,
    lastBendValue:0,
    json: {},
    count: 0,
    // tap1: false,
    // pause: false,
    flag: false,
    // Application Constructor
    initialize: function () {
        console.log("App Init");
        app.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function () {
        console.log("App Bind Events");
        if (document.location.protocol === "file:") {
            console.log("Phonegap App");
            app.isGap = true;
            document.addEventListener(
                "deviceready",
                app.onDeviceReady,
                false
            );
        } else {
            console.log("Browser App");
            // no phonegap, start initialisation immediately
            $(document).ready(function () {
                app.onDeviceReady();
            });
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        console.log("App & Device Ready");
        app.nml = new NML();
        app.nml.initWithData = false;
        app.nml.isGap = app.isGap;
        app.nml.onGetData = app.onGetData;
        app.nml.setBaseUrl(appconfig[0].url, 'https', 'datadipity.com');
        //app.nml.loginHandler = app.onLoginOrRegister;
        app.nml.setAppConfig(appconfig);
        //app.nml.loadDialogs(app.onAppReady, app.nml, appconfig);
        app.nml.Login("ys2657@columbia.edu", "blahblah", app.onLoginOrRegister, app.nml);
        app.onGetData();
    },
    onAppReady: function () {
        /** Simple holder to tell which template system we are using **/
        app.tmpsrc = "jsviews";
        $("#alarm").hide();

        $('#loader').modal({
            backdrop: 'static',
            show: false
        });
        $('#generic').modal({
            backdrop: 'static',
            show: false
        });
        $('#loginRegister').modal({
            backdrop: 'static'
        });
    },
    recognizeSpeech:function(){
        var maxMatches = 5;
            var promptString = "Speak now. I dare you";
            var language = "en-US";
            window.plugins.speechrecognizer.startRecognize(function(result){
                if(result.toString().indexOf("open")>-1&&result.toString().indexOf("door")>-1){
                    window.location = "open.html";
                    $.get("http://10.21.12.51:8083/servo/100");
                }else if(result.toString().indexOf("close")>-1&&result.toString().indexOf("door")>-1){
                    window.location = "close.html";
                    $.get("http://10.21.12.51:8083/servo/180");
                }else if(result.toString().indexOf("heater")>-1&&result.toString().indexOf("on")>-1){
                    window.location = "warm.html";
                }else if(result.toString().indexOf("conditioner")>-1&&result.toString().indexOf("on")>-1){
                    window.location = "cool.html";
                }else if(result.toString().indexOf("music")>-1&&result.toString().indexOf("on")>-1){
                    window.location = "http://youtu.be/Z0KwoJa55JU";
                }else if(result.toString().indexOf("music")>-1&&result.toString().indexOf("off")>-1){
                    window.location = "index.html";
                }
            }, function(errorMessage){
                console.error("Error message :+errorMessage");
            }, maxMatches, promptString, language);
    },
    enterExternalApp:function(){
        navigator.startApp.start("com.google.android.googlequicksearchbox", function(message) { /* success */
                console.log(message); // => OK
            },
            function(error) { /* error */
                console.log('47', error);
            }
        );
    },
    onFirstBtnClicked:function(evt){
        app.recognizeSpeech();
    },
    onSecondBtnClicked:function(evt){
        app.enterExternalApp();
    },
    // TODO: create a sequence with multiple logins
    executeLoginSequence:function(index){
        // Loop through each URL, until all are registered and Logged in
    },
    onSocketConnect:function(){
        console.log("socket connected");
        app.socket.emit('start', true);
    },
    onSocketAlert:function(data){
        app.locked = false;
        $("#unlock").click();
        $("#alarm").show();
        // send alert
        var dat = new Date();
        var mes = "TEST from Aaron:My door was opened while I was out. I was not expecting anyone. Notice created at: " + dat;
        // POST params are sent in the URL to Datadipity
        var postparams = [
            {
                name: "message",
                value: mes
            },
            {
                name: "num",
                value: "15039293684"
            }
        ];
        app.nml.get(0, app.onAlarmTriggeredResponse, true, postparams);
    },
    onAlarmTriggeredResponse:function(data){
        console.log("Made NML Request");
    },
    resetTaps:function(){
        app.tap1 = false;
        app.pause = false;
        app.count = 0;
        console.log("count = 0");
    },
    onSocketBendy:function(data){
        console.log("onSocketBendy");
        console.log(data);
        if(data>300){
            setTimeout(function(){
                app.enterExternalApp();
            }, 1200);
        }
    },
    /**
     * Callback for NML.get function
     * This is where we will process the data
     */
    onGetData: function (nmldata) {
        //app.json = JSON.parse(nmldata);
        console.log("onGetData");
        app.initGui();
        //$('body').removeClass('modal-open');
        //$('.modal-backdrop').remove();
        // setup the socket
        app.loadScript('https://cdn.socket.io/socket.io-1.1.0.js', function () {
            /* DATA SOCKET */
            app.socket = io.connect("http://10.21.12.51:8083");
            console.log(app.socket);
            app.socket.on("connect", app.onSocketConnect);
            app.socket.on('alert', app.onSocketAlert);
            app.socket.on("bendy", app.onSocketBendy);
        });
    },
    /**
     * Give all the GUI elements their event listeners
     */
    initGui:function(){
        $("#firstbtn").bind("click", function(evt){ 
            app.onFirstBtnClicked(evt);
        });
        $("#secondbtn").bind("click", function(evt){
            app.onSecondBtnClicked(evt);
        });
    },
    // custom callback for Logging in
    onLoginOrRegister: function (data) {
        // TODO: Check for login success
        if (data.session !== null && data.session !== undefined) {
            // $('#loadertext').html("Loading Tweets...");

            app.nml.onLogin(data);
            //app.nml.get(app.onGetData, true);
            //app.onGetData();
        } else {
            // add message to login modal
            app.nml.Register(
                "Yay Shin",
                "ys2657@columbia.edu",
                "blahblah",
                "blahblah",
                app.onLoginOrRegister
            );
        }
    },
    loadScript:function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        head.appendChild(script);
    },
};
