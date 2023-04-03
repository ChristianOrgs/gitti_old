import $ from 'jquery';
import jQueryBridget from 'jquery-bridget';
import enquire from 'enquire.js';
import Reqs from './Reqs';
import Product from './Product';

export default class Sliders {
    constructor() {
        this.hero();
        this.carousel();
        this.collection();
        this.gallery();
        this.mosaic();
        this.testimonials();
        this.product();
        this.productTabs();
        this.logosList();
    }

    /* Homepage Hero Slider */
    hero() {
        const $hero = $( '.js-hero-slider' );
        const $scrollDownBtn = $('.js-scroll-down');
        let options = {};

        if ($hero.length === 0) return false;

        import(/* webpackChunkName: "modernizr" */ '../vendor/modernizr').then(() => {
            if ( !Modernizr.cssvhunit || !Modernizr.cssvmaxunit ) $hero.css( 'height', $(window).height() );
        });

        import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then((mod) => {
            $hero.each( function () {
                const $currentHero = $(this);
                options = JSON.parse( $currentHero.data( 'slick' ).replace(/'/g, '"') );
    
                $currentHero.on('init', function() {
                    const currentStyle = $(this).find('.js-slide[data-slick-index="1"]').data('style');
                    $(this).attr('data-current-style', currentStyle);
                    $(this).removeClass('hero--is-loading');
    
                    // Resizes background image without stretching it
                    if ( $currentHero.data('image-height') == 'original-height' ){
                        Product.setSlidesHeight($currentHero);
                    }
                });
    
                $currentHero.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                    var activeSlide = parseInt(nextSlide + 1);
                    var currentStyle = $(this).find('.js-slide[data-slick-index="' + activeSlide +'"]').data('style');
                    $(this).attr('data-current-style', currentStyle);
                });
    
                $currentHero.slick( options );
    
                $(window).resize(
                    Reqs.debounce(function(event){
                        Product.setSlidesHeight( $currentHero );
                }, 250));
            } );
    
            $('.slick-list').attr('tabindex','-1');
    
            $scrollDownBtn.on('click', function(e) {
                e.preventDefault();
    
                var isStandardNav = $(window).width() >= 768 && $('.site-header').hasClass('is-standard');
                var headerHeight = isStandardNav ? 59 : -1;
                var scrollToPosition = parseInt($hero.offset().top + $hero.outerHeight() - headerHeight);
                $('html, body').stop(true, false).animate({ 'scrollTop': scrollToPosition }, 500);
            });
        });
    }

    /* Carousel Slider
     * Called multiple times throughout site
     */
    carousel() {
        const $carousel = $( '.js-carousel-slider' );

        if($carousel.length === 0) return false;
        
        const flickity = $carousel.data( 'flickity' );

        if (flickity == undefined) {
            import(/* webpackChunkName: "flickity" */ 'flickity').then(() => {
                $carousel.flickity({
                    cellSelector: '.js-slide',
                    cellAlign: 'center',
                    watchCSS: true,
                    prevNextButtons: false,
                    pageDots: false
                });
            });
        }
    }

    /* Collection Slider */
    collection() {
        const $container = $( '.js-collection-grid' );
        const $carousel = $( '.js-collection-slider' );
        const self = this;

        $carousel.find('.will-animate').removeClass('will-animate');

        $('.quickView-button', $carousel).on('click', function() {
            $(this).closest('.slick-slide').addClass('slick-slide--quickView');
        });

        $('html, body').on('quickView:show', function() {
            setQuickViewPosition();
            $carousel.find('.slick-slide--quickView').removeClass('slick-slide--quickView');
        });

        $('html, body').on('quickView:ajax', setQuickViewPosition);

        $container.each(function() {
            self.setCarouselState( $(this) );
        });

        $(window).on( 'resize', Reqs.debounce(function() {
            setQuickViewPosition();

            $container.each(function() {
                self.setCarouselState( $(this) );
            });
        }, 250));

        function setQuickViewPosition() {
            let $slide = $carousel.find('.slick-slide--quickView');

            if ( !$slide.length ) {
                $slide = $carousel.find('.quickView--is-visible').closest('.slick-slide');
            }

            if ( $carousel.length && $slide.length ) {
                const $quickView = $slide.find('.quickView-wrap');
                const offsetLeft = $carousel.find('.slick-slide.slick-current').position().left - $slide.position().left;

                $quickView.css('left', offsetLeft);
            }
        }

        const item = '.collectionBlock';
        // Site.scroller( $carousel, item ); Need to import this somewhere...
    }

    setCarouselState($container)  {
        if ( typeof($container) == 'undefined' ) return;

        const $carousel = $container.find( '.js-collection-slider' );
        
        const setArrowsPosition = () => {
            const $arrows = $carousel.find( '.slick-arrow' );
            const arrowTop = $carousel.find( '.collectionBlock-image' ).outerHeight() / 2;

            $arrows.css( 'top', arrowTop );
        };

        $carousel.find('.will-animate').removeClass('will-animate');

        $carousel.on( 'init', function() {
            setArrowsPosition();
        } );

        if ( $carousel.length ) {
            const isInitialized = $carousel.hasClass( 'slick-initialized' );
            const slidesPerRow = parseInt( $container.data( 'slides-per-row' ));
            const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if ( windowWidth >= 768 ) {
                if ( !isInitialized ) {
                    import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then(() => {
                        $carousel.slick({
                            slidesPerRow: slidesPerRow,
                            infinite: false,
                            dots: false,
                            responsive: [
                                {
                                    breakpoint: 1024,
                                    settings: {
                                        slidesPerRow: 2
                                    }
                                }
                            ]
                        }).on( 'beforeChange', function() {
                            if ( $( '.quickView--is-visible' ).length ) {
                                QuickView.hide();
                            }
                        });
                    });
                }
            } else {
                if ( isInitialized ) {
                    $carousel.slick( 'unslick' );
                }
            }
        }

        setArrowsPosition();
    }

