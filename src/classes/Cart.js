import $ from 'jquery';
import Handlebars from 'handlebars';
import Gitti from './Gitti';
import QuickViewPopover from './QuickViewPopover';
import PopoverPopup from './PopoverPopup';
import { getCookie, setCookie } from '../utils';

export default class Cart extends Gitti {
    constructor(options) {
		super(options);
		const $cart = Cart.selectCart();
		const { $body } = this;
		this.counter();
		this.popover = this.initPopover();
		
        $('.js-cartToggle').on('click', function(e){
            var $this = $(this);

            e.preventDefault();
			var bodyWidth = $( 'body' ).width();

			$body.toggleClass('cart--is-visible');
			if ($body.hasClass('cart--is-visible')) {
				$body.css('width', bodyWidth);
				$cart.removeClass('close');
				$cart.addClass('open');
				$('#cartTotal').attr('aria-expanded', true);
			} else {
				$cart.removeClass('open');
				$cart.addClass('close');
				$('#cartTotal').attr('aria-expanded', false);
				$body.css('width', 'auto');
			}
			$('.js-continueShopping').attr('tabindex','0');
		});

		// START Discount App | info@shop-fabrik.net
		var discount_cookie = getCookie("discount_code")
		if(discount_cookie){
			Cart.getDiscountValues(discount_cookie)
		}

		$cart.on('click', '.sf-discount-button', function(){
			var discount = $('#sf-discount-input').val()
			if(discount){
				setCookie('discount_code', discount, 365)
				Cart.getDiscountValues(discount)
			}
		})

		$(document).on("updateCartTotal", function(e){
			var discount_cookie = getCookie("discount_code")
			if(discount_cookie){
				Cart.getDiscountValues(discount_cookie)
			}
		});

		// END Discount App | info@shop-fabrik.net
		
		this.bindUI();
		
		this.$cart = $cart;
	}

	static selectCart() {
		return $('#Cart');
	}

	static getDiscountValues(discount, customerId){
		return $.getJSON('/cart.js').then(function (cart) {
			return $.ajax({
			  url: '/apps/discounts',
			  method: 'POST',
			  crossDomain: true,
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify({
				customerId: customerId,
				cart: cart,
				code: discount
			  }),
			}).done(function (response) {
			  if (response.valid) {
				response.code = discount
				$('#Cart .sf-discount-error').hide()
				$('#Cart .total span').eq(1).text(Shopify.formatMoney(response.subtotal))
				$('#Cart .sf-discount-value').text(Shopify.formatMoney(response.discount))
				$('#Cart .sf-discount-name').text(discount)
				$('#Cart .sf-discount').show()
				$.get('/discount/' + encodeURIComponent(discount)).then(function(){
					setCookie('discount_code', discount, 1)
				})
				return response
			  } else {
				$('#Cart .sf-discount').hide()
				$('#Cart .sf-discount-error').text(response.case.message)
				$('#Cart .total span').eq(1).text($('#Cart .total span').eq(1).data('total'))
				$('#Cart .sf-discount-error').show()
			  }
			  return false
			}).fail(function (error) {
			  console.log(error)
			  return false
			});
		});
	}

	bindUI() {
		this.$body.on('click', '.js-productForm-submit', (e) => {
			e.preventDefault();
			const $currentTarget = $(e.currentTarget);
            const $form = $currentTarget.closest('form.productForm');
            if ($form.find('[type="file"]').length) return;

            this.submit($currentTarget);
		});
		
		$('.js-continueShopping').on('click', function(e){
			e.preventDefault();
			$('.js-cartToggle').trigger('click');
		});
	}

		/**
		*
		* Show cart directly withou all other popops before
		*/
		static showCart(){
			QuickViewPopover.hide();
			PopoverPopup.hide();
			if(!$('#Cart').hasClass('open')){
				$('.js-cartToggle').trigger('click');
			}
		}

