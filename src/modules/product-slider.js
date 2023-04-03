import $ from 'jquery';
import jQueryBridget from 'jquery-bridget';
import enquire from 'enquire.js';
import Reqs from '../classes/Reqs';
import { setBadgePosition, setSlidesHeight } from '../utils';

function initProductSlider() {
    let mfpOpen = true;
    const $productImgContainer = $( '[data-section-type="product-template"]' );
    const $productImgScroller = $productImgContainer.find( '.js-productImgScroller' );
    const $productImgSlider = $productImgContainer.find( '.js-productImgSlider' );
    const $productImgSliderNav = $productImgContainer.find( '.js-productImgSlider-nav' );
    const sliderId = '#' + $productImgSlider.attr('id');
    let activeArrows = $productImgSlider.data('arrows');
    let activeFade = false;
    const isMobile = $(window).width() < 768;
    
    if(!isMobile){
        activeFade = $productImgSlider.data('fade') == true ? true : false;
        activeArrows = false;
    }

    const activeDots = $productImgSlider.data('dots');
    const sliderNavArrows = $productImgSliderNav.find('.js-slide').length > 3;
    let activeSlide = $productImgSlider.find('.is-selected-product').index();
    activeSlide = activeSlide == -1 ? 0 : activeSlide;

    if ( $productImgSlider.find('.js-slide').length > 1 ) {
        import(/* webpackChunkName: "flickity" */ 'flickity').then((flickity) => {
            const Flickity = flickity.default;
            Flickity.setJQuery($);
            jQueryBridget('flickity', Flickity, $);
            $productImgSlider.flickity({
                cellSelector: '.js-slide',
                prevNextButtons: activeArrows,
                arrowShape: 'M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z',
                pageDots: activeDots,
                initialIndex: activeSlide,
                selectedAttraction: 0.08,
                friction: 0.8,
                contain: true,
                adaptiveHeight: false,
                wrapAround: true,
                fade: activeFade
            });

            $productImgSlider.on('change.flickity', setBadgePosition);
            $productImgSlider.on( 'dragStart.flickity', function( event, pointer ) {
                mfpOpen = false;
            });
            $productImgSlider.on( 'change.flickity', function( event, pointer ) {
                setTimeout(function() {
                    mfpOpen = true;
                }, 10);
            });

            $productImgSliderNav.flickity({
                cellSelector: '.js-slide',
                asNavFor: sliderId,
                initialIndex: activeSlide,
                pageDots: false,
                prevNextButtons: sliderNavArrows,
                arrowShape: 'M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z',
                contain: true
            });

            setSlidesHeight($productImgSlider);
            $(window).resize(
                Reqs.debounce(function(event){
                    setSlidesHeight($productImgSlider)
            }, 250));

            if($productImgSlider.data('gallery') == "lightbox") {
                import(/* webpackChunkName: 'magnific-popup' */ 'magnific-popup').then(() => {
                    $('.product-image-lightbox').magnificPopup({
                        closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-close"></button>',
                        type: 'image',
                        gallery:{
                            enabled: true,
                            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% icon-arrow-%dir%"></button>'
                        },
                        disableOn: function() {
                            return mfpOpen;
                        }
                    });
                });
            }

            enquire.register("screen and (min-width: 768px)", function() {
                if ($productImgScroller.data('gallery')=="zoom"){
                    import(/* webpackChunkName: "zoom" */ 'jquery-zoom').then((module) => {
                        $productImgScroller.find('.product-image[data-zoom-image]').each(function() {
                            var $image = $(this);
                            $image.zoom({
                                duration: 300,
                                url: $image.data('zoom-image'),
                                target: $image.find('.zoom-container'),
                                callback: function() {
                                    var forceZoomRatio = 1.5;
                                    var imageWidth = this.width;
                                    var imageHeight = this.height;
                                    var imageAspectRatio = $(this).closest('.product-image').data('aspect-ratio');
                                    var containerWidth = $(this).closest('.product-image').width();
                                    var containerHeight = $(this).closest('.product-image').height();
    
                                    if (imageWidth < containerWidth) {
                                        $(this).width(containerWidth * forceZoomRatio);
                                        $(this).height(containerWidth / imageAspectRatio * forceZoomRatio);
                                    } else if (imageHeight < containerHeight) {
                                        $(this).width(containerHeight * imageAspectRatio * forceZoomRatio);
                                        $(this).height(containerHeight * forceZoomRatio);
                                    }
                                },
                                onZoomIn: function() {
                                    $(this).parent().addClass('zoomed');
                                },
                                onZoomOut: function() {
                                    $(this).parent().removeClass('zoomed');
                                }
                            });
                        });
                    });
                    
                }
                if ($productImgSlider.data('gallery') == "zoom") {
                    import(/* webpackChunkName: "zoom" */ 'jquery-zoom').then(() => {
                        $productImgSlider.find('.product-image[data-zoom-image]').each(function() {
                            var $image = $(this);
                            $image.zoom({
                                duration: 300,
                                url: $image.data('zoom-image'),
                                target: $image.find('.zoom-container'),
                                callback: function() {
                                    var forceZoomRatio = 1.5;
                                    var imageWidth = this.width;
                                    var imageHeight = this.height;
                                    var imageAspectRatio = $(this).closest('.product-image').data('aspect-ratio');
                                    var containerWidth = $(this).closest('.product-image').width();
                                    var containerHeight = $(this).closest('.product-image').height();

                                    if (imageWidth < containerWidth) {
                                        $(this).width(containerWidth * forceZoomRatio);
                                        $(this).height(containerWidth / imageAspectRatio * forceZoomRatio);
                                    } else if (imageHeight < containerHeight) {
                                        $(this).width(containerHeight * imageAspectRatio * forceZoomRatio);
                                        $(this).height(containerHeight * forceZoomRatio);
                                    }
                                },
                                onZoomIn: function() {
                                    $(this).parent().addClass('zoomed');
                                },
                                onZoomOut: function() {
                                    $(this).parent().removeClass('zoomed');
                                }
                            });
                        });
                    });
                }
            });

            enquire.register("screen and (max-width: 767px)", function() {
                if($productImgSlider.data('gallery') == "lightbox") {
                    $('.product-image-wrap a').click(function() {
                        event.preventDefault();
                    });
                }
            });
        });
    }
}

initProductSlider();
