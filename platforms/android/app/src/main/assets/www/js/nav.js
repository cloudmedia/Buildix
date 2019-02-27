var menu;
$(window).touch(function(e){
    var clickedClass = $(e.target).attr('class');
    if (clickedClass != 'cat-btn' && $("#menu").hasClass('active')) menu.toggle();
});

$(document).ready(function () {
    menu = new menuSlider('menu');
    menu.setAnimClass('bounceInRight');
});

function initNav()
{
    $(".cat-btn").unbind().touch(function(){
        var id = $(this).data('id');
        $(".cat-cont").hide();
        $("#"+id).fadeIn();
    });

    $(".zone-btn").unbind().touch(function(){
        scrollTop();
        loadingOn();
        $("#main").load("/zone?zid="+$(this).data('zid'));
    });
}