	submit(el) {
		var $form = el.closest('form.productForm'),
			buttonHTML = el.html(),
			product_handle = el.attr("data-handle"),
			product_id = el.attr("data-id"),
			variant_id = $form.find('select[name="id"] option:selected').attr('value'),
			quantity = $form.find('.inputCounter').prop('value') || $form.find('#quantity').prop('value'),
			noPopup = el.hasClass('js-no-popup'),
			preventDouble = true;
		const form_array = $form.serializeArray();
		
		const { shopifyData, buildCart } = this;

		var form_data = {};

		$.map(form_array, function(val, i){
			form_data[val.name] = val.value;
		});

		// validate infinity options (Set Product APP)
		if(window.validate_MDSETsoptions && window.validate_MDSETsoptions(product_id) === false){
			console.log("OPTION not valid")
			return false;
		} else {
			console.log("OPTION is valid")
		}

		$.ajax({
			method: 'POST',
			url: '/cart/add.js',
			dataType: 'json',
			data: form_data,
			success: (product) => {
				el.html(shopifyData.products.form.success);
				setTimeout(function(){
					el.html(buttonHTML);
				}, 1000);

				Cart.getCart(buildCart.bind(this));

				if(noPopup){
					Cart.showCart();
				} else {
					PopoverPopup.show()
				}
			},
			// If there are no products in the inventory
			error: (data) => {
				const { shopifyData } = this;
				$.ajax({
					method: 'GET',
					url: '/products/'+product_handle+'.js',
					dataType: 'json',
					success: function(product){
						var variants = product.variants,
								// variants is an array [0{},1{},2{}...]
								variant = $.each(variants, function(i, val){
									// val returns the contents of 0,1,2
									if (val.id == variant_id) {
										return variant_quantity = val.inventory_quantity; // set variant_quantity variable
									}
								}),
								$popover = $('#CartPopoverCont'), // same popover container used to show succesful cart/add.js
								error_details = shopifyData.products.form.submit_error_details, // translation string
								tag = new RegExp('\[\[i\]\]'), // checks for [[i]]
								error = error_details; // set error to just default to error_details

						if (tag.test(error_details) == true){
							// [[i]] is part of the trans string, this can be whatever,
							// but in the tutorial we use [[i]] so leave it
							error = error_details.replace('[[i]]', variant_quantity); // re-set error with new string
						}

						el.html(shopifyData.products.form.submit_error); // swap button text
						setTimeout(function(){
							el.html(buttonHTML); // swap it back
						}, 1000);

						// clear popover timer, set at top of Cart object
						clearTimeout(popoverTimer);

						// empty popover, add error (with inventory), show it, remove click events so it doesn't open cart
						$popover.empty().append('<div class="popover-error">'+error+'</div>').addClass('is-visible').css({'pointer-events': 'none'});
						// set new instance of popoverTimer
						popoverTimer = setTimeout(function(){
							$popover.removeClass('is-visible').css({'pointer-events': 'auto'});
						}, 5000);
					},
					error: function(){
						console.log("Error: product is out of stock. If you're seeing this, Cart.submit.error() must have failed.");
					}
				});
			}
		});
	}

	initPopover() {
		return {
			show: function(product) {
				var $popover = $('#CartPopoverCont'),
					item = {},
					source = $('#CartPopover').html(),
					template = Handlebars.compile(source);

				item = {
					item_count: product.quantity,
					img: product.image,
					name: function(){
						name = product.product_title;

						if (name.length > 20){
							name = name.substring(0, 20) + ' ...';
						}

						return name;
					},
					variation: product.variant_title == 'Default Title' ? false : product.variant_title,
					price: product.price,
					price_formatted: Shopify.formatMoney(product.price)
				}

				$popover.empty().append(template(item));

				// clear popover timer, set at top of Cart object
				clearTimeout(popoverTimer);

				$popover.addClass('is-visible');

				this.loadBackgrounds();

				// set new instace of popoverTimer
				popoverTimer = setTimeout(function(){
					Cart.popover.hide($popover);
				}, 5000);
			},
			hide: function(el){
				el.removeClass('is-visible');
				setTimeout(function(){
					el.empty();
				}, 300);
			}
		}
	}

	static getCart(callback) {
		$.getJSON('/cart.js', function (cart, textStatus) {
		if ((typeof callback) === 'function') {
			callback(cart);
		}
		else {
			// ShopifyAPI.onCartUpdate(cart);
		}
		});
	}

