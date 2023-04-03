import $ from 'jquery';

var $productTab = $('.js-product-tabs .product-tab');

// Click the product-tab title to change the tab
$productTab.on('click', '.product-tab-title', function(){
    $(this).parent('.product-tab').toggleClass('is-active');

    var $productInfo = $('.js-product-info__wrapper');
    var productInfoHeight = $('.product-info__wrapper').outerHeight();
    var productImagesHeight = $('.product-layout-images').outerHeight();

    productInfoHeight > productImagesHeight ? $productInfo.addClass('product-info__wrapper--static') : $productInfo.removeClass('product-info__wrapper--static');

    $(window).trigger('scroll');
});

var $socialIcons = $('.socialBar a');
$socialIcons.on('click', function () {
    var $diamond = $(this).children('.diamond');
    $diamond.addClass('ripple-click');
    setTimeout(function(){
        $diamond.removeClass('ripple-click');
    }, 2000);
});
