/**
 * jQuery.Passwordify.js
 * Written by: Jay Simons
 * Cloudulus.Media (https://code.cloudulus.media)
 */

if (window.jQuery) {
    (function ($) {
        $.fn.passwordify = function (opts) {
            var settings = $.extend({
                maxLength: 8,
                numbersOnly: false,
                alphaOnly: false,
                alNumOnly: false,
                enterKeyCallback: null
            }, opts);

            var rePattern = '\\s\\S';
            if (settings.numbersOnly) rePattern = '0-9';
            if (settings.alphaOnly) rePattern = 'A-z';
            if (settings.alNumOnly) rePattern = '0-9A-z';

            var maskPlaceholder = "";
            for (var i = 0; i < settings.maxLength; i++)
            {
                maskPlaceholder = maskPlaceholder + 'Z';
            }

            $(this).css('text-security', 'disc');
            $(this).css('-webkit-text-security', 'disc');
            $(this).css('-moz-text-security', 'disc');

            return this.on('keyup', function (e) {
                var me = $(this);
                switch (e.which) {
                    case 8: // Handle backspace
                        $(this).val('');
                        break;
                    case 13: // Handle enter key
                        if (typeof settings.enterKeyCallback == 'function') settings.enterKeyCallback(me);
                        break;
                    }
            }).mask(maskPlaceholder, {
                translation: {
                    'Z': {pattern: "[" + rePattern + "\*]"}
                }
            });
        }
    })(jQuery);
} else {
    console.log("Passwordify.js: This class requies jQuery > v3!");
}