	buildCart (cart) {
		const { $cart, shopifyData } = this;
		// Start with a fresh cart div
		$cart.empty();

		// Show empty cart
		if (cart.item_count === 0) {
			$cart.append('<p>' + shopifyData.cart.labels.empty_cart + '</p>');
			return;
		}

		// Handlebars.js cart layout
		var items = [],
			item = {},
			data = {},
			source = $("#CartTemplate").html(),
			template = Handlebars.compile(source);

		// Add each item to our handlebars.js data
		$.each(cart.items, function(index, cartItem) {
			var itemAdd = cartItem.quantity + 1,
				itemMinus = cartItem.quantity - 1,
				itemQty = cartItem.quantity,
				itemVariantId = cartItem.variant_id;

			/* Hack to get product image thumbnail
			*   - If image is not null
			*     - Remove file extension, add _small, and re-add extension
			*     - Create server relative link
			*   - A hard-coded url of no-image
			*/

			if (cartItem.image != null){
				var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
			} else {
				var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
			}

			var prodName = cartItem.product_title,
				prodVariation = cartItem.variant_title;

			if (prodVariation == 'Default Title') {
				prodVariation = false;
			}

			var isPropertiesAnObject = Object.prototype.toString.call(cartItem.properties) === '[object Object]';
			
			var properties = isPropertiesAnObject ? Object.fromEntries(Object.entries(cartItem.properties).filter((property) => {
				const [key, value] = property;
				return key.indexOf('_') !== 0;
			})) : cartItem.properties;
			
			// Create item's data object and add to 'items' array
			item = {
				id: cartItem.variant_id,
				url: cartItem.url,
				img: prodImg,
				name: prodName,
				variation: prodVariation,
				itemAdd: itemAdd,
				itemMinus: itemMinus,
				itemQty: itemQty,
				itemVariantId: itemVariantId,
				properties: properties,
				price: cartItem.price,
				price_formatted: Shopify.formatMoney(cartItem.price),
				line_price_formatted: Shopify.formatMoney(cartItem.line_price),
				vendor: cartItem.vendor
			};

			items.push(item);
		});

		var untilFreeShipping = 0;
		var initWidth = "width:100%";
		var progressBarStyleString = "";
		var progressBarPaidStyleString = "";
		var progressBarFreeStyleString = "";
		var progressEnabled = shopifyData.settings.enable_progressBar;

		if(progressEnabled == true){
			if( cart.total_price < shopifyData.assigned.threshold ){
				initWidth = "width:"+((100/shopifyData.assigned.threshold)*cart.total_price)+"%";
				untilFreeShipping = (shopifyData.assigned.threshold - cart.total_price);
				progressBarFreeStyleString = "display: none;";
				progressBarPaidStyleString = "display: inline;";
			} else {
				progressBarFreeStyleString = "display: inline;";
				progressBarPaidStyleString = "display: none;";
			}
		} else {
			progressBarStyleString = "display: none !important;"
		}




		// Gather all cart data and add to DOM
		data = {
			item_count: cart.item_count,
			items: items,
			note: cart.note,
			totalPrice: Shopify.formatMoney(cart.total_price),
			threshold: `${shopifyData.assigned.threshold}`,
			textShippingFree: `${ shopifyData.settings.textShippingFree }`,
			textShippingOne: `${ shopifyData.settings.textShippingOne }`,
			textShippingTwo: `${ shopifyData.settings.textShippingTwo }`,
			untilFree: Shopify.formatMoney(untilFreeShipping),
			initialWidth: initWidth,
			progressBarStyle: progressBarStyleString,
			progressBarPaidStyle: progressBarPaidStyleString,
			progressBarFreeStyle: progressBarFreeStyleString
		}

		// update cart slide-out with new cart
		$cart.append(template(data));

		// update cartToggle with new # of items

		$('#CartToggleItemCount').empty().html(cart.item_count);
		$('#CartItemCount').empty().html(cart.item_count);

		this.loadBackgrounds();

		/**
		 * Re-init the ajax cart buttons.
		 * These are added to the handlebars template, but this
		 * js needs to fire to show them after the new
		 * cart is built and inserted.
		 * @see https://help.shopify.com/themes/customization/cart/add-more-checkout-buttons-to-cart-page
		 */
		if (window.Shopify && Shopify.StorefrontExpressButtons) {
			Shopify.StorefrontExpressButtons.initialize();
		}
	}
	/*
		* Form Counter
		*/
	counter(){
		var self = this,
			$cart = $('#Cart');

		$cart.on( 'blur', '.inputCounter', function() {
			var el = $(this),
				value = $(this).val();

			self.inputCounter( el, value );
		});

		$cart.on('click', '.inputCounter-down', function(){
			var el = $(this),
				$input = el.siblings( '.inputCounter' ),
				value = parseInt( $input.val() ) - 1;

			self.inputCounter(el, value);
		}).on('click', '.inputCounter-up', function(){
			var el = $(this),
				$input = el.siblings( '.inputCounter' ),
				value = parseInt( $input.val() ) + 1;

			self.inputCounter(el, value);
		});

		/* Remove line item on x click */
		$cart.on( 'click', '.cart-product-remove', function() {
			var el = $(this);

			self.inputCounter(el, 0);
		});
	}

