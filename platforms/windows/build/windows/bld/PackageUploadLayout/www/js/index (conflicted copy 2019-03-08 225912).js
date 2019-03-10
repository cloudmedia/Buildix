var server;
var serverName;
var login = false;
var navLoaded = false;
var notifyD;

window.prevFocus = $();
$(document).on('focusin', ':input[type=text], :input[type=email], :input[type=tel], :input[type=password], :input[type=number], textarea, select', function () {
    window.prevFocus = $(this);
});

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        $(document).touch(function(e){
            $(".notify2").each(function(){
                hideNotify2($(this));
            });
        });

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        server = localStorage.getItem('server');
        serverName = localStorage.getItem('serverName');

        initMain();

        if (!localStorage.getItem('did')) {
            var gen = new IDGenerator();
            localStorage.setItem('did', gen.generate() + gen.generate());
        }

        $("#main-connect-btn").unbind().touch(function () {
            $("#main-h1").text("Connecting...");
            var newServer = $("#main-server").val().toLowerCase();
            var valid = new Valid(newServer);
            if (valid.isHostname()) {
                serverName = newServer;
                server = 'https://' + newServer;
                localStorage.setItem('server', server);
                localStorage.setItem('serverName', serverName);
                window.location.replace("index.html");
            } else {
                notify2(valid.message);
            }
        });

        $("#main-server").focus(function () {
            $(this).select();
        });

        if (server) {
            $("#main-h1").text("Connecting...").addClass("animated pulse infinite");
            console.log('Received Event: ' + id);
            console.log('Connecting to ' + server + '...');
            $.ajax({
                url: server + '/login?action=get-status',
                method: 'get',
                timeout: 5000,
                dataType: 'json',
                success: processStatus,
                error: function(e) {
                    $("#main-server").val(serverName);
                    $("#main-h1").text("Connection Failed!");
                    localStorage.setItem('oldServer', serverName);
                    server = null;
                    serverName = null;
                    localStorage.removeItem('server');
                    localStorage.removeItem('serverName');
                    errorConnect(e);
                }
            });
            console.log("done");
        } else {
            if (localStorage.getItem('oldServer')) $("#main-server").val(localStorage.getItem('oldServer'));
        }
    }
};

app.initialize();

function processStatus(data) {
    if (data.status == 1) {
        login = true;
        doLogin();
    } else {
        $("#main").load('html/login.html');
    }
}

function errorConnect(e) {
    var errServer = serverName;
    if (errServer == null || errServer == 'null') errServer = localStorage.getItem('oldServer');
    if (errServer == null || typeof errServer === typeof undefined || errServer == 'null') errServer = "the server";
    loadingOff();
    if (e.status == '200') {
        notify2(e.responseText, 'error', false);
    } else {
        notify2("Failed to connect to " + errServer + "! ERROR: HTTP-" + e.status, 'error', false);
    }
}

function mainLoad(url, src, effect) {
    sounds.play('bubble');
    scrollTop();
    loadingOn();
    if (typeof effect === typeof undefined) effect = 'slideInRight';
    if (typeof src === typeof undefined) src = 'server';
    var prefix = server;
    if (src == 'local') prefix = "html";
    $("#main").load(prefix + url, function () {
        $(".box").each(function () {
            var last = $(this).data('lastEffect');
            var speed = $(this).data('speed');
            if (typeof last === typeof undefined) last = "";
            if (typeof speed === typeof undefined) speed = 'faster';
            if (effect == 'bounceIn') speed = 'fast';
            if (effect == 'back') effect = 'slideInLeft';
            $(this).removeClass('animated ' + speed + ' ' + last).hide().data('lastEffect', effect);
            $(this).addClass('animated ' + speed + ' ' + effect).show();
        });
    });
}

function initMain() {
    loadingOff();

    $(".btnLoad").unbind().touch(function () {
        var url = $(this).data('url');
        var src = $(this).data('src');
        var effect = $(this).data('effect');
        mainLoad(url, src, effect);
    });

    $(".logout-btn").unbind().touch(function () {
        askLogout();
    });

    $(".reset-btn").unbind().touch(function () {
        window.location.replace("index.html");
    });

    $(".help").unbind().touch(function () {
        var topic = $(this).data('topic');
        loadingOn();
        var help_url = server + '/get-help?topic=' + topic;
        $.ajax({
            url: help_url,
            method: 'get',
            timeout: 5000,
            dataType: 'json',
            success: function (data) {
                loadingOff();
                if (data.status == 1) {
                    notify2(data.help.help_message, data.help.help_class, false);
                } else {
                    notify2(data.message);
                }
            },
            error: errorConnect
        });
    });

    $(".username").unbind().touch(function () {
        mainLoad('/account');
    });

    if (navLoaded) initNav();
}

function loadingOn() {
    $("#site-logo-svg").attr('src', 'images/bx-loading.svg').removeClass().addClass('animated infinite pulse');
}

function loadingOff() {
    $("#site-logo-svg").attr('src', 'images/bx-logo.svg').removeClass().addClass('animated rubberBand');
}

function askLogout() {
    var n = new Notify2("Are you sure you want to log out?", "info");
    n.setBindEvent('touchstart');
    n.doConfirm(doLogout);
    n.notify();
}

function doLogin() {
    sounds.play('swinga');
    loadingOn();
    notifyD = new NotifyD(server + '/api/notifyd');
    notifyD.start();
    mainLoad('/api/dashboard', 'server', 'bounceIn');
    setTimeout(function () {
        reloadNav();
    }, 1000);
}

function testNotify(n) {
    notify2("It worked!", "success");
}

function reloadNav() {
    loadingOn();
    $("#nav-vp").load(server + "/api/get-nav", function(){
        initMain();
    });
}

function doLogout(n) {
    notifyD.stop();
    scrollTop();
    $.getJSON(server + '/logout?action=app', function (data) {
        if (data.status == 1) {
            window.location.replace('index.html');
        } else {
            notify2(data.message);
        }
    });
}

$.fn.touch = function (callback) {
    var touch = false;
    $(this).on("click", function(e){
        if (!touch)
        {
            let callbackReal = callback.bind(this);
            callbackReal(this, e);
        }else{
            touch = true;
        }
        touch = false;
    });
    $(this).on("touchstart", function(e){
        if (typeof e.touches != typeof undefined)
        {
            e.preventDefault();
            touch = true;
            let callbackReal = callback.bind(this);
            callbackReal(this, e);
        }
    });
}

$.fn.ok = function () {
    $(this).data('orig-bg', $(this).css('background-color'));
    $(this).css('background-color', 'green');
}

$.fn.bad = function () {
    $(this).data('orig-bg', $(this).css('background-color'));
    $(this).css('background-color', '#a76363');
}

$.fn.normal = function () {
    $(this).css('background-color', $(this).data('orig-bg'));
}

function scrollTop() {
    $("html, body").animate({
        scrollTop: 0
    }, "fast");
    return false;
}

function dump(arr, level) {
    var dumped_text = "";
    if (!level) level = 0;

    //The padding given at the beginning of the line.
    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";

    if (typeof (arr) == 'object') { //Array/Hashes/Objects
        for (var item in arr) {
            var value = arr[item];

            if (typeof (value) == 'object') { //If it is an array,
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += dump(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else { //Stings/Chars/Numbers etc.
        dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    }
    return dumped_text;
}

function IDGenerator() {

    this.length = 8;
    this.timestamp = +new Date;

    var _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.generate = function () {
        var ts = this.timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";

        for (var i = 0; i < this.length; ++i) {
            var index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return id;
    }
}

function timeStamp() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}