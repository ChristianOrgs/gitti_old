import $ from 'jquery';
import Product from './classes/Product';

export const setSlidesHeight = $productImgSlider => {
    $productImgSlider.find('.js-slide').each(function() {
        var $slide = $(this);
        var imageAspectRatio = $(this).data('aspect-ratio');
        var slideWidth = $slide.width();
        var slideHeight = parseInt($slide.css('max-height'));
        var slideAspectRatio = slideWidth / slideHeight;
        var imageHeight = parseInt(slideWidth / imageAspectRatio);

        if (slideAspectRatio > imageAspectRatio) {
            $slide.css('height', slideHeight);
            $slide.parent().css('height', slideHeight);
        } else {
            $slide.css('height', imageHeight);
            $slide.parent().css('height', imageHeight);
        }
    });

    if ($productImgSlider.data('flickity') != undefined) {
        $productImgSlider.flickity('resize');
    }
};

export const setCarouselState = $container => {
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
};

export const initMobileSlider = $currentSlider => {
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
};

export const setBadgePosition = () => {
    var badges = $('.product-status-flag');

    if (badges.length) {
        badges.each(function() {
            var badge = $(this);
            var imgContainer = badge.closest('[data-aspectratio]');
            var imgContainerWidth = imgContainer.outerWidth();
            var imgContainerHeight = imgContainer.outerHeight();
            var imgContainerRatio = parseFloat(imgContainerWidth / imgContainerHeight);
            var imageAspectRatio = parseFloat(imgContainer.data('aspectratio'));
            var diffRatio = imageAspectRatio / imgContainerRatio;
            var posLeft = 0;
            var posTop = 0;

            if ( imageAspectRatio > imgContainerRatio ) {
                posLeft = 0;
                posTop = parseInt( ( imgContainerHeight - imgContainerHeight / diffRatio ) / 2 );
            } else {
                posTop = 0;
                posLeft = parseInt( ( imgContainerWidth - imgContainerWidth * diffRatio)  / 2 );
            }

            badge.css({
                // top: posTop,
                // right: posLeft,
                opacity: 1
            });
        });

    }
};