	// Product/Quick View Product Submit Form
	inputCounter( el, value ) {
		var self = this,
			$cart = $( '#Cart' ),
			$input = el.closest( '.line-item' ).find( '.inputCounter' );

		// Set quantity to 0 and remove the item
		if ( value == 0 ) {
			$input.closest( '.line-item' ).fadeOut( function() {
				$( this ).remove();
			} );

		// Prevent a negative quantity
		} else if (value < 0) {
			value = 0;
		}

		var qty = value;
		var id = $input.attr( 'id' );
		var product_id = id.substring( parseInt( id.indexOf( '_' ) + 1 ) );

		$.ajax( {
			type: 'post',
			url: '/cart/change.js',
			dataType: 'json',
			data: {
				'quantity': qty,
				'id': product_id
			},
			success: function( data ) {
				// Set the updated line item new price
				for ( var i = 0; i < data.items.length; i++ ) {
					var currentItem = data.items[i];
					var $lineItem = $cart.find( '.line-item[data-variant-id="' + currentItem.variant_id + '"]' ).closest( '.line-item' );

					$lineItem.find( '.inputCounter' ).prop( 'value', currentItem.quantity );
					$lineItem.find( '.cart-product-total' ).html( Shopify.formatMoney( currentItem.line_price ) );
				}

				//disable sf-discount
				if(data.items.length === 0){
					document.getElementById('sf-discount').hidden = true
				}

				// Set the new total price
				$cart.find( '.cart-total-price' ).html( Shopify.formatMoney( data.total_price ) );

				// Update cart total
				self.updateCartTotal();
			}
		});

		// remove line item if the quantity is 0
		if ( qty == 0 ) {
			$( this ).closest( '.line-item' ).fadeOut( function() {
				$( this ).remove();
				self.updateCartTotal();
			} );
		}
	}
	updateCartTotal() {
		$.getJSON('/cart.js', function(cart) {
			$( '#CartToggleItemCount, #CartItemCount' ).html( cart.item_count );
			$('#Cart .total span').eq(1).html(Shopify.formatMoney(cart.total_price));
			$('#Cart .total span').eq(1).data('total', Shopify.formatMoney(cart.total_price))

			var threshold = $('#Cart .progressBar ').attr('data-threshold');
			if(cart.total_price <= parseInt(threshold)){
				var barWidth = ((100/threshold)*cart.total_price).toFixed(2);
				var untilFree = threshold - cart.total_price;
				$('#Cart .progressBar .progressBar__text-free').hide();
				$('#Cart .progressBar .progressBar__text-paid').show();
				$('#Cart .vat-hint').show();
				$('#Cart .progressBar .progressBar__text-paid .progressBar__money-left').html(Shopify.formatMoney(untilFree));
				$('#Cart .progressBar__inner').width(barWidth+'%');
			} else {

				$('#Cart .progressBar .progressBar__text-free').show();
				$('#Cart .progressBar .progressBar__text-paid').hide();
				$('#Cart .vat-hint').hide();
				$('#Cart .progressBar .progressBar__text-paid .progressBar__money-left').html(Shopify.formatMoney(untilFree));
				$('#Cart .progressBar__inner').width("100%");
			}
			$(document).trigger("updateCartTotal");
		});
	}
}
