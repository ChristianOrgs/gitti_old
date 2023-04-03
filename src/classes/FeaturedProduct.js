import $ from 'jquery';
import { productCallback } from '../utils';
import Gitti from './Gitti';
import ColorSwatches from './ColorSwatches';
import Product from './Product';
import Reqs from './Reqs';

export default class FeaturedProduct extends Gitti {
	constructor(options) {
		super(options);
		const { shopifyData } = this;
		const CurrentProduct = new Product(options);
		$("section[data-section-type='featured-product']").each( function () {
			var section = $(this);

			if(!$(section).hasClass('fp-initialized') && !$(section).hasClass('onboarding-product')){
				var id = $(section).data('section-id');
				var productJSON = $(section).find('#product-json').text();
				var product = JSON.parse(productJSON);
				var enableColorSwatches = $('.productForm').data('color_swatches');

				const selectCallback = function(variant, selector) {
					productCallback({
					  money_format: "{{ shop.money_format | replace: 'money', '\"money\"' }}",
					  variant: variant,
					  selector: selector
					}, CurrentProduct);

					// BEGIN SWATCHES
					if (enableColorSwatches) {
						new ColorSwatches(variant, selector);
					}
					// END SWATCHES
				};

				/**
				 * Reinitialize variant dropdown.
				 */
				var selectorClass = 'product-select--'+id;
				new Shopify.OptionSelectors(selectorClass, {
					product: product,
					onVariantSelected: selectCallback
				});

				manageOptions( product, id );

				function manageOptions( obj,id ){
				  if (obj['options'].length === 1 && obj['variants'].length){
					if (obj['variants'][0].title === 'Default Title') {
					  for (i = 0; i < obj['options'].length; i++) {
						$('#product-select--'+id+'-option-'+[i]).closest('.productForm-block').hide();
					  }
					} else {
					  for (i = 0; i < obj['options'].length; i++) {
						$('#product-select--'+id+'-option-'+[i]).closest('.selector-wrapper').attr('data-id', 'product-select-option-'+[i]).prepend('<span class="selectArrow"></span><label>'+obj['options'][0]+'</label>');
					  }
					}
				  } else if (obj['options'].length > 1){
					for (i = 0; i < obj['options'].length; i++) {
					  $('#product-select--'+id+'-option-'+[i]).closest('.selector-wrapper').attr('data-id', 'product-select-option-'+[i]).prepend('<span class="selectArrow"></span>');
					}
				  }

				  $('.featured-product--'+id).addClass('fp-initialized');
				}

				if (enableColorSwatches) {
					ColorSwatches.bind(section);
				}

				var $productImgSlider = section.find('.js-productImgSlider');
				var $productImgSliderNav = section.find('.js-productImgSlider-nav');
				var sliderId = '#' + $productImgSlider.attr('id');
				var activeArrows = $productImgSlider.data('arrows');
				var activeDots = $productImgSlider.data('dots');
				var sliderNavArrows = $productImgSliderNav.find('.js-slide').length > 3;
				var activeSlide = $productImgSlider.find('.is-selected-product').index();

				activeSlide = activeSlide == -1 ? 0 : activeSlide;

				if ( $productImgSlider.find('.js-slide').length > 1 ) {
					$productImgSlider.flickity({
						cellSelector: '.js-slide',
						prevNextButtons: activeArrows,
						arrowShape: 'M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z',
						pageDots: activeDots,
						initialIndex: activeSlide,
						selectedAttraction: 0.08,
						friction: 0.8,
						wrapAround: true,
						adaptiveHeight: true,
						contain: true
					});

					$productImgSlider.on('change.flickity', Site.setBadgePosition);

					$productImgSliderNav.flickity({
						cellSelector: '.js-slide',
						asNavFor: sliderId,
						initialIndex: activeSlide,
						pageDots: false,
						prevNextButtons: sliderNavArrows,
						arrowShape: 'M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z',
						contain: true
					});

					$productImgSliderNav.on('click', 'a', function(e) {
						e.preventDefault();
					});
				}

				Product.setSlidesHeight($productImgSlider);
				$(window).resize(
					Reqs.debounce(function(event){
						Product.setSlidesHeight($productImgSlider)
				}, 250));

			} else {
				return;
			}

		});

		if ( typeof(Currency) != 'undefined' && Currency ){
		    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
		    onCurrencySet();
		}
	}

}
