$(document).ready(function () {
    var doOTP = false;

    loadingOff();
    initMain();

    $("#otp-cont").hide();
    $("#server-name").text(serverName);

    if (localStorage.getItem('remember-login') == 'yes') {
        $("#login-remember").attr('checked', true);
        $("#login-id").val(localStorage.getItem('saved-login'));
    }

    if (localStorage.getItem('keep-login') == 'yes') {
        $("#keep-login").attr('checked', true);
        $("#login-id").attr('disabled', true);
        $("#login-pass").val('NoPassword4u!').attr('disabled', true);
        if (localStorage.getItem('otp-key')) {
            doOTP = true;
            var totp = new TOTP(localStorage.getItem('otp-key'), localStorage.getItem('saved-login'));
            totp.setCountDownCallback(function (totp) {
                $("#count-down-disp").text(totp.countDown);
                $("#auto-otp-cont").addClass("animated bounceIn").show();
            });
            totp.setUpdateCallback(function (totp) {
                $("#login-otp").val(totp.otp);
            });
            $("#otp-cont").show();
        }
    }

    $(".clear-btn").unbind().touch(function () {
        server = null;
        localStorage.setItem('oldServer', localStorage.getItem('serverName'));
        localStorage.removeItem('server');
        localStorage.removeItem('serverName');
        localStorage.removeItem('remember-login');
        localStorage.removeItem('saved-login');
        localStorage.removeItem('keep-login');
        localStorage.removeItem('otp-key');
        localStorage.removeItem('cookie');
        window.location.replace("index.html");
    });

    $("#login-id").onEnter('tab');
    $("#login-pass").onEnter(processLogin);

    $("#login-pin").passwordify({
        maxLength: 4,
        numbersOnly: true,
        enterKeyCallback: pinEnter
    });

    $("#login-otp").passwordify({
        maxLength: 6,
        numbersOnly: true,
        enterKeyCallback: otpEnter
    });

    $("#email-otp-btn").touch(function(){
        $("#email-otp-icon").removeClass('fa-envelope').addClass('fa-cog fa-spin');
        var me = $(this);
        var origColor = me.css('color');
        me.css('color', 'red');
        var origText = $("#email-otp-text").text();
        $("#email-otp-text").text("Sending...");
        $.getJSON(server + '/login?action=email-otp', function(data){
            me.css('color', origColor);
            $("#email-otp-text").text(origText);
            $("#email-otp-icon").removeClass('fa-cog fa-spin').addClass('fa-envelope');
            if (data.status == 3)
            {
                notify2(data.message, "mail");
            }else{
                notify2(data.message);
            }
            $("#login-otp").focus();
        });
    });

    $("#text-otp-btn").touch(function(){
        $("#text-otp-icon").removeClass('fa-sms').addClass('fa-cog fa-spin');
        var me = $(this);
        var origColor = me.css('color');
        me.css('color', 'red');
        var origText = $("#text-otp-text").text();
        $("#text-otp-text").text("Sending...");
        $.getJSON(server + '/login?action=text-otp', function(data){
            me.css('color', origColor);
            $("#text-otp-text").text(origText);
            $("#text-otp-icon").removeClass('fa-cog fa-spin').addClass('fa-sms');
            if (data.status == 3)
            {
                notify2(data.message, "mail");
            }else{
                notify2(data.message);
            }
            $("#login-otp").focus();
        });
    });

    $("#login-btn").touch(function () {
        processLogin();
    });

    $("#relogin-btn").click(function () {
        window.location.replace("index.html");
    });

    $("#test-login").click(function () {
        $("#login-id").val("Joe.Test");
        $("#login-pass").val("TestPassword1!");
    });
});

function resetLogin() {
    localStorage.removeItem('keep-login');
    localStorage.removeItem('otp-key');
    localStorage.removeItem('cookie');
    $("#login-form").hide();
    $("#login-error").addClass("animated bounceIn").show();
}

function pinEnter(pin)
{
    processLogin();
}

function otpEnter(otp)
{
    processLogin();
}

function processLogin()
{
    scrollTop();
    if ($("#login-id").val().length < 3) {
        $("#loadin-id").notifyForm("Please enter a valid user ID (Email, Username, or User ID#)");
        return false;
    }
    var val = new Valid($("#login-pass").val())
    if (!val.valPass()) {
        $("#login-pass").notifyForm("Please enter a valid password!");
        return false;
    }

    var sub = new Submit(server + '/login?action=login');
    sub.addData('id', $("#login-id").val());
    sub.addData('pass', $("#login-pass").val());
    sub.addData('pin', $("#login-pin").val());
    sub.addData('otp', $("#login-otp").val());
    sub.addData('did', localStorage.getItem('did'));
    if ($("#login-remember").is(':checked')) {
        localStorage.setItem('remember-login', 'yes');
    } else {
        localStorage.setItem('remember-login', 'no');
        localStorage.removeItem('saved-login');
    }

    if ($("#keep-login").is(':checked')) {
        sub.addData('keep-login', true);
        if (localStorage.getItem('cookie')) sub.addData('cookie', localStorage.getItem('cookie'));
    } else {
        localStorage.setItem('keep-login', 'no');
        localStorage.removeItem('otp-key');
    }

    loadingOn();
    $("#login-btn").loadButton('on', {loadingText: 'Logging in...'});

    sub.submit("json", function (data) {
        $("#login-btn").loadButton('off');
        loadingOff();
        switch (data.status) {
            case 1: // LOGIN OK
                if (localStorage.getItem('remember-login') == 'yes') {
                    localStorage.setItem('saved-login', $("#login-id").val());
                }
                if (typeof data.user !== typeof undefined) {
                    localStorage.setItem('saved-login', data.user);
                    localStorage.setItem('remember-login', 'yes');
                }
                if (typeof data.key !== typeof undefined) localStorage.setItem('otp-key', data.key);
                if (typeof data.cookie !== typeof undefined) {
                    localStorage.setItem('cookie', data.cookie);
                    localStorage.setItem('keep-login', 'yes');
                }
                login = true;
                doLogin();
                break;
            case 2: // REQUIRE PIN
                $("#otp-cont").hide();
                $("#pin-cont").fadeIn(function(){
                    $("#login-pin").notifyForm(data.message, {
                        className: 'warn',
                        clearField: true
                    });
                });
                break;
            case 3: // REQUIRE OTP
                $("#pin-cont").hide();
                $("#otp-cont").fadeIn(function () {
                    $("#login-otp").notifyForm(data.message, {
                        className: 'warn',
                        clearField: true
                    });
                });
                break;
            case 4: // DID MISMATCH OR INVALID COOKIE OR NO TOTP KEY IN DB
                notify2(data.message, "error", false);
                $("#login-error-p").text(data.message);
                resetLogin();
                break;
            default:
                $("#login-pass").notifyForm(data.message);
                return false;
        }
    });
}