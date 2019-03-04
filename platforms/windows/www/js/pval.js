function checkPass(idPass)
{
    if ($("#pw-validate").is(":hidden")) $("#pw-validate").fadeIn();
    var pswd = $(idPass).val();

    //validate letter
    if ( pswd.match(/[A-z]/) ) {
        $('#pw-letter').removeClass('pw-invalid').addClass('pw-valid');
    } else {
        $('#pw-letter').removeClass('pw-valid').addClass('pw-invalid');
    }

    //validate capital letter
    if ( pswd.match(/[A-Z]/) ) {
        $('#pw-capital').removeClass('pw-invalid').addClass('pw-valid');
    } else {
        $('#pw-capital').removeClass('pw-valid').addClass('pw-invalid');
    }

    //validate number
    if ( pswd.match(/\d/) ) {
        $('#pw-number').removeClass('pw-invalid').addClass('pw-valid');
    } else {
        $('#pw-number').removeClass('pw-valid').addClass('pw-invalid');
    }

    //validate symbol
    if ( pswd.match(/[^a-zA-Z0-9_]/)) {
        $('#pw-symbol').removeClass('pw-invalid').addClass('pw-valid');
    } else {
        $('#pw-symbol').removeClass('pw-valid').addClass('pw-invalid');
    }

    //validate length
    if ( pswd.length >= 8) {
        $('#pw-length').removeClass('pw-invalid').addClass('pw-valid');
    } else {
        $('#pw-length').removeClass('pw-valid').addClass('pw-invalid');
    }

    if (!$(".pw-item").hasClass("pw-invalid"))
    {
        $(idPass).addClass("field-ok").removeClass("req-field");
    }else{
        $(idPass).addClass("req-field").removeClass("field-ok");
    }
}

function checkMatch(idPass, idCpass, idNextField)
{
    if (idNextField == undefined) idNextField="";
    var cpass = $(idCpass).val();
    var pass= $(idPass).val();
    if (cpass == pass && !$(".pw-item").hasClass("pw-invalid"))
    {
        if ($(idNextField).attr("type") == "submit" || $(idNextField).attr("type") == "button")
        {
            $(idNextField).removeAttr("disabled");
        }
        $(idNextField).focus();
        $(idCpass).addClass("field-ok").removeClass("req-field");
    }else{
        $(idCpass).removeClass("field-ok").addClass("req-field");
        if ($(idNextField).attr("type") == "submit" || $(idNextField).attr("type") == "button")
        {
            $(idNextField).attr("disabled", true);
        }
    }
}

function checkOldPass(idOpass)
{
    if ($(idOpass).val().length < 8)
    {
        $(idOpass).addClass("req-field").removeClass("field-ok");
    }else{
        $(idOpass).addClass("field-ok").removeClass("req-field");
    }
}