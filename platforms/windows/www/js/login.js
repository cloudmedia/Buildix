$(document).ready(function () {
    loadingOff();
    initMain();

    $("#otp-cont").hide();

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
                var regex = new RegExp(/^[0-9]$/);
                if (regex.exec(e.key) && $(this).data('val').length < 4)
                {
                    $(this).data('val', $(this).data('val') + e.key);
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

        var newServer = $("#login-server").val();
        val.setVal(newServer);
        if (val.isHostname())
        {
            server = 'https://'+newServer;
        }else{
            post_error(val.message);
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
        sub.addData('src', 'app');

        sub.submit("json", function(data){
            thisBtn.removeClass('loading').text(label);
            loadingOff();
            console.log(data);
            switch (data.status)
            {
                case 1:
                    login = true;
                    doLogin();
                break;
                case 2:
                    notify2(data.message, "warn");
                    $("#pin-cont").fadeIn(function(){
                        $("#login-pin").select();
                    });
                break;
                default:
                    notify2(data.message, "error", false);
                    return false;
            }
        });
    });
});