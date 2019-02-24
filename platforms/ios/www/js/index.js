var server;
var serverName;
var login = false;
var navLoaded = false;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        server = localStorage.getItem('server');
        serverName = localStorage.getItem('serverName');

        initMain();

        if (!localStorage.getItem('did'))
        {
            var gen = new IDGenerator();
            localStorage.setItem('did', gen.generate() + gen.generate());
        }

        if (server)      
        {
            $("#main-h1").text("Connecting...");
            console.log('Received Event: ' + id);
            console.log('Connecting to '+server+'...');
            $.ajax({
                url: server+'/login?action=get-status',
                method: 'get',
                timeout: 5000,
                dataType: 'json',
                success: processStatus,
                error: errorConnect
            });
        }else{
            if (localStorage.getItem('oldServer')) $("#main-server").val(localStorage.getItem('oldServer'));

            $("#main-server").focus(function(){
                $(this).select();
            });

            $("#main-connect-btn").unbind().touch(function(){
                var newServer = $("#main-server").val();
                var valid = new Valid(newServer);
                if (valid.isHostname())
                {
                    serverName = newServer;
                    server = 'https://'+newServer;
                    localStorage.setItem('server', server);
                    localStorage.setItem('serverName', serverName);
                    window.location.replace("index.html");
                }else{
                    notify2(valid.message);
                }
            });
        }
    }
};

app.initialize();

function processStatus(data)
{
    if (data.status == 1)
    {
        login = true;
        doLogin();
    }else{
        $("#main").load('html/login.html');
    }
}

function errorConnect(e)
{
    loadingOff();
    if (e.status == '200')
    {
        notify2(e.responseText);
    }else{
        notify2("Failed to connect to "+server+"! ERROR: HTTP-"+e.status);
    }
}

function mainLoad(url, src, effect)
{
    scrollTop();
    loadingOn();
    if (typeof effect === typeof undefined) effect = 'slideInRight';
    if (typeof src === typeof undefined) src = 'server';
    var prefix = server;
    if (src == 'local') prefix = "html";
    $("#main").load(prefix+url, function(){
        $(".box").each(function(){
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

function initMain()
{
    loadingOff();

    $(".btnLoad").unbind().touch(function(){
        var url = $(this).data('url');
        var src = $(this).data('src');
        var effect = $(this).data('effect');
        mainLoad(url, src, effect);
    });

    $(".logout-btn").unbind().touch(function(){
        askLogout();
    });

    $(".reset-btn").unbind().touch(function(){
        window.location.replace("index.html");
    });

    $(".help").unbind().touch(function(){
        var topic = $(this).data('topic');
        loadingOn();
        var help_url = server+'/get-help?topic='+topic;
        $.ajax({
            url: help_url,
            method: 'get',
            timeout: 5000,
            dataType: 'json',
            success: function(data){
                loadingOff();
                if (data.status == 1)
                {
                    notify2(data.help.help_message, data.help.help_class, false);
                }else{
                    notify2(data.message);
                }
            },
            error: errorConnect
        });
    });

    $(".username").unbind().touch(function(){
        mainLoad('/account');
    });

    if (navLoaded) initNav();
}

function loadingOn()
{
    $("#site-logo-svg").attr('src', 'images/bx-loading.svg').removeClass().addClass('animated infinite pulse');
}

function loadingOff()
{
    $("#site-logo-svg").attr('src', 'images/bx-logo.svg').removeClass().addClass('animated rubberBand');
}

function askLogout()
{
    var n = new Notify2("Are you sure you want to log out?", "info");
    n.setBindEvent('touchstart');
    n.doConfirm(doLogout);
    n.notify();
}

function doLogin()
{
    loadingOn();
    mainLoad('/api/dashboard', 'server', 'bounceIn');
    setTimeout(function(){
        reloadNav();
    },1000);
}

function reloadNav()
{
    loadingOn();
    $("#nav-vp").load(server+"/api/get-nav");
}

function doLogout(n)
{
    scrollTop();
    $.getJSON(server+'/logout?action=app', function(data){
        if (data.status == 1)
        {
            loadingOn();
            $("#nav-vp").empty();
            $("#main").load('html/login.html');
        }else{
            notify2(data.message);
        }
    });
}

$.fn.touch = function(callback)
{
    if (typeof callback == 'function')
    {
        $(this).on('click touch', callback);
    }
}

$.fn.ok = function()
{
    $(this).css('background-color', 'green');
}

$.fn.bad = function()
{
    $(this).css('background-color', '#a76363');
}

function scrollTop()
{
    $("html, body").animate({ scrollTop: 0 }, "fast");
    return false;
}

function dump(arr,level)
{
    var dumped_text = "";
    if(!level) level = 0;
    
    //The padding given at the beginning of the line.
    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";
    
    if(typeof(arr) == 'object') { //Array/Hashes/Objects
     for(var item in arr) {
      var value = arr[item];
     
      if(typeof(value) == 'object') { //If it is an array,
       dumped_text += level_padding + "'" + item + "' ...\n";
       dumped_text += dump(value,level+1);
      } else {
       dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
      }
     }
    } else { //Stings/Chars/Numbers etc.
     dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    return dumped_text;
}

function IDGenerator() {

    this.length = 8;
    this.timestamp = +new Date;
    
    var _getRandomInt = function( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
    
    this.generate = function() {
        var ts = this.timestamp.toString();
        var parts = ts.split( "" ).reverse();
        var id = "";
        
        for( var i = 0; i < this.length; ++i ) {
            var index = _getRandomInt( 0, parts.length - 1 );
            id += parts[index];	 
        }
        
        return id;
    }

    
}