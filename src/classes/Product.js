import $ from 'jquery';
import ColorSwatches from './ColorSwatches';
import Gitti from './Gitti';
import { productCallback } from '../utils';

export default class Product extends Gitti {
    constructor(options) {
		super(options);
		const isScrollerSelected = $('.product-layout--scrollable').length;

		this.variantPreview = this.initVariantPreview();
		this.variantPopover = this.initVariantPopover();
		this.imageZoom = this.initImageZoom();
		this.productImages();
		this.variantsInit();

		if ( isScrollerSelected ) {
			import(/* webpackChunkName: "scroller" */ '../modules/scroller').then(() => {
				console.log('scroller loaded');
			});
		}

		if ($('#add-to-cart-bar').length) {
			import(/* webpackChunkName: "shop-bar" */ '../modules/shop-bar').then(() => {
				console.log('shop-bar loaded')
			});
		}
    }

    variantsInit() {
		/**
		 * Initialize variants dropdown.
		 */
		const $container = $( '.js-product-template' );
		const enableColorSwatches = $container.find('.productForm').data('color_swatches');
		const productJSON = $('#product-json').text();
		const product = JSON.parse(productJSON);
		new Shopify.OptionSelectors('product-select', {
			product: product,
			onVariantSelected: this.selectCallback.bind(this)
		});

		manageOptions( product );

		function manageOptions( obj ){
		  if (obj['options'].length === 1 && obj['variants'].length){
			if (obj['variants'][0].title === 'Default Title') {
			  for (let i = 0; i < obj['options'].length; i++) {
				$('#product-select-option-'+[i]).closest('.productForm-block').hide();
			  }
			} else {
			  for (let i = 0; i < obj['options'].length; i++) {
				$('#product-select-option-'+[i]).closest('.selector-wrapper').attr('data-id', 'product-select-option-'+[i]).prepend('<span class="selectArrow"></span><label>'+obj['options'][0]+'</label>');
			  }
			}
		  } else if (obj['options'].length > 1){
			for (let i = 0; i < obj['options'].length; i++) {
			  $('#product-select-option-'+[i]).closest('.selector-wrapper').attr('data-id', 'product-select-option-'+[i]).prepend('<span class="selectArrow"></span>');
			}
		  }
		}

		if (enableColorSwatches) {
			ColorSwatches.bind($container);
		}
	}

	static setSlidesHeight($productImgSlider) {
		// Set height to slides if slider contains landscape images
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
	}

	/*
	 * Sticky "Shop" Bar in product.liquid
	 * Hidden via CSS under 768px viewport size
	 */
	shopBar() {
		var product = JSON.parse(document.getElementById( 'product-json' ).innerHTML);
		var $shopBar = $('#add-to-cart-bar');
		var $selectors = $( 'select', $shopBar );

		new Shopify.OptionSelectors('product-bar-select', {
			product: product,
			onVariantSelected: this.selectCallback.bind(this)
		});

		manageOptions( product );

		function manageOptions( obj ) {
			if (obj['options'].length === 1 && obj['variants'].length){
				if (obj['variants'][0].title === 'Default Title') {
					for (i = 0; i < obj['options'].length; i++) {
						$('#product-bar-select-option-'+[i]).closest('.productForm-block').hide();
					}
				} else {
					for (i = 0; i < obj['options'].length; i++) {
						$('#product-bar-select-option-'+[i]).closest('.selector-wrapper').attr('data-id', '#product-bar-select-option-'+[i]).prepend('<span class="selectArrow"></span><label>'+obj['options'][0]+'</label>');
					}
				}
			} else if (obj['options'].length > 1){
				for (i = 0; i < obj['options'].length; i++) {
					$('#product-bar-select-option-'+[i]).closest('.selector-wrapper').attr('data-id', '#product-bar-select-option-'+[i]).prepend('<span class="selectArrow"></span>');
				}
			}
		}
	}

	productImages(){
        import(/* webpackChunkName: "imagefill" */ 'imagefill').then(() => {
            var $imagefills = $('.js-imagefill');

            $imagefills.each(function(){
                $(this).imagefill();
            });

            var showImages = setInterval(function(){
                if ($imagefills.find('.product-image-img').attr('style') != ''){
                    $imagefills.find('.product-image-img').css('opacity', 1);
                    removeTimer();
                }
            }, 100);

            function removeTimer(){
                clearInterval(showImages);
            }
        });
	}

	// this is what is being called from the product.liquid
	selectCallback(variant, selector) {
		const { shopifyData } = this;
		productCallback({
			money_format: shopifyData.shop.money_format,
			variant: variant,
			selector: selector
		}, this);

		var enableColorSwatches = $('.productForm').data('color_swatches');
		if (enableColorSwatches) {
			new ColorSwatches(variant, selector);
		}
	}

