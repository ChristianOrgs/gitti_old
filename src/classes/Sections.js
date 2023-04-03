import $ from 'jquery';
import Site from './Site';

export default class Sections {
    constructor() {
        // alert('test');
        $( document )
				.on( 'shopify:section:load', this.onSectionLoad )
				.on( 'shopify:section:unload', this.onSectionUnload )
				.on( 'shopify:section:select', this.onSectionSelect )
				.on( 'shopify:section:deselect', this.onSectionDeselect )
				.on( 'shopify:block:select', this.onBlockSelect )
				.on( 'shopify:block:deselect', this.onBlockDeselect );
    }

    onSectionLoad(e) {
        alert('asdfasdf');
			console.log(e)
			const section = e.target.children[ 0 ].getAttribute( 'data-section-type' ) || e.target.children[ 1 ].getAttribute( 'data-section-type' ) || e.target.children[ 2 ].getAttribute( 'data-section-type' ) || false;

			Site.images.loadBackgrounds();
			Site.animations.init();

			switch( section ) {
				case 'header':
					_loadHeader( e.target );
					break;
				case 'footer':
					_loadFooter( e.target );
					break;
				case 'featured-product':
					_loadFeaturedProduct( e.target );
					break;
				case 'collection-static':
					_loadCollectionStatic( e.target );
					break;
				case 'instagram':
					_loadInstagram( e.target );
					break;
				case 'gallery':
					_loadGallery( e.target );
					break;
				case 'mosaic':
					_loadMosaic( e.target );
				case 'testimonials':
					_loadTestimonials( e.target );
					break;
				case 'map':
					_loadGmap( e.target );
					break;
				case 'slideshow':
					_loadHero( e.target );
					break;
				case 'collection-template':
					_loadCollectionTemplate( e.target );
					break;
				case 'featured-collection':
					_loadFeaturedCollection( e.target );
					break;
				case 'collection-grid':
					_loadListCollections( e.target );
					break;
				case 'product-template':
					_loadProductTemplate( e.target );
					break;
				case 'blog-template':
					_loadBlogTemplate( e.target );
					break;
				case 'featured-blog':
					_loadFeaturedBlog( e.target );
					break;
				case 'featured-video':
					_loadFeaturedVideo( e.target );
					break;
				case 'logos-list':
					_loadLogosList( e.target );
					break;
				case 'about-template':
					_loadAboutTemplate( e.target );
					break;
				case 'faq-template':
					_loadFaqList( e.target );
					break;
				case 'faq-section':
					_loadFaqList( e.target );
					break;

			}

			function _loadHeader( t ) {
				var btn = $( '.js-menuToggle' );
				var page = $( 'body, html' );
				var content = $( '.bodyWrap' );
				var header = $( '.site-header' );

				var resetHeader = function() {
					page.removeClass( 'nav--is-visible' );
					content.removeAttr( 'style' );
					$('.header-fix-cont-inner, .bodyWrap, .siteAlert, .main-logo').css('transform','none');
				}

				var setHeaderPosition = function() {
					var promo = $('.js-siteAlert');
					var promoHeight = promo.outerHeight();

					if ( promo.length ){
						header.addClass( 'alert--is-visible shift--alert' );

						$( window ).on('scroll', Reqs.throttle(function(){
							( $( window ).scrollTop() >= promoHeight ) ? header.removeClass( 'shift--alert' ) : header.addClass( 'shift--alert' );
						}, 50));
					}
				}

				resetHeader();

				setHeaderPosition();

				Site.nav.hide();
				Site.nav.init();
				Site.header();

				Search.init();
				if ( !$('.template-cart').length ) {
					Cart.init();
				}

				setTimeout( function() {
					$(window).scroll();
				}, 100);
			}

			function _loadFooter( t ) {
				Site.footer();
			}

			function _loadInstagram( t ) {
				Insta.init();
			}

			function _loadFeaturedProduct( t ) {
				FeaturedProduct.init();

				// Re-initialize Reviews
				var showReviews = $( t ).find('.js-product-template').data('show_reviews');
				if ( showReviews && typeof( window.SPR ) == 'function') {
					window.SPR.initDomEls();
					window.SPR.loadBadges();
				}
			}

			function _loadCollectionStatic( t ) {
				FeaturedProduct.init();

				// Re-initialize Reviews
				var showReviews = $( t ).find('.js-product-template').data('show_reviews');
				if ( showReviews && typeof( window.SPR ) == 'function') {
					window.SPR.initDomEls();
					window.SPR.loadBadges();
				}
			}

			function _loadGmap( t ) {
				Gmap.init( );
			}

			function _loadFeaturedBlog( t ) {
				var itemSelector = $( t ).find('.blogModule-posts');

				Blog.init();
				Blog.truncateText(itemSelector);
				$(window).resize(Reqs.throttle(Blog.truncateText(itemSelector), 50));
			}

			function _loadBlogTemplate( t ) {
				// Reload ajaxify
				ajaxify();
				Blog.init();
			}

			function _loadGallery( t ) {

					var slider, options;

					slider = $( t ).find( '.js-slider' );
					options = JSON.parse( slider.data( 'slick' ).replace(/'/g, '"') );

					// Resizes background image without stretching it
					if ( slider.data('image-height') == 'original-height' ){
						Site.sliders.setSlidesHeight( slider );
						$(window).resize(
							Reqs.debounce(function(event){
								Site.sliders.setSlidesHeight( slider );
						}, 250));
					}

					slider.on('init', function() {
						$(this).removeClass('gallery-slider--is-loading');
					});

					slider.slick( options );

			}

			function _loadMosaic( t ) {

					var slider = $('.js-mosaic__blocks');

					Site.sliders.initMobileSlider(slider);
					$(window).resize(
						Reqs.debounce( function(event) {
						Site.sliders.initMobileSlider(slider);
					}, 250));

					if ( typeof(Currency) != 'undefined' && Currency ){
					    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
					    onCurrencySet();
					}

			}

			function _loadTestimonials( t ) {

					var slider = $('.js-testimonials__blocks');

					Site.sliders.initMobileSlider(slider);
					$(window).resize(
						Reqs.debounce( function(event) {
						Site.sliders.initMobileSlider(slider);
					}, 250));

			}

			function _loadHero( t ) {
				var hero, options, scrollDownBtn;

				hero = $( t ).find( '.js-hero-slider' );
				options = JSON.parse( hero.data( 'slick' ).replace(/'/g, '"') );

				// Resizes background image without stretching it
				if ( hero.data('image-height') == 'original-height' ){
					Site.sliders.setSlidesHeight( hero );
					$(window).resize(
						Reqs.debounce(function(event){
							Site.sliders.setSlidesHeight( hero );
					}, 250));
				}

				hero.on('init', function() {
					var currentStyle = $(this).find('.js-slide[data-slick-index="1"]').data('style');
					$(this).attr('data-current-style', currentStyle);
					$(this).removeClass('hero--is-loading');
				});

				hero.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
					var activeSlide = parseInt(nextSlide + 1);
					var currentStyle = $(this).find('.js-slide[data-slick-index="' + activeSlide +'"]').data('style');
					$(this).attr('data-current-style', currentStyle);
				});

				hero.slick( options );

				scrollDownBtn = $( t ).find('.js-scroll-down');
				scrollDownBtn.on('click', function(e) {
					e.preventDefault();
					var isStandardNav = $(window).width() >= 768 && $('.site-header').hasClass('is-standard');
					var headerHeight = isStandardNav ? 59 : -1;
					var scrollToPosition = parseInt(hero.offset().top + hero.outerHeight() - headerHeight);
					$('html, body').stop(true, false).animate({ 'scrollTop': scrollToPosition }, 500);
				});

				var page = $( 'body, html' );
				var content = $( '.bodyWrap' );
				var header = $( '.site-header' );

				var resetHeader = function() {
					page.removeClass( 'nav--is-visible' );
					content.removeAttr( 'style' );
					$('.header-fix-cont-inner, .bodyWrap, .siteAlert, .main-logo').css('transform','none');
				}

				var setHeaderPosition = function() {
					var promo = $('.js-siteAlert');
					var promoHeight = promo.outerHeight();

					if ( promo.length ){
						header.addClass( 'alert--is-visible shift--alert' );

						$( window ).on('scroll', Reqs.throttle(function(){
							( $( window ).scrollTop() >= promoHeight ) ? header.removeClass( 'shift--alert' ) : header.addClass( 'shift--alert' );
						}, 50));
					}
				}

				resetHeader();

				setHeaderPosition();

				// Header fix if no slideshow
				var enableHero = true;
				Site.header( enableHero );

				// Trigger scroll to change the header style
				setTimeout( function() {
					$(window).scroll();
				}, 100);
			}

			function _loadFeaturedCollection( t ) {
				var collectionList = $( t ).find('.js-collectionGrid');
				var carousel = collectionList.find( '.js-collection-slider' );
				var item = '.collectionBlock';
				QuickView.init();

				// Re-initialize Reviews
				var showReviews = collectionList.data('show_reviews');
				if ( showReviews && typeof( window.SPR ) == 'function') {
					window.SPR.initDomEls();
					window.SPR.loadBadges();
				}


				$(window).on('resize', Reqs.debounce(() => {
					this.setBadgePosition();
					Site.sliders.setCarouselState( collectionList );
				}, 250));

				if ( typeof(Currency) != 'undefined' && Currency ){
				    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
				    onCurrencySet();
				}

				this.setBadgePosition();
				Site.sliders.setCarouselState( collectionList );
				Site.scroller( carousel, item );
			}

			function _loadCollectionTemplate( t ) {
				var collectionList = $( t ).find('.js-collectionGrid');
				var showReviews = collectionList.data('show_reviews');

				Collection.init();
				Site.sliders.init();
				QuickView.init();
				
				// Re-initialize Reviews
				if ( showReviews && typeof( window.SPR ) == 'function') {
					window.SPR.initDomEls();
					window.SPR.loadBadges();
				}

				$(window).on('resize', Reqs.debounce(() => {
					this.setBadgePosition();
				}, 250));

				this.setBadgePosition();
			}

			function _loadListCollections( t ) {
				var collectionList = $( t ).find('.js-collection-grid');

				$(window)
					.on('load', function() {
						ListCollections.truncateBlockText(collectionList);
					})
					.on('resize', Reqs.throttle(function() {
						ListCollections.truncateBlockText(collectionList);
				}, 50));
			}

			function _loadFeaturedVideo( t ) {
				Site.video();
			}

			function _loadLogosList( t ) {
				var slider, options;

				slider = $( t ).find( '.js-logos-slider' );
				options = {
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

				slider.slick( options );
			}

			function _loadProductTemplate( t ) {
				if(!$('body').hasClass('template-index')){
					var productTemplate = $( t );
					var update = true;
					var product = JSON.parse(document.getElementById('product-json').innerHTML);
					var enableColorSwatches = $('.productForm').data('color_swatches');

					Product.init( update );

					Site.sliders.init();
					Site.video();
				}

				// Re-initialize Reviews
				var showReviews = $('.js-product-template').data('show_reviews');

				if ( showReviews && typeof( window.SPR ) == 'function') {
					window.SPR.initDomEls();
					window.SPR.loadBadges();
					window.SPR.loadProducts();
				}
			}

			function _loadAboutTemplate( t ) {
				Site.checkBanner();
			}

			function _loadFaqList( t ) {
				var $faqList = $( t ).find( '.faq-list' );

				$faqList.on('click', '.faq-list__item-question', function() {
					$(this).parent().toggleClass('is-expanded');
				});
			}
    }

    onSectionUnload(e) {

			var section = e.target.children[ 0 ].getAttribute( 'data-section-type' ) || false;

			switch( section ) {
				case 'instagram':
					_unloadInstagram( e.target );
					break;
				case 'gallery':
					_unloadGallery( e.target );
					break;
				case 'slideshow':
					_unloadHero( e.target );
					break;
				case 'logos-list':
					_unloadLogosList( e.target );
					break;
				case 'mosaic':
					_unloadMosaic( e.target );
					break;
				case 'testimonials':
					_unloadTestimonials( e.target );
					break;
				case 'popup':
					_unloadPopup( e.target );
					break;
			}

			function _unloadInstagram( t ) {
				var slider = $( t ).find( '.js-instafeed' );

				slider.slick( 'unslick' );
			}

			function _unloadGallery( t ) {
				var slider = $( t ).find( '.js-slider' );

				slider.slick( 'unslick' );
			}

			function _unloadHero( t ) {
				var hero = $( t ).find( '.js-hero-slider' );

				hero.slick( 'unslick' );

				var page = $( 'body, html' );
				var content = $( '.bodyWrap' );
				var header = $( '.site-header' );

				var resetHeader = function() {
					page.removeClass( 'nav--is-visible' );
					content.removeAttr( 'style' );
					$('.header-fix-cont-inner, .bodyWrap, .siteAlert, .main-logo').css('transform','none');
				}

				var setHeaderPosition = function() {
					var promo = $('.js-siteAlert');
					var promoHeight = promo.outerHeight();

					if ( promo.length ){
						header.addClass( 'alert--is-visible shift--alert' );

						$( window ).on('scroll', Reqs.throttle(function(){
							( $( window ).scrollTop() >= promoHeight ) ? header.removeClass( 'shift--alert' ) : header.addClass( 'shift--alert' );
						}, 50));
					}
				}

				resetHeader();

				setHeaderPosition();

				// Header fix if no slideshow
				var enableHero = false;
				Site.header( enableHero );

				// Trigger scroll to change the header style
				setTimeout( function() {
					$(window).scroll();
				}, 100);
			}

			function _unloadLogosList( t ) {
				var slider = $( t ).find( '.js-logos-slider' );

				slider.slick( 'unslick' );
			}

			function _unloadMosaic( t ) {
				var slider = $( t ).find( '.js-mosaic__blocks' );
				var isSlickActive = slider.hasClass('slick-initialized');

				if ( isSlickActive ) {
					slider.slick( 'unslick' );
				}

			}

			function _unloadTestimonials( t ) {
				var slider = $( t ).find( '.js-testimonials__blocks' );

				slider.slick( 'unslick' );
			}

			function _unloadPopup( t ) {
				Popup.hide();
			}

		
    }

    onSectionSelect(e) {

			var section = e.target.children[ 0 ].getAttribute( 'data-section-type' ) || e.target.children[ 1 ].getAttribute( 'data-section-type' ) || e.target.children[ 2 ].getAttribute( 'data-section-type' ) || false;

			switch( section ) {
				case 'header':
					_selectHeader( e.target );
					break;
				case 'blog-template':
					_selectBlog( e.target );
					break;
				case 'popup':
					_selectPopup( e.target );
					break;
				case 'collection-grid':
					_selectListCollection( e.target );
					break;
			}

			function _selectHeader( t ) {
				var btn = $( '.js-menuToggle' );
				var page = $( 'body, html' );
				var content = $( '.bodyWrap' );
				var header = $( '.site-header' );

				var resetHeader = function() {
					page.removeClass( 'nav--is-visible' );
					content.removeAttr( 'style' );
					$('.header-fix-cont-inner, .bodyWrap, .siteAlert, .main-logo').css('transform','none');

					if ( $( 'body' ).hasClass( 'cart--is-visible' ) ) {
						$( '.js-cartToggle' ).click();
					}
				}

				var setHeaderPosition = function() {
					var promo = $('.js-siteAlert');
					var promoHeight = promo.outerHeight();

					if ( promo.length ){
						header.addClass( 'alert--is-visible shift--alert' );

						$( window ).on('scroll', function(){
							( $( window ).scrollTop() >= promoHeight ) ? header.removeClass( 'shift--alert' ) : header.addClass( 'shift--alert' );
						});
					}
				}

				resetHeader();

				setHeaderPosition();
				Site.nav.hide();
				Site.header();

				$('.header-fix-cont-inner').css('opacity','1');
			}

			function _selectPopup( t ) {
				Popup.init();
			}

			function _selectBlog( t ) {
				var itemSelector = $( t ).find('.blogModule-posts');

				Blog.truncateText(itemSelector);
				$(window).resize(Reqs.throttle(Blog.truncateText(itemSelector), 50));
			}

			function _selectListCollection( t ) {
				var collectionList = $( t ).find('.js-collection-grid');

				ListCollections.truncateBlockText(collectionList);
			}
		
    }

    onSectionDeselect(e) {
        var section = e.target.children[ 0 ].getAttribute( 'data-section-type' ) || false;

			switch( section ) {
				case 'header':
					_deselectHeader( e.target );
					break;
			}

			function _deselectHeader( t ) {
				Site.nav.hide();
			}
    }

    onBlockSelect(e) {

			var block = e.target.getAttribute( 'data-block' ) || false;

			switch( block ) {
				case 'slide':
					_selectBlockSlide( e.target );
					break;
				case 'banner':
					_selectBlockBanner( e.target );
					break;
				case 'mosaic':
					_selectBlockMosaic( e.target );
					break;
				case 'testimonial':
					_selectBlockTestimonial( e.target );
					break;
				case 'item_logo':
					_selectBlockItemLogo( e.target );
					break;
			}

			function _selectBlockSlide( t ) {
				var slider, index;

				slider = $( t ).parents( '.slick-slider' );
				index = $( t ).parents('.slick-slide:not(.slick-cloned)').attr( 'data-slick-index' );

				slider.addClass( 'no-transition' );
				slider.slick( 'slickGoTo', index );
				slider.slick( 'slickPause' );

				$( slider ).find( '.slick-current' ).on( 'lazybeforeunveil', function() {
					Site.sliders.setSlidesHeight( slider );
				});

			}

			function _selectBlockBanner( t ) {
				Site.checkBanner();
			}

			function _selectBlockMosaic( t ) {
				var slider = $( t ).parents( '.js-mosaic__blocks' ),
					isSlickActive = slider.hasClass('slick-initialized'),
					index;

				if (isSlickActive) {
					index = $( t ).parents('.slick-slide:not(.slick-cloned)').attr( 'data-slick-index' );

					slider.addClass('no-transition')
					slider.slick( 'slickGoTo', index );
					slider.slick( 'slickPause' );
				}

				if ( typeof(Currency) != 'undefined' && Currency ){
				    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
				    onCurrencySet();
				}
			}

			function _selectBlockTestimonial( t ) {
				var slider = $( t ).parents( '.js-testimonials__blocks' ),
					isSlickActive = slider.hasClass('slick-initialized'),
					index;

				if (isSlickActive) {
					index = $( t ).parents('.slick-slide:not(.slick-cloned)').attr( 'data-slick-index' );

					slider.slick( 'slickGoTo', index );
					slider.slick( 'slickPause' );
				}
			}

			function _selectBlockItemLogo( t ) {
				var slider, index;

				slider = $( t ).parents( '.js-logos-slider' );
				index = $( t ).parents('.slick-slide:not(.slick-cloned)').attr( 'data-slick-index' );

				slider.slick( 'slickGoTo', index );
			}

		
    }

    onBlockDeselect(e) {
        var block = e.target.getAttribute( 'data-block' ) || false;

			switch( block ) {
				case 'slide':
					_deselectBlockSlide( e.target );
					break;
				case 'item_logo':
					_deselectBlockItemLogo( e.target );
					break;
			}

			function _deselectBlockSlide( t ) {
				var slider;

				slider = $( t ).parents( '.slick-slider' );
				slider.slick('slickPlay');
				slider.removeClass('no-transition')
			}

			function _deselectBlockItemLogo( t ) {
				var slider;

				slider = $( t ).parents( '.js-logos-slider' );
				slider.slick('slickPlay');
			}
    }
}
