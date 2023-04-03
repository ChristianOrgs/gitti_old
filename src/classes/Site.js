import $ from 'jquery';
import FastClick from 'fastclick';
import Reqs from './Reqs';
import '../vendor/currency-tools';
import Gitti from './Gitti';
// import Sliders from './Sliders';

export default class Site extends Gitti {
    constructor(options) {
        super(options);
        this.$spinner = $('#Spinner').html();
        // window.Site = this;

        this.general();
        this.header();
        this.footer();

        this.loadBackgrounds();
        this.webkitSizing();
        this.keyboardAccessible();
        this.video();
        this.faq();
        this.checkReviewsApp();
        this.checkBanner();

        if (this.getQueryParameter('customer_posted') == "true") {
            $('body').addClass('signUp-posted');
            s.d.scrollTop( s.d.height() - s.w.height() );
        }
    }

    general() {
        const { $body, $window, $document } = this;

        FastClick.attach(document.body);

        $body.on('click', '.share-link', function(event) {
            event.preventDefault();

            var $el = $(this),
                popup = $el.attr('data-network'),
                link = $el.attr('href'),
                w = 700,
                h = 400;

            switch (popup) {
                case 'twitter':
                    h = 300;
                    break;
                case 'googleplus':
                    w = 500;
                    break;
            }

            window.open(link, popup, 'width=' + w + ', height=' + h);
        });

        this.$spinner = $($('#Spinner').html());
    }