	// show variant image within quickView or within slideshow (mobile product page)
	showVariantImage(variant, container) {
		var $quickView = $('.quickView--is-active .quickView'),
			variantImage = variant.featured_image ? variant.featured_image.src : false,
			variantID = variant.id;

		if( variantImage ) {
			// Remove protocol to match original src markup
			variantImage = variantImage.substring(variantImage.indexOf('//'));
		}

		if( $quickView.length && container.hasClass( 'js-collectionBlock' ) ) {
			// Show variant image in quick view
			var $imageContainer = $quickView.find('.quickView-img'),
				$variantImages = $imageContainer.children(),
				$URLs = $quickView.find('.js-productUrl');

			$currentVariantImage = variantImage ? $variantImages.filter('[data-bgset*="'+variantImage+'"]') : $();

			if(!$currentVariantImage.length) {

				if(variantImage) {
					$currentVariantImage = $variantImages.first().clone();

					$currentVariantImage
						.attr('data-bgset', variantImage)
						.removeAttr('style')
						.removeClass('bg-loading bg-loaded quickView-variant-img--is-active')
						.appendTo($imageContainer);

				} else {
					$currentVariantImage = $variantImages.first();
				}
			}

			setTimeout(function() {
				$currentVariantImage
					.addClass('quickView-variant-img--is-active')
					.siblings().removeClass('quickView-variant-img--is-active');

				// swap URLs to support variant deep-linking
				$URLs.each(function(){
					// if the URL doesn't have a query string, just use the base URL
					// otherwise, remove the query string and add a new one with the new variantID
					var current_url = $(this).attr('href').indexOf('?variant') != -1 ? $(this).attr('href').substring(0, $(this).attr('href').indexOf('?')) : $(this).attr('href');
					$(this).attr('href', current_url + '?variant=' + variantID);
				});
			});

		} else {
			// Show variant image preview in product page
			var $imgSlider = container.find('.productImgSlider').first();
			var $imgScrollerNav = container.find('.productImgScroller-nav');
			var flick = $imgSlider.data('flickity');

			// Activate image slide in mobile view
			if(flick && flick.isActive) {
				var $variantSlide = $imgSlider.find('[data-image="'+variantImage+'"]');
				if ($variantSlide.index() != -1) {
					flick.select($variantSlide.index());
				}

				$('.product-image').removeClass('is-selected-product');
				$variantSlide.addClass('is-selected-product');
			} else {
				var $variantSlide = $imgScrollerNav.find('[data-image="'+variantImage+'"]');

				if ( $variantSlide.length ) {
					$variantSlide.trigger('click');
				}
			}
		}
	}

	initVariantPreview() {
		const triggeredByUser = false;
		let selected_img = $('');
		let selected_img_url = '';
		const fade = () => {
			$('.product-image').not(selected_img).addClass('fadeOut');
			this.fadeTimer = setTimeout(function(){
				$('.product-image').removeClass('fadeOut');
			}, 2000);
		}

		const scrollTarget = (selected_img) => {
			var targetOffset = selected_img.offset().top,
				scrollTarget = targetOffset - (($(window).height() - selected_img.outerHeight()) / 2);

			$('html, body').animate({scrollTop: scrollTarget}, 500, function(){
				fade(selected_img);
			});
		}

		return {
			bind: () => {
				$('.js-variant-preview').on('click', () => {
					scrollTarget(selected_img);
				});
			},
			getImage: function(variant){
				// if there are NO variant images, use the first image on the page
				// if there are NO images at all, return an empty string
				var newImage = variant.featured_image ? variant.featured_image.src :
						$('.product-image').first() ? $('.product-image').first().attr('data-image') : '',
					$container = $('.js-variant-preview'),
					currentImage = $container.attr('data-bg-src'),
					$productSlides = $('.product-image');
	
				if (newImage){
					// need to set this var if we want to add a SELECTED
					// tag to an image on load, which only happens if
					// the url has a ?variant string in it
					selected_img_url = newImage.substring(newImage.indexOf('//'));
				}
	
				// first page load
				if(!this.triggeredByUser) {
					// IF the URL has a variant already selected
					// get new image url and match it to the corresponding product-image
	
					$productSlides.each(function(){
						var image_url = $(this).attr('data-image');
						var id = $(this).attr('data-id');
						$(this).removeClass('is-selected-product');
					});
					// either way, init the click event, and set the triggeredByUser
					// var to true so the preview can show, now that initial load
					// is out of the way
					this.bind();
					this.triggeredByUser = true;
					return;
				}
			}
		}
	}

