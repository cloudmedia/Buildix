$(document).ready(function () {
    var doOTP = false;

    loadingOff();
    initMain();

    $("#otp-cont").hide();

    $("#server-name").text(serverName);

    if (localStorage.getItem('remember-login') == 'yes') 
    {
        $("#login-remember").attr('checked', true);
        $("#login-id").val(localStorage.getItem('saved-login'));
    }

    if (localStorage.getItem('keep-login') == 'yes')
    {
        $("#keep-login").attr('checked', true);
        if (localStorage.getItem('otp-key'))
        {
            doOTP = true;
            var totp = new TOTP(localStorage.getItem('otp-key'), localStorage.getItem('saved-login'));
            $("#login-otp").val(totp.getOTP());
            $("#otp-cont").show();
        }
    }

    $("#login-pin").on('keyup', function(e){
        switch (e.which)
        {
            case 8:
                $(this).data('val', $(this).data('val').slice(0, -1));
            break;
            case 13:
                $("#login-btb").click();
            break;
            default:
                var newDigit = $(this).val().substr(-1);
                var regex = new RegExp(/^[0-9]$/);
                if (regex.exec(newDigit) && $(this).data('val').length < 4)
                {
                    $(this).data('val', $(this).data('val') + newDigit);
                }
        }
        setTimeout(function(){
            var pin = $("#login-pin");
            var pinVal = pin.val();
            pin.val(pinVal.replace(/./gi, '*'));
        }, 300);
        console.log($(this).data('val'));
    }).mask('ZZZZ', {
        translation: {
            'Z': {pattern: /[0-9\*]/}
        }
    }).select(function(){
        $(this).val("").data('val', '');
    });

    $("#login-otp").mask('000000');

    $("#login-btn").touch(function(){
        scrollTop();
        if ($("#login-id").val().length < 3)
        {
            notify2("Please enter a valid user ID (Email, Username, or User ID#)");
            $("#login-id").select();
            return false;
        }
        var val = new Valid($("#login-pass").val())
        if (!val.valPass())
        {
            notify2("Please enter a valid password!");
            $("#login-pass").bad();
            return false;
        }else{
            $("#login-pass").ok();
        }

        var label = $(this).text();
        var thisBtn = $(this);
        loadingOn();
        thisBtn.html('<i class="fas fa-cog fa-spin"></i><span> Logging in...</span>').addClass('loading').blur();

        var sub = new Submit(server+'/login?action=login');
        sub.addData('id', $("#login-id").val());
        sub.addData('pass', $("#login-pass").val());
        sub.addData('pin', $("#login-pin").data('val'));
        sub.addData('otp', $("#login-otp").val());
        if ($("#login-remember").is(':checked'))
        {
            localStorage.setItem('remember-login', 'yes');
        }else{
            localStorage.setItem('remember-login', 'no');
            localStorage.removeItem('saved-login');
        }

        if ($("#keep-login").is(':checked'))
        {
            sub.addData('get-key', true);
            localStorage.setItem('keep-login', 'yes');
        }else{
            localStorage.setItem('keep-login', 'no');
            localStorage.removeItem('otp-key');
        }

        sub.submit("json", function(data){
            thisBtn.removeClass('loading').text(label);
            loadingOff();
            console.log(data);
            switch (data.status)
            {
                case 1:
                    if (localStorage.getItem('remember-login') == 'yes') localStorage.setItem('saved-login', $("#login-id").val());
                    if (typeof data.key !== typeof undefined) localStorage.setItem('otp-key', data.key);
                    login = true;
                    doLogin();
                break;
                case 2:
                    notify2(data.message, "warn");
                    $("#otp-cont").hide();
                    $("#pin-cont").fadeIn(function(){
                        $("#login-pin").select();
                    });
                break;
                case 3:
                    notify2(data.message, "warn");
                    $("#pin-cont").hide();
                    $("#otp-cont").fadeIn(function(){
                        $("#login-otp").select();
                    });
                break;
                default:
                    notify2(data.message, "error", false);
                    $("#login-pass").val("").select();
                    return false;
            }
        });
    });
});