var server = null;
var login = false;
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

        initMain();

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
                error: errorStatus
            });
        }else{

        }
    }
};

app.initialize();

function processStatus(data)
{
    console.log(data);
    if (data.status == 1)
    {
        login = true;
        doLogin();
    }else{
        $("#main").load('html/login.html');
    }
}

function errorStatus()
{
    notify2("Failed to connect to "+server+"!");
}

function initMain()
{
    loadingOff();

    $("#main-connect-btn").unbind().touch(function(){
        var newServer = $("#main-server").val();
        var valid = new Valid(newServer);
        if (valid.isHostname())
        {
            server = 'https://'+newServer;
            localStorage.setItem('server', server);
            window.location.replace("index.html");
        }else{
            alert(valid.message);
        }
    });

    $(".btnLoad").unbind().touch(function(){
        scrollTop();
        loadingOn();
        var url = $(this).data('url');
        switch ($(this).data('target'))
        {
            case "main":
                $("#main").load(server+url);
            break;
            case "window":
                window.location.replace(url);
            break;
            case "blank":
                window.open(url);
            break;
        }
    });

    $(".logout-btn").unbind().touch(function(){
        askLogout();
    });

    $(".clear-btn").unbind().touch(function(){
        server = null;
        localStorage.setItem('server', null);
        window.location.replace("index.html");
    });

    $(".reset-btn").unbind().touch(function(){
        window.location.replace("index.html");
    });

    if (login) initNav();
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
    n.doConfirm('doLogout()');
    n.notify();
}

function doLogin()
{
    loadingOn();
    $("#main").load('html/dashboard.html');
    setTimeout(function(){
        $("#nav-vp").load(server+"/api/get-nav");
    },1000);
}

function doLogout()
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