	initVariantPopover() {
		const triggeredByUser = false;
		const popoverTimer = 0;
		const fadeTimer = 0;
		const selected_img = $('');
		const selected_img_url = '';

		// fades all product images except the image passed as the @param
		const fade = function(selected_img){
			$('.product-image').not(selected_img).addClass('fadeOut');
			this.fadeTimer = setTimeout(function(){
				$('.product-image').removeClass('fadeOut');
			}, 2000);
		};

		// @param variant = the url of the image
		const scrollTarget = function(selected_img){
			var targetOffset = selected_img.offset().top,
				scrollTarget = targetOffset - (($(window).height() - selected_img.outerHeight()) / 2);

			$('html, body').animate({scrollTop: scrollTarget}, 500, function(){
				// Product.variantPopover.fade(selected_img);
			});
		}

		$('#VariantPopoverContainer').on('click', function(){
			scrollTarget(selected_img);
		});

		return {
			getImage: function(variant){
				if(!this.triggeredByUser) {
					this.triggeredByUser = true;
					return;
				}
	
				var newImage = variant.featured_image ? variant.featured_image.src : false,
					$container = $('#VariantPopoverContainer .popover'),
					currentImage = $container.find('.popover-item-thumb').attr('data-bg-src'),
					$productImages = $('.product-image'),
	
					// handlebars vars
					data = {},
					source = $('#VariantPopover').html(),
					template = Handlebars.compile(source);
	
				clearTimeout(this.popoverTimer); // clear popover timer
	
				// if the variant has a NEW image, that isn't the same as the currently shown variant image
				// initiate popover
				if (newImage && (newImage !== currentImage)) {
	
					// Create new locally available vars for the selected image and it's src URL
					// Also, add classes to show which product-image is selected
					if (this.triggeredByUser){
						selected_img_url = newImage.substring(newImage.indexOf('//'));
						$productImages.each(function(){
							var image_url = $(this).attr('data-image');
							$(this).removeClass('is-selected-product');
							if (image_url == selected_img_url) {
								$(this).addClass('is-selected-product');
								return selected_img = $(this);
							}
						});
					}
	
					// if image is fully visible, don't show the popover, just fade out the other products
					// However, *do* swap the image in the popover, since the logic to hide/show it depends
					// on the image being different than what is selected.
					if (selected_img.offset().top > $(window).scrollTop() && $(window).width() > 768) {
						// clearTimeout(this.fadeTimer);
						// Product.variantPopover.fade(selected_img);
						$container.removeClass('is-visible'); // hide popover
						$container.empty(); // if there's a new image, clear the container for the new one
						data = {
							img: newImage, // create data for Handlebars
						};
						$container.append(template(data)); // append the new image via Handlebars
						return;
					}
	
					$productImages.removeClass('fadeOut');
	
					$container.empty(); // if there's a new image, clear the container for the new one
	
					data = {
						img: newImage, // create data for Handlebars
					};
	
					$container.append(template(data)); // append the new image via Handlebars
	
					$container.addClass('is-visible'); // show popover
	
					this.popoverTimer = setTimeout(function(){
						$container.removeClass('is-visible'); // hide popover
					}, 3000);
				}
			}
		}
	}

	initImageZoom() {
		import(/* webpackChunkName: "panzoom" */ 'jquery.panzoom').then((panzoom) => {
			const image = function(url) {
				var modal = $('.mobile-zoom-overlay'),
					modal_img = new Image();
	
				modal_img.src = url;
				modal.append(modal_img);
	
				$(modal_img).load(function(){
					var $img = $(this),
						img_height = $img.height(),
						img_position = (($(window).innerHeight() - img_height)/2);
	
					$img.css('top', img_position);
					modal.addClass('is-visible');
					$img.addClass('fade-in');
					$img.panzoom();
				});
	
				$('.js-MobileZoom-close').on('click', function(){
					imageZoom.hide(modal);
				});
			}
	
			const hide = function(modal) {
				modal.addClass('is-hiding');
				setTimeout(function(){
					modal.removeClass('is-hiding is-visible');
					modal.find('img').panzoom('destroy').remove(); // kill zoom and remove <img>
				}, 300);
			}
	
			$('.product-image-img').on('click', function(){
				var image_url = $(this).closest('.product-image').attr('data-bg-src') || $(this).closest('.product-image').attr('data-image');
				imageZoom.image(image_url);
			});

			this.imageZoom = {
				image,
				hide
			};
		});
	}
}
