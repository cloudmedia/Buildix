var initLoaded=false;
var login = false;
var body = $("#body");
var server = "https://buildix.net";

// Keep track of previously focused input eles
window.prevFocus = $();
$(document).on('focusin', ':input[type=text], :input[type=email], :input[type=tel], :input[type=password], :input[type=number], textarea, select', function () {
    window.prevFocus = $(this);
});

$(document).ready(function () {
    // Check login status
    $.getJSON(server+"/login?action=get-status", function(data){
        console.log(data);
        if (data.status == 1)
        {
            $("#main").load("/html/dashboard.html");
            $("#nav-vp").load(server+"/api/get-nav");
        }else{
            $("#main").load("/html/login.html");
        }
    });
});

function initMain()
{
    loadingOff();

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

    $(".logout-btn").touch(function(){
        askLogout();
    });
    initNav();
}

function loadingOn()
{
    $("#site-logo-svg").attr('src', '/images/bx-loading.svg').removeClass().addClass('animated infinite pulse');
}

function loadingOff()
{
    $("#site-logo-svg").attr('src', '/images/bx-logo.svg').removeClass().addClass('animated rubberBand');
}

function askLogout()
{
    var n = new Notify2("Are you sure you want to log out?", "info");
    n.doConfirm('doLogout()');
    n.notify();
}

function doLogout()
{
    scrollTop();
    $.getJSON(server+'/logout?action=app', function(data){
        if (data.status == 1)
        {
            window.location.replace("/");
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