export const productCallback = (options, Product) => {
    const { shopifyData } = Product;
    var moneyFormat = options.money_format,
        variant = options.variant,
        selector = options.selector;

        //el is options.selector.variantIdField, the tie that binds
        var gold = $(options.selector.variantIdField).attr('id');
        var id = gold.replace(/\D/g, '');
        var fp = $('.featured-product--'+id);
        var pf = $('#product_form_'+id);

    if($(options.selector.variantIdField).parents('.featured-product').length > 0){

    var $submit = $(fp).find('.js-productForm-submit'),
        $shopbar_submit = $(fp).find('.js-shopBar-buy'),
        $price = $(fp).find('.product-price'),
        $normal_price = $(fp).find('.product-normal-price'),
        $sale_price = $(fp).find('.product-sale-price'),
        $compare_price = $(fp).find('.product-compare-price'),
        $counter = $(fp).find('.js-counter').not('.cart-product-quantity .js-counter'),
        $sale_container = $price.find('.sale'),
        container = $( '.js-product-template--' + id );
    } else {
    var $submit = $(pf).find('.js-productForm-submit'),
        $shopbar_submit = $(pf).find('.js-shopBar-buy'),
        $price = $(pf).find('.product-price'),
        $normal_price = $(pf).find('.product-normal-price'),
        $sale_price = $(pf).find('.product-sale-price'),
        $compare_price = $(pf).find('.product-compare-price'),
        $counter = $(pf).find('.js-counter').not('.cart-product-quantity .js-counter'),
        $sale_container = $price.find('.sale'),
        container = $(pf).find( '[data-section-type="product-template"]' );
    }

    if (variant) {
        if (variant.available) {
            $submit.removeClass( 'is-disabled' ).prop( 'disabled', false );
            $shopbar_submit.removeClass('is-disabled').html(shopifyData.products.shop_bar.buy_label);
            $counter.css({'opacity': 1, 'pointer-events': 'auto'});
            $price.css({'opacity': 1});

            $price.attr('data-price', variant.price);
            $normal_price.html(Shopify.formatMoney(variant.price, moneyFormat));

            if (variant.compare_at_price != null){
                if (variant.compare_at_price > variant.price) {
                    if ($sale_container.length){
                        $compare_price.html(Shopify.formatMoney(variant.compare_at_price, moneyFormat));
                        $sale_price.html(Shopify.formatMoney(variant.price, moneyFormat));
                    } else {
                        $price.append('<div class="sale" itemprop="price"><strike class="product-compare-price"></strike>&nbsp;<span class="product-sale-price"></span></div>');
                        $('.product-compare-price').html(Shopify.formatMoney(variant.compare_at_price, moneyFormat));
                        $('.product-sale-price').html(Shopify.formatMoney(variant.price, moneyFormat));
                    }
                    $normal_price.hide();
                    $sale_container.show();
                } else if (variant.compare_at_price <= variant.price) {
                    if($normal_price.length) {
                        $normal_price.html(Shopify.formatMoney(variant.price, moneyFormat));
                    } else {
                        $price.append('<div class="product-normal-price" itemprop="price">'+Shopify.formatMoney(variant.price, moneyFormat)+'</div>');
                    }
                    $sale_container.hide();
                    $normal_price.show();
                }
            } else {
                $sale_container.hide();
                $normal_price.show();

            }
            document.addEventListener('shopify:payment_button:loaded', showButtons($submit));
            function showButtons($submit){
                var sibling = $submit.next();
                if($(sibling).hasClass('shopify-payment-button')){
                    $(sibling).show();
                }
            }
        } else {
            $submit.addClass('is-disabled').prop('disabled', true).html(shopifyData.products.labels.sold_out);
            $shopbar_submit.addClass('is-disabled').html(shopifyData.products.labels.sold_out);
            $counter.css({'opacity': 0.3, 'pointer-events': 'none'});
            $price.css({'opacity': 0.3});

            $price.attr('data-price', variant.price);
            $normal_price.html(Shopify.formatMoney(variant.price, moneyFormat));

            document.addEventListener('shopify:payment_button:loaded', checkButtons($submit));
            function checkButtons($submit){
                var sibling = $submit.next();
                if($(sibling).hasClass('shopify-payment-button')){
                    $(sibling).hide();
                }
            }

            if (variant.compare_at_price != null){
                if (variant.compare_at_price > variant.price) {
                    if ($sale_container.length){
                        $compare_price.html(Shopify.formatMoney(variant.compare_at_price, moneyFormat));
                        $sale_price.html(Shopify.formatMoney(variant.price, moneyFormat));
                    } else {
                        $price.append('<div class="sale" itemprop="price"><strike class="product-compare-price"></strike>&nbsp;<span class="product-sale-price"></span></div>');
                        $('.product-compare-price').html(Shopify.formatMoney(variant.compare_at_price, moneyFormat));
                        $('.product-sale-price').html(Shopify.formatMoney(variant.price, moneyFormat));
                    }
                    $normal_price.hide();
                    $sale_container.show();
                } else if (variant.compare_at_price <= variant.price) {
                    if($normal_price.length) {
                        $normal_price.html(Shopify.formatMoney(variant.price, moneyFormat));
                    } else {
                        $price.append('<div class="product-normal-price" itemprop="price">'+Shopify.formatMoney(variant.price, moneyFormat)+'</div>');
                    }
                    $sale_container.hide();
                    $normal_price.show();
                }
            } else {
                $sale_container.hide();
                $normal_price.show();
            }
        }

        Product.showVariantImage(variant, container);
        Product.variantPreview.getImage(variant);
        

    } else {
        $submit.addClass('is-disabled').prop('disabled', true).html(shopifyData.products.labels.unavailable);
        $counter.css({'opacity': .3, 'pointer-events': 'none'});
        $price.css({'opacity': 0.3});
        document.addEventListener('shopify:payment_button:loaded', checkButtons($submit));
        function checkButtons($submit){
            var sibling = $submit.next();
            if($(sibling).hasClass('shopify-payment-button')){
                $(sibling).hide();
            }
        }
    }
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export { getCookie, setCookie };
