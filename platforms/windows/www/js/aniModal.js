/**
 * aniModal.js
 * Written By: Jay Simons
 * https://cloudulus.media
 * 
 * License: GNU GPL
 * 
 */

class aniModal
{
    constructor(obj1, obj2, opts)
    {
       this.obj1 = obj1;
       this.obj2 = obj2;
       var defaultOpts = {
           animClassIn: 'bounceInUp',
           animClassOut: 'bounceOutDown',
           speed: ''
       };
       if (typeof opts === 'object')
       {
           this.opts = Object.assign(defaultOpts, opts);
       }else{
           this.opts = defaultOpts;
       }
       this.cssClassIn = 'animated' + this.opts.animClassIn + ' ' + this.opts.speed;
       this.cssClassOut = 'animated ' + this.opts.animClassOut + ' ' + this.opts.speed;
       var delay;
       switch (this.opts.speed)
       {
           case 'slow':
               delay = 2000;
           break;
           case 'slower':
               delay = 3000;
           break;
           case 'fast':
               delay = 800;
           case 'faster':
               delay = 500;
           default:
               delay = 1000;
       }
       this.delay = delay - 100;
       return true;
    }

    show()
    {
        this.obj1.hide();
        var me = this;
        this.obj1.fadeIn(function(){
           me.obj2.removeClass(me.cssClassIn).removeClass(me.cssClassOut).addClass(me.cssClassIn);
        });

    }

    hide()
    {
       this.obj2.removeClass(this.cssClassOut).removeClass(this.cssClassIn).addClass(this.cssClassOut).show();
       var me = this;
       setTimeout(function(){
           me.obj1.fadeOut();
       }, this.delay);
    }
}