    getQueryParameter(paramName) {
        paramName = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    keyboardAccessible(){
        const { $window, $body } = this;
        $window.mousedown(function() {
            $body.addClass("no-outline");
        });

        $window.keyup(function(event) {
            if ( event.keyCode === 9 ) {
                $body.removeClass("no-outline");
            }
        });
    }

    webkitSizing() {
        import(/* webpackChunkName: "modernizr" */ '../vendor/modernizr').then(() => {
            if (Modernizr.touch){
                this.setMaxWidths();
    
                this.$window.resize(function(){
                    this.setMaxWidths();
                });
            }
        });
    }

    header( enableHero = null ) {
        const { $window, $document } = this;

        const $header = $('.site-header');
        let scroll = 0;
        let heroEnabled = enableHero != null ? enableHero : $('.hero').length;
        let heroHeight = $('.hero').outerHeight();
        let alertHeight = $('.siteAlert').outerHeight();
        const initPadding = () => {
            if($('body').hasClass('template-index')){
                const firstSectionParent = $('.bodyWrap').children(":first");
                if ( !$(firstSectionParent).hasClass('header--full') || enableHero != null && enableHero == false ){
                    $('.bodyWrap').addClass('mo-padding');
                } else {
                    $('.bodyWrap').removeClass('mo-padding');
                }
            }
        };

        const getNavigationOverlapping = () => {
            $('.site-header').addClass('is-standard').removeClass('is-hamburger');

            var isNavCentered = $('.site-header').hasClass('header--logo_center_links_center') || $('.site-header').hasClass('header--logo_left_links_center');
            var additionalSpace = 180; // Additional spacing from margins
            var isImageLogo = $('.main-logo .logo').length;
            var logoWidth = isImageLogo ? $('.main-logo .logo').width() : $('.main-logo #shopName').outerWidth();
            var headerContainerWidth = $('.site-header .container > .row').width();
            var navMenuWidth = $('.nav-standard .menu').outerWidth();
            var navSearchWidth = $('.nav-standard .searchToggle').outerWidth();

            if (isNavCentered) {
                logoWidth = logoWidth * 2;
            }

            return ( parseInt(headerContainerWidth) < parseInt(navMenuWidth + logoWidth + navSearchWidth + additionalSpace) );
        }

        const checkNavigationOverlapping = () => {
            var isNavigationStandard = $('.site-header').hasClass('header--standard');

            if (isNavigationStandard) {
                var isNavigationOverlapping = getNavigationOverlapping();
                var isDesktop = $(window).width() >= 1024;

                if ( isNavigationOverlapping || !isDesktop ) {
                    $('.site-header').removeClass('is-standard').addClass('is-hamburger');
                }
            }

            $header.css('opacity', 1);
        }

        if (!$('.template-index').length) {
            $header.removeClass('header--no-bg');

            $window.on('scroll', function(){
                scroll = $(window).scrollTop();

                // if (scroll > alertHeight) {
                // 	$header.addClass('has-scrolled');
                // } else {
                // 	$header.removeClass('has-scrolled');
                // }
            });
        } else {
            /* Desktop with hero enabled (wait until after hero to transition header) */
            $window.on('scroll', function(){
                scroll = $(window).scrollTop();
                heroEnabled = $('.hero').length;

                // if (heroEnabled) {
                // 	if (scroll > alertHeight) {
                // 		$header.addClass('has-scrolled').removeClass('header--no-bg');
                // 	} else {
                // 		$header.removeClass('has-scrolled').addClass('header--no-bg');
                // 	}
                // } else {
                // 	if (scroll > -1) {
                // 		$header.addClass('has-scrolled');
                // 	} else {
                // 		$header.removeClass('has-scrolled');
                // 	}
                // }
            });
        }

        $window.on('resize', function() {
            checkNavigationOverlapping();
            // Site.setCartClosePosition();
        });

        setTimeout(checkNavigationOverlapping, 50);

        initPadding();

        $document.on('shopify:section:reorder', function(event) {
            initPadding();
        });
    }

    footer() {
        const $shopBar = $('#add-to-cart-bar');
        const $productContainer = $( '.js-product-template' );
        const $siteFooter = $( '.site-footer' );
        $(window).on('scroll',
            Reqs.throttle(function(event){
                var scrolled = $(window).scrollTop();

                if ( $productContainer.length && $shopBar.length ) {
                    var productContainerOffset = $productContainer.offset().top;

                    if ( scrolled > productContainerOffset ) {
                        $shopBar.addClass('product-bar--is-visible');
                        $siteFooter.addClass('site-footer--push')
                    } else if ( scrolled < productContainerOffset - 60 ) {
                        $shopBar.removeClass('product-bar--is-visible');
                        $siteFooter.removeClass('site-footer--push')
                    }
                }
            }, 100, this)
        );
    }

    video() {
        const $video = $('.js-video');

        if ($video.length > 0) {
            import(/* webpackChunkName: "magnific-popup" */ 'magnific-popup').then(module => {
                const magnificPopup = module.magnificPopup;

                $video.magnificPopup({
                    closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-close"></button>',
                    type: 'iframe',
                    mainClass: 'mfp-fade',
                    removalDelay: 160,
                    preloader: false,
                    fixedContentPos: false,
                    iframe: {
                      markup: '<div class="mfp-iframe-scaler">'+
                                '<div class="mfp-close"></div>'+
                                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                              '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button
    
                      patterns: {
                        youtube: {
                          index: 'youtube.com/',
                          id: 'v=',
                          src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0modestbranding=0' // URL that will be set as a source for iframe.
                        },
                      },
                      srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
                    }
                });
            });
        }
    }

    faq(){
        $('.faq-list__item-question', document).on('click', function() {
            $(this).parent().toggleClass('is-expanded');
        });
    }

    // loadBackgrounds() {

	// 			var $elementsToLoad = $('[data-bg-src]').not('.bg-loading, .bg-loaded');
    //             const { shopifyData } = this;
	// 			$elementsToLoad.each(function() {

	// 				var $el = $(this);

	// 				var src = $el.attr('data-bg-src');
	// 				var placeholder = false;

	// 				if(src == '') {
	// 					src = shopifyData.placeholderImage;
	// 					placeholder = true;
	// 				}

	// 				$el.addClass('bg-loading').prepend(s.spinner);

	// 				var im = new Image();

	// 				$(im).on('load', function() {

	// 					$el.css('background-image', 'url('+src+')').removeClass('bg-loading').addClass('bg-loaded').find('.spinner').fadeOut(300, function() {
	// 							$(this).remove();
	// 						});

	// 					if(placeholder) {
	// 						$el.addClass('bg-placeholder');
	// 					}

	// 					// ensures image is visible in quickView when as it's opened
	// 					if ($('.quickView').length){
	// 						$('.quickView').find('.quickView-img-inner').addClass('quickView-variant-img--is-active');
	// 					}

	// 				});

	// 				$(im).on('error', function() {
	// 					$el.css('background-image', `url(${shopifyData.placeholderImage})`)
	// 						.removeClass('bg-loading').addClass('bg-placeholder bg-loaded').find('.spinner').fadeOut(300, function() {
	// 							$(this).remove();
	// 						});
	// 				});

	// 				im.src = src;

	// 				if(im.complete) {
	// 					$(im).trigger('load');
	// 				}

	// 			})
			
    // }
    
    onPriceAdded() {
        if( Currency ){
            Currency.convertAll(shopCurrency, $('[name=currencies]').val());
            onCurrencySet();
        }
    }

    checkReviewsApp() {
        var checking = setInterval(function() {
            var reviewsAppInstalled = typeof(window.SPR) == 'function';

            if (!reviewsAppInstalled) {
                $('body').attr('data-app-reviews', 'not-installed');
            } else {
                $('body').removeAttr('data-app-reviews');
                clearInterval(checking);
            }
        }, 100);

        setTimeout(function() {
            clearInterval(checking);
        }, 15000);
    }

    checkBanner() {
        var siteHeader = $( '.site-header' );
        var forceHeaderStyle = $( '.banner[data-header-style="index"]' ).length;
        var isAboutTemplate = $( '[data-section-type="about-template"]' ).length;

        if ( isAboutTemplate ) {
            if (forceHeaderStyle) {
                siteHeader.addClass( 'template-index' );
            } else {
                siteHeader.removeClass( 'template-index' );
            }
        }
    }

    static scroller( container, item ) {
        container.on( 'scroll', Reqs.throttle(function() {
            var $items = $(this).find( item );
            $items.each( function() {
                var $item = $(this);
                var itemWidth = $item.outerWidth();
                var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                var itemLeft = $item.position().left;

                if ( itemLeft >= -itemWidth / 2 && itemLeft + windowWidth / 2 < windowWidth ) {
                    $item.addClass( 'is-visible' ).siblings().removeClass( 'is-visible' );
                }
            });
        }, 10)).trigger('scroll');

        $(window).on( 'resize' , Reqs.debounce( function() {
            container.trigger('scroll');
        }, 100));
    }

    setMaxWidths() {
        const windowWidth = $(window).outerWidth();
        const navWidth = Site.nav.getWidth();

        $('html, body').css({'max-width': windowWidth});
        // Size offcanvas nav
        $('.nav-container').css({'width': navWidth});
        // Size header
        $('.site-header').css({'width': windowWidth});
    }
}