    /* Gallery Slider */
    gallery() {
        const self = this;
        const $slider = $('.js-slider');
        let options = {};

        $slider.each( function () {
            const $currentSlider = $(this);
            options = JSON.parse( $( this ).data( 'slick' ).replace(/'/g, '"') );

            import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then(() => {
                $currentSlider.on('init', function() {
                    $(this).removeClass('gallery-slider--is-loading');
                });
    
                if ( $currentSlider.data('image-height') == 'original-height' ){
                    Product.setSlidesHeight( $currentSlider );
                    $(window).resize(
                        Reqs.debounce(function(event){
                            Product.setSlidesHeight( $currentSlider );
                    }, 250));
                }
    
                $currentSlider.slick( options );
    
                // Pause slider if it's outside the viewport to prevent elements shaking
                $(window).on( 'scroll',
                    Reqs.debounce( function(event) {
                        var isSliderVisible = isAnyPartOfElementInViewport($currentSlider.get( 0 ));
    
                        if ( isSliderVisible ) {
                            $currentSlider.slick( 'slickPlay' );
                        } else {
                            $currentSlider.slick( 'slickPause' );
                        }
                    }, 150)
                );
            });
        });

        function isAnyPartOfElementInViewport(el) {

            const rect = el.getBoundingClientRect();
            const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

            const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
            const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

            return (vertInView && horInView);
        }
    }

    /* Mosaic Slider Mobile */
    mosaic() {
        const self = this;
        const $slider = $('.js-mosaic__blocks');

        $slider.each( function() {
            const $currentSlider = $(this);

            self.initMobileSlider($currentSlider);
            $(window).resize(
                Reqs.debounce( function(event) {
                self.initMobileSlider($currentSlider);
            }, 250));
        });

        if ( typeof(Currency) != 'undefined' && Currency ){
            Currency.convertAll(shopCurrency, $('[name=currencies]').val());
            onCurrencySet();
        }
    }

    /* Mosaic Slider Mobile */
    testimonials() {
        const self = this;
        const $slider = $('.js-testimonials__blocks');

        $slider.each( function() {
            var currentSlider = $(this);

            self.initMobileSlider(currentSlider);
            $(window).resize(
                Reqs.debounce( function(event) {
                self.initMobileSlider(currentSlider);
            }, 250));
        });
    }

    initMobileSlider($currentSlider) {
        const isMobile = $(window).width() < 768;
        const isSlickActive = $currentSlider.hasClass('slick-initialized');
        const options = {
            'infinite': true,
            'autoplay': false,
            'speed': 300,
            'slidesToShow': 1,
            'arrows': true,
            'dots': false
        };

        if ($currentSlider.hasClass('js-testimonials__blocks')) {
            options = $.extend({}, options, {
                'arrows': false,
                'dots': true
            })
        }

        // Init Slick on mobily only and destroy it otherwise
        if (isMobile && !isSlickActive) {
            import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then(() => {
                $currentSlider.slick( options );
            });
        } else if (!isMobile && isSlickActive) {
            $currentSlider.slick( 'unslick' );
        }
    }

    /* Logos list carousel */
    logosList() {
        const self = this;
        const $slider = $('.js-logos-slider');
        const options = {
            'infinite': true,
            'autoplay': false,
            'speed': 300,
            'slidesToShow': 8,
            'centerPadding': '80px',
            'arrows': true,
            'dots': false,
            'responsive': [
                {
                  'breakpoint': 1440,
                  'settings': {
                    'centerPadding': '40px',
                    'slidesToShow': 6
                  }
                },
                {
                  'breakpoint': 1024,
                  'settings': {
                    'centerPadding': '30px',
                    'slidesToShow': 5
                  }
                },
                {
                  'breakpoint': 992,
                  'settings': {
                    'centerPadding': '25px',
                    'slidesToShow': 4
                  }
                },
                {
                  'breakpoint': 768,
                  'settings': {
                    'centerPadding': '20px',
                    'slidesToShow': 3
                  }
                },
                {
                  'breakpoint': 640,
                  'settings': {
                    'centerPadding': '15px',
                    'slidesToShow': 2
                  }
                },
                {
                  'breakpoint': 375,
                  'settings': {
                    'centerPadding': '10px',
                    'slidesToShow': 1
                  }
                }
            ]
        };

        if($slider.length > 0) {
            import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then(() => {
                $slider.each(function() {
                    $( this ).slick( options );
                });
            });
        }
    }

    /* Product Slider - on mobile */
    product() {
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
    
                $productImgSlider.on('change.flickity', this.setBadgePosition);
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

                Product.setSlidesHeight($productImgSlider);
                $(window).resize(
                    Reqs.debounce(function(event){
                        Product.setSlidesHeight($productImgSlider)
                }, 250));

                if($productImgSlider.data('gallery') == "lightbox") {
                    Reqs.lightbox();

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

    /* Product Tabs */
    productTabs() {
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
    }
}
