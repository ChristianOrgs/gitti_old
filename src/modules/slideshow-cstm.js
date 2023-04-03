import $ from 'jquery';

if($(window).width() > 1024) {
    $('.teaser-bubbles-wrapper').on('mouseenter', '.bubbles', function (e) {
        var $currTarget = $(e.currentTarget), 
        index = $currTarget.data('bubble-index'),
        slickObj = $('.js-hero-slider').slick('getSlick');
        slickObj.slickGoTo(index);
    });  
}
