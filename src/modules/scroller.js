
import $ from 'jquery';
import Reqs from '../classes/Reqs';
import { setBadgePosition } from '../utils';

const productImages = $('.product-image').length;
let $mobileSlider = null;

if (productImages > 1) {
    const isPageLoaded = false;
    const $row = $('.js-row--scrollable');
    const $productImg = $('.product-image');
    const $productImgScroller = $('.js-productImgScroller');
    const $productImgNav = $('.js-productImgScroller-nav');
    const $productInfo = $('.js-product-info__wrapper');

    $(window).on('scroll',
        Reqs.throttle(function(event){
            const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if (windowWidth >= 1024) {
                const scrolled = $(this).scrollTop();
                const rowHeight = $row.outerHeight();
                const headerHeight = 60;
                const productImgScrollerHeight = $productImgScroller.outerHeight();
                const productImgNavHeight = $productImgNav.outerHeight();
                const productInfoHeight = $productInfo.outerHeight();
                const productOffset = $row.offset().top - headerHeight;
                const productInfoRight = $productInfo.parent().offset().right;
                const productInfoWidth = $productInfo.parent().width();

                if ( scrolled >= productOffset ) {
                    $productImgNav.addClass('is-sticky');

                    if ( scrolled >= productOffset + productImgScrollerHeight - productImgNavHeight ) {
                        $productImgNav.addClass('stick-to-bottom');
                    } else {
                        $productImgNav.removeClass('stick-to-bottom');
                    }

                    if ( productInfoHeight < productImgScrollerHeight ) {
                        $productInfo.addClass('is-sticky');

                        $productInfo.css({ right: productInfoRight, width: productInfoWidth });

                        if ( scrolled >= productOffset + rowHeight - productInfoHeight ) {
                            $productInfo.addClass('stick-to-bottom');
                        } else {
                            $productInfo.removeClass('stick-to-bottom');
                        }
                    }
                } else {
                    $productImgNav.removeClass('is-sticky');
                    $productInfo.removeClass('is-sticky');
                    $productInfo.css({ right: 'auto', width: 'auto' });
                }

                for ( let i = $productImg.length - 1; i >= 0; i--) {
                    const $currentProduct = $('.product-image').eq(i);
                    const index = $currentProduct.attr('data-index');
                    const productHeight = $currentProduct.outerHeight();
                    const productOffset = $currentProduct.offset().top - headerHeight - productHeight;

                    if (scrolled >= productOffset) {
                        $productImgNav.find('.product-image-thumb[data-index="' + index + '"]').addClass('active').siblings().removeClass('active');
                        break;
                    }
                }
            } else {
                $productImgNav.removeClass('is-sticky stick-to-bottom');
                $productInfo.removeClass('is-sticky stick-to-bottom');
                $productInfo.css({ right: 'auto', width: 'auto' });
            }
        }, 10)
    ).on('load', function() {
        isPageLoaded = true;
    });

    // Bind product thumb image click to scroll function
    $productImgNav.on('click', '.product-image-thumb', function() {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (windowWidth >= 1024) {
            const index = $(this).data('index');
            const $selectedImage = $('.product-image[data-index="' + index + '"]');
            const headerHeight = $('.header--standard').outerHeight();

            if ( $selectedImage.length ) {
                if ( isPageLoaded ) {
                    $('html, body').stop( true, false ).animate({ scrollTop: $selectedImage.offset().top - headerHeight }, 500 );
                }
            }
        }
    });

    $(window).on('resize', Reqs.throttle(function(event){
        toggleMobileSlider();
        checkProductInfoHeight();
    }, 50));

    $(window).on('load', checkProductInfoHeight);

    toggleMobileSlider();

    function toggleMobileSlider() {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (windowWidth < 1024 && $('.js-productImgScroller .js-slide').length > 1) {
            initMobileSlider();
        } else {
            destroyMobileSlider();
        }
    }
}

function checkProductInfoHeight() {
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var productInfoHeight = $('.product-info__wrapper').outerHeight();
    var productImageHeight = $('.productImgScroller').outerHeight();

    if (productInfoHeight > productImageHeight && windowWidth >= 1024) {
        $productInfo.addClass('product-info__wrapper--static');
    } else {
        $productInfo.removeClass('product-info__wrapper--static');
    }
}

// If product layout is scroller and is mobile then load slider
function initMobileSlider() {
    import(/* webpackChunkName: "flickity" */ 'flickity').then(() => {
        var $productImgSlider = $('.js-productImgScroller');
        var $productImgSliderNav = $('.js-productImgScroller-nav');
        var activeArrows = $productImgSlider.data('arrows');
        var activeDots = $productImgSlider.data('dots');
        var sliderNavArrows = $productImgSliderNav.find('.js-slide').length > 3;
        var activeSlide = $productImgSlider.find('.is-selected-product').index();
        activeSlide = activeSlide == -1 ? 0 : activeSlide;

        var flickity = $('.js-productImgScroller').data('flickity');
        var flickityNav = $('.js-productImgScroller-nav').data('flickity');

        if ( $productImgSlider.find('.js-slide').length > 1 ) {
            if (flickity == undefined) {

                $mobileSlider = $productImgSlider.flickity({
                    cellSelector: '.js-slide',
                    prevNextButtons: activeArrows,
                    arrowShape: 'M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z',
                    pageDots: activeDots,
                    initialIndex: activeSlide,
                    selectedAttraction: 0.08,
                    friction: 0.8,
                    adaptiveHeight: true,
                    wrapAround: true,
                    contain: true
                });

                $mobileSlider.on('change.flickity', setBadgePosition);
            }

            if (flickityNav == undefined) {
                $mobileSliderNav = $productImgSliderNav.flickity({
                    cellSelector: '.js-slide',
                    asNavFor: '.js-productImgScroller',
                    initialIndex: activeSlide,
                    pageDots: false,
                    prevNextButtons: sliderNavArrows,
                    arrowShape: 'M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z',
                    contain: true
                });
            }
        }

        Product.setSlidesHeight($productImgSlider);
        $(window).resize(
            Reqs.debounce(function(event){
                Product.setSlidesHeight($productImgSlider)
            }, 250)
        );
    });
}

function destroyMobileSlider() {
    var flickity = $('.js-productImgScroller').data('flickity');
    var flickityNav = $('.js-productImgScroller-nav').data('flickity');

    if (flickity && flickity.isActive) {
        $mobileSlider.flickity('destroy')
    }

    if (flickityNav && flickityNav.isActive) {
        $mobileSliderNav.flickity('destroy')
    }
}
