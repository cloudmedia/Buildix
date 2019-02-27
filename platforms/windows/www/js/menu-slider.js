/**
 * menu-slider.js
 * Written by: Jay Simons
 * Cloudulus.Media (https://code.cloudulus.media)
 */

class menuSlider
{
    constructor(id, maxWidth)
    {
        if (typeof maxWidth === typeof undefined) maxWidth = 0;
        this.id = id;
        this.ele = $("#"+id);
        this.maxWidth = maxWidth;
        this.menuWidth = this.ele.width();
        this.winWidth = $(document).width();
        this.animClass = "";

        this.calc();
        $(window).resize($.proxy(this.calc, this));
    }

    calc()
    {
        this.menuWidth = this.ele.width();
        this.winWidth = $(document).width();

        if (this.winWidth <= this.maxWidth || this.maxWidth == 0)
        {
            this.ele.css("margin-right", -this.menuWidth+"px");
            $("#menu-slider-btn").remove();
            this.ele.append('<div id="menu-slider-btn" class="clickable"><i class="fas fa-bars"></i></div>');
            $("#menu-slider-btn").css('position', 'absolute').css('top', 0).css('left', -$("#menu-slider-btn").width()+'px')
                .css("box-shadow", "none").css('color', 'white');
            $("#menu-slider-btn").unbind().touch($.proxy(this.toggle, this));

        }else{
            $("#menu-slider-btn").remove();
        }
        return true;
    }

    setAnimClass(c)
    {
        this.animClass = c;
        return true;
    }

    toggle()
    {
        playSound(sndSlide);
        if(this.ele.css("margin-right") == -this.menuWidth+"px" && !this.ele.is(':animated'))
        {
            this.ele.show();
            this.ele.animate({"margin-right": '+='+this.menuWidth}).addClass("active");
            if (this.animClass.length > 0) this.ele.addClass("animated "+this.animClass);
        }
        else
        {
          if(!this.ele.is(':animated'))
          {
              this.ele.animate({"margin-right": '-='+this.menuWidth}).removeClass("active");
              if (this.animClass.length > 0) this.ele.removeClass("animated "+this.animClass);
          }
        }
        return true;
    }
}