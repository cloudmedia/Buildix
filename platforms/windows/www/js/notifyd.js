/**
 * NotifyD.js
 * Written by: Jay Simons
 * https://Cloudulus.Media
 * 
 * NotifyD.js is a notification polling daemon. Made to work with Notify2.js.
 * 
 */

class NotifyD {
    constructor(api) {
        this.api = api; // Api URL for notification server (expects JSON result)
        this.error_mess = "";
        this.freq = 5000; // Polling frequency in milliseconds
        this.interval = null;
        this.query = {}; // Post fields
        this.connectTimeout = 5000; // Time in milliseconds until server timeout
        this.callback = null; // Callback on notification received event
        this.debug = false; // Debug output to console
        console.log("NotifyD initialized!");
    }

    clog(t) {
        if (this.debug) {
            console.log(timeStamp() + "-NotifyD: " + t);
        }
        return true;
    }

    start() {
        var me = this;
        this.interval = setInterval(function () {
            $.ajax({
                url: me.api,
                method: 'post',
                data: me.query,
                timeout: me.connectTimeout,
                dataType: 'json',
                success: function (res) {
                    me.process(res, me);
                },
                error: function (res) {
                    me.errConnect(res, me);
                }
            });
        }, this.freq);
    }

    stop() {
        if (this.debug) this.clog("Shutting down!");
        clearInterval(this.interval);
        return true;
    }

    process(res, me) {
        var d = new Date();
        if (res.status == 1) {
            var n = new Notify2(res.message, res.class, res.autoHide, res.delay);
            if (res.doConfirm) n.doConfirm(eval(res.cbYes), eval(res.cbNo));
            n.notify();
            if (typeof this.callback === 'function') this.callback(this);
        } else {
            me.clog("No messages.");
        }
    }

    setCallback(callback) {
        this.callback = callback;
        return true;
    }

    setConnectTimeout(n) {
        this.connectTimeout = n;
        return true;
    }

    setDebug(bool) {
        this.debug = bool;
        return true;
    }

    setFreq(f) {
        this.freq = f;
        return true;
    }

    addData(fld, val) {
        if (typeof fld === typeof undefined) fld = "";
        if (typeof val === typeof undefined) val = "";

        if (fld.length < 1) {
            this.error_mess = "NULL field name not allowed!";
            this.clog(this.error_mess);
            return false;
        }

        this.query[fld] = val;
        return true;
    }

    errConnect(res, me) {
        me.error_mess = "Failed to connect to: " + me.api +
            "/Server response: " + res.status;
        me.clog(me.error_mess);
        return false;
    }
}