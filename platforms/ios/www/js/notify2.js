/**
 * Notify2.js
 * Written by: Jay Simons
 * Cloudulus.Media (https://code.cloudulus.media)
 */

// Default settings
var useSounds = true; // Use Sounds.js (seperate script required)
var n2DefaultClass = "error";
var n2DefaultDelay = 3000; // 3000 milliseconds = 3 seconds
var n2DefaultAutoHide = true; // Auto hide notifications be default (true or false)
var n2DefaultIcon = "fa-times-circle"; // Default FontAwesome icon
if (useSounds) {
    var n2DefaultSound = 'erroneous';
}
var n2DefaultMessage = "An unknown error occurred!"; // Default message (if none is supplied)

class Notify2 {
    constructor(msg, cls, autoHide, delay) {
        if (msg == undefined) msg = n2DefaultMessage;
        this.message = msg;
        if (cls == undefined) cls = n2DefaultClass;
        this.class = cls;
        if (autoHide == undefined) autoHide = n2DefaultAutoHide;
        this.autoHide = autoHide;
        if (delay == undefined) delay = n2DefaultDelay;
        this.delay = delay;
        this.icon = n2DefaultIcon;
        if (useSounds) this.sound = n2DefaultSound;
        this.id = "notify2-" + new Date().getTime();
        this.cbYes = null;
        this.cbNo = null;
        this.bindEvent = 'click';
        this.debug = false;
        this.target = null;
    }

    setAutoHide(bool) {
        this.autoHide = bool;
        return true;
    }

    setDelay(delay) {
        this.delay = delay;
        return true;
    }

    setBindEvent(e) {
        this.bindEvent = e;
        return true;
    }

    setDebug(bool) {
        this.debug = bool;
        return true;
    }

    doConfirm(cbYes, cbNo, target) {
        var cbYesID = "notify2-" + this.genID(10);
        var cbNoID = "notify2-" + this.genID(10);
        this.message = '<div class="confirm"><div>' + this.message + '</div>' +
            '<div><button id="' + cbYesID + '">Yes</div>' +
            '<div><button id="' + cbNoID + '">No</button></div></div>';
        this.autoHide = false;
        this.cbYes = cbYes;
        this.cbNo = cbNo;
        if (typeof target !== typeof undefined) this.target = target;
        var me = this;
        if (typeof this.cbYes === 'function') {
            $(document).on(this.bindEvent, "#" + cbYesID, function () {
                me.cbYes(me);
            });
            /*
            $(document).delegate('#notify2-confirm-yes', this.bindEvent, function(){
                me.cbYes(me);
            });
            */
        }
        if (typeof this.cbNo === 'function') {
            $(document).on(this.bindEvent, "#" + cbNoID, function () {
                me.cbNo(me);
            });
            /*
            $(document).delegate('#notify2-confirm-no', this.bindEvent, function(){
                me.cbNo(me);
            });
            */
        }
        return true;
    }

    genID(length) {

        if (typeof length === typeof undefined) length = 8;
        var timestamp = +new Date;

        var _getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var ts = timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";

        for (var i = 0; i < length; ++i) {
            var index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return id;
    }

    notify() {
        var notify;
        switch (this.class) {
            case "success":
                this.icon = "fa-check-square";
                if (useSounds) this.sound = 'calculate';
                break;
            case "warn":
                this.icon = "fa-exclamation-triangle";
                if (useSounds) this.sound = 'plunk';
                break;
            case "info":
                this.icon = "fa-question-circle";
                if (useSounds) this.sound = 'pop';
                break;
            case "mail":
                this.icon = "fa-envelope";
                if (useSounds) this.sound = 'trida';
                break;
        }
        if (this.debug) console.log(this.message);
        $('body').append(
            '<div id="' + this.id + '" class="notify2 ' + this.class + '" data-timer="" style="display: none;">' +
            '<div><div><i class="fas ' + this.icon + '"></i></div>' +
            '<div>' + this.message + '</div></div>' +
            '<div><i class="fas fa-times" id="notify2-close-btn"></i></div></div>'
        );
        notify = $("#" + this.id);
        notify.hide().click(function () {
            hideNotify2($(this));
        });

        if (this.autoHide) {
            if (this.debug) console.log("Notify2 Autohide: " + this.autoHide + ", Delay: " + this.delay);
            var hideID = this.id;
            var hideDelay = this.delay;
            var debug = this.debug;
            setTimeout(function () {
                var hideme = "#" + hideID;
                if (debug) console.log("Hiding notification: " + hideme);
                $(hideme).click();
            }, hideDelay);
        }

        showNotify2(notify);
        if (useSounds) sounds.play(this.sound);
        return true;
    }
}

function showNotify2(notify) {
    var height = notify.height();
    notify.css("margin-bottom", -height).show();
    if (notify.css("margin-bottom") == -height + "px" && !notify.is(':animated')) {
        notify.animate({
            "margin-bottom": '+=' + height
        });
    } else {
        if (!notify.is(':animated')) {
            notify.animate({
                "margin-bottom": '-=' + height
            });
        }
    }
}

function hideNotify2(notify) {
    if (notify.hasClass('notify2')) {
        var timer = notify.attr("data-timer");
        if (timer) clearTimeout(timer);
        if (useSounds) sounds.play('blip');
        var height = notify.height() + 15;
        if (notify.css("margin-bottom") == -height + "px" && !notify.is(':animated')) {
            notify.animate({
                "margin-bottom": '+=' + height
            });
        } else {
            if (!notify.is(':animated')) {
                notify.animate({
                    "margin-bottom": '-=' + height
                }, function () {
                    $(this).remove();
                });
            }
        }
    }
}

// Shortcut function to easily instantiate on one line
function notify2(msg, cls, ah) {
    if (msg == undefined) msg = "";
    if (cls == undefined) cls = "error";
    if (ah == undefined) ah = true;
    var notify = new Notify2(msg, cls);
    notify.setAutoHide(ah);
    notify.notify();
}

(function ($) {
    $.fn.notifyField = function (opts, callback) {
        var settings = $.extend({
            message: "An error occurred!",
            class: 'error',
            autoHide: false,
            delay: 3000,
            doConfirm: false,
            callBackYes: null,
            callBackNo: null,
            clearField: false,
            scrollToField: true,
            topOffset: 0,
            scrollTime: 1000
        }, opts);

        var n = new Notify2(settings.message, settings.class, settings.autoHide, settings.delay);
        if (settings.doConfirm) n.doConfirm(settings.callBackYes, settings.callBackNo);

        if (settings.scrollToField) {
            var offSet = 0;
            if (typeof this.offset === 'function') offSet = this.offset().top;
            $('html, body').animate({
                scrollTop: (offSet - settings.topOffset)
            }, settings.scrollTime);
        }

        if (settings.clearField) this.val("");
        this.focus();
        n.notify();
        if (typeof callback === 'function') {
            return callback(this);
        } else {
            return this;
        }
    }
})(jQuery);