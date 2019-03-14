/**
 * Submit.js
 * Written by: Jay Simons
 * Cloudulus.Media (https://code.cloudulus.media)
 */

class Submit
{
    constructor(url)
    {
        this.url = url;
        this.query={};
        this.message = "";
        this.response = null;
        this.callback;
        return true;
    }

    addData(fld, val)
    {
        if (typeof fld === typeof undefined) fld="";
        if (typeof val === typeof undefined) val="";

        if (fld.length < 1)
        {
            this.message = "NULL field name not allowed!";
            this.log();
            return false;
        }

        this.query[fld] = val;
        return true;
    }

    submit(resType, callback)
    {
        this.callback = callback;
        if (typeof resType === typeof undefined) resType = null;
        $.ajax({
            url: this.url,
            method: 'post',
            data: this.query,
            timeout: 5000,
            dataType: resType,
            success: $.proxy(this.process, this),
            error: $.proxy(this.error, this)
        });
        return true;
    }

    process(data, callback)
    {
        callback = this.callback;
        this.response = data;
        callback(data);
    }

    error(data, callback)
    {
        callback = this.callback;
        var res;
        if (debug)
        {
            res = {status:0, message:res.responseText, field:'page-bottom'}
        }else{
            res = {status:0, message:'Failed to connect to server ['+server+']!', field:'page-bottom'};
        }
        callback(res);
    }

    log()
    {
        console.log("Submit.js: "+this.message);
        return true;
    }
}