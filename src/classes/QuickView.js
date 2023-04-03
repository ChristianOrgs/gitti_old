import $ from 'jquery';
import ColorSwatches from './ColorSwatches';
import Gitti from './Gitti';

export default class QuickView extends Gitti {
    constructor(options) {
        super(options);
        this.collectionBlocks = $('.js-collectionBlock');
        this.isQuickViewLoading = false;

        const enableColorSwatches = $('.js-collectionGrid').data('color_swatches');
        const enableReviews = $('.js-collectionGrid').data('show_reviews');
        const showQuantity = $('.js-collectionGrid').data('show_quantity');

        $('.js-collectionGrid').on('click', '.js-quickView', function(e){
            e.preventDefault();

            var isCloseBtn = $(this).hasClass('quickView-close');

            if (isCloseBtn) {
                QuickView.hide();
            } else {
                if (!isQuickViewLoading) {
                        isQuickViewLoading = true;

                    var $this = $(this), // the .js-quickView button
                        product_handle = $this.attr('data-handle'), // [data-handle="{{product.handle}}"] on the .js-quickView button
                        $collectionBlock = $this.closest('.js-collectionBlock'); // the .collectionBlock that contains the product js-quickView

                    // if loaded and visible
                    if ($collectionBlock.hasClass('is-loaded') && $collectionBlock.hasClass('quickView--is-visible')) {
                        QuickView.hide();
                    }

                    // if loaded but not visible, no other quickViews open
                    else if ($collectionBlock.hasClass('is-loaded') && !$collectionBlock.hasClass('quickView--is-visible') && !$('.quickView--is-visible').length) {
                        QuickView.show($collectionBlock);
                        ColorSwatches.bind($collectionBlock);
                    }

                    // if loaded and not visible, other quickViews are open
                    else if ($collectionBlock.hasClass('is-loaded') && !$collectionBlock.hasClass('quickView--is-visible') && $('.quickView--is-visible').length) {
                        QuickView.hide();
                        setTimeout(function(){
                            QuickView.show($collectionBlock);
                        }, 100);
                    }

                    // if not loaded yet, other quickViews open
                    else if ($('.quickView--is-visible').length) {
                        QuickView.hide();
                        setTimeout(function(){
                            QuickView.ajax($collectionBlock, product_handle);
                        }, 100);
                    }

                    // if not loaded yet, no other quickViews open
                    else {
                        QuickView.hide();
                        QuickView.ajax($collectionBlock, product_handle);
                    }
                }
            }
        });
    }

    static show(el) {
        var $el = el,
            sub = ($(window).height() - 600)/2,
            offset = el.children('.quickView').offset().top,
            scroll = offset - sub;

        $el.addClass('quickView--is-active');

        $('html, body').animate({scrollTop: scroll}, function(){
            if ($el.hasClass('is-loaded')) {
                $el.addClass('quickView--is-visible');
            } else {
                $el.addClass('quickView--is-visible is-loaded');

                if (enableColorSwatches) {
                    ColorSwatches.bind(el);
                }
            }
            // $el.find('.single-option-selector').eq(0).change();
            isQuickViewLoading = false;

            if ( typeof(Currency) != 'undefined' && Currency ){
                Currency.convertAll(shopCurrency, $('[name=currencies]').val());
                onCurrencySet();
            }
        });

        $('html, body').trigger('quickView:show');
    }

    static hide() {
        const $collectionBlocks = $('.js-collectionBlock');
        if ($collectionBlocks.hasClass('quickView--is-visible')) {
            $collectionBlocks.removeClass('quickView--is-visible quickView--is-active');
            $('html, body').trigger('quickView:hide');
            this.isQuickViewLoading = false;

            if (this.enableColorSwatches) {
                ColorSwatches.unbind($collectionBlocks);
            }
        }
    }

    ajax(el, handle){
        var $collectionBlock = el,
            product_handle = handle,
            reviews = '',
            swatches = '',
            colors = '',
            productBlockSwatchesClass = '',
            quantitySelect = '';
        const { shopifyData, loadBackgrounds } = this;

        $.getJSON(
            '/products/'+product_handle+'.js',

            function(product) {
                var id = product.id, // int
                    title = product.title, // string
                    url = product.url, // string
                    options = product.options, // array
                    variants = product.variants, // array
                    product_images = $('.quickview-product-images[data-handle="' + handle + '"]').html(); // array of strings
                    price = product.price,
                    compare_at_price = product.compare_at_price,
                    compare_at_price_formatted = Shopify.formatMoney(compare_at_price),
                    price_formatted = Shopify.formatMoney(price); // string

                self.ajaxed = true; // set ajaxed variable to true, means that ajax has occurred

                /*
                 * Adding the variant dropdown. This contains ALL variants.
                 * option_selection.js then hooks in, hides this dropdown, and generates
                 * however many dropdowns there are (1, 2, or 3)
                 *
                 * Basic template for this at https://docs.shopify.com/support/your-website/themes/can-i-make-my-theme-use-products-with-multiple-options
                 */
                var variant_avail = false,
                    first_avail_variant = '';

                var dropdowns = ''; // declare option dropdowns variable
                // loop over product.options
                for ( i = 0; i < options.length; i++ ) {
                    dropdowns += '<select class="js-product-select" id="quickview-product-'+[product['id']]+'-select" name="id">'; // I need a separate id bc each product has a quickView -> has a select
                    // loop over product.variants
                    for(i = 0; i < variants.length; i++){
                        if (variants[i]['available'] == true && variant_avail == false){
                            selected = 'selected';
                            variant_avail = true;
                            first_avail_variant = variants[i]['id'];
                        } else {
                            selected = '';
                        }
                        dropdowns += '<option value="' + variants[i]['id'] + '"' + selected + '>' + variants[i]['title'] + '</option>';
                    }
                    dropdowns += '</select>';
                }

                var pricing = '';
                if ( compare_at_price > price ) {
                    pricing += '<div class="sale">';
                    pricing += '<strike class="product-compare-price">'+compare_at_price_formatted+'</strike>&nbsp;';
                    pricing += '<span class="product-sale-price">'+price_formatted+'</span>';
                    pricing += '</div>';
                } else {
                    pricing += '<div class="product-normal-price">'+price_formatted+'</div>';
                }

                if ( enableColorSwatches ) {
                    productBlockSwatchesClass = 'productForm-block--swatches';
                    swatches = $collectionBlock.find( '.swatches-fake' ).html();

                    // remove fake div after duplicate its html
                    $collectionBlock.find( '.swatches-fake input' ).remove();
                }

                if ( enableReviews ) {
                    reviews = $collectionBlock.find( '.reviews-fake' ).html();

                    // remove fake div after duplicate its html
                    $collectionBlock.find( '.reviews-fake' ).remove();
                }

                if ( showQuantity ) {
                    quantitySelect = '<div class="productForm-select"><label for="quantity">' + `${shopifyData.products.form.qty}` + '</label><select name="quantity" id="quantity">';
                    for ( var i = 1; i <= 9; i++ ) {
                      quantitySelect += '<option value="' + i + '">' + i + '</option>';
                    }
                    quantitySelect += '</select><span class="selectArrow"></span></div>'
                }

                // append data to .js-collectionBlock
                $collectionBlock.append(
                    '<div class="quickView">' +
                        '<div class="quickView-wrap">' +
                            '<div class="container">' +
                                '<div class="row inline">' +
                                    '<div class="quickView-img block s12 xl_s12">' +
                                        product_images +
                                    '</div>' +
                                    '<div class="quickView-info block s12 xl_s12">' +
                                        '<div class="icon-close quickView-close js-quickView"></div>' +
                                        '<form class="productForm" action="/cart/add" method="post" data-color_swatches="' + enableColorSwatches + '" data-product_id="' + id + '">' +
                                            '<h1><a class="js-productUrl" href="' + url + '">' + title + '</a></h1>' +
                                            '<span class="product-price" data-price="' + price + '">' +
                                                pricing +
                                            '</span>' +
                                            reviews +
                                            '<div class="productForm-block ' + productBlockSwatchesClass + '">' +
                                                dropdowns +
                                                swatches +
                                            '</div>' +
                                            '<div class="productForm-block">' +
                                                quantitySelect +
                                                '<div><button class="js-productForm-submit productForm-submit" type="submit" name="checkout" data-handle="' + product_handle + '">' + `${shopifyData.products.form.submit}` + '</button></div>' +
                                            '</div>' +
                                        '</form>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                ); // end append

                // hook into option_selection.js remotely
                QuickView.selectOptions($collectionBlock, product);

                loadBackgrounds();

                $('html, body').trigger('quickView:ajax');

            } // end function(product){}
        ); // end $.getJSON
    }

    /*
     * Hook into Shopify's option_select.js remotely
     * @param el = closest .js-collectionBlock
     */
    selectOptions(el, obj){
        var select = 'quickview-product-'+obj['id']+'-select',
            current_product = 'product_'+obj['id'];
        const { shopifyData } = this;

        //Initialize the product array
        var product_obj = [];

        el.closest('.js-collectionGrid').find('.product-json').each(function() {
            var data = JSON.parse($(this).html());
            var id = data.id;
            var key = 'product_'+id;
            product_obj[key] = data;
        });

        /*
         * OptionsSelectors instantiates the chain of functions within option_selection.js that builds the options selectors.
         * Docs here: https://docs.shopify.com/support/your-website/themes/can-i-make-my-theme-use-products-with-multiple-options
         */
        new Shopify.OptionSelectors(select, {
            product: product_obj[current_product], // this is the {{product | json}} from the front-end
            onVariantSelected: selectCallback
        });

        function selectCallback(variant, selector) {
            callback({
                money_format: shopifyData.shop.money_format,
                variant: variant,
                selector: selector
            });

            var enableColorSwatches = el.closest('.js-collectionGrid').data('color_swatches');
            if (enableColorSwatches) {
                ColorSwatches.init(variant, selector);
            }

        }

        function callback(options){
            var moneyFormat = options.money_format,
                variant = options.variant,
                selector = options.selector;

            var $submit = el.find('.js-productForm-submit'),
                $price = el.find('.product-price'),
                $normal_price = el.find('.product-normal-price'),
                $sale_price = el.find('.product-sale-price'),
                $compare_price = el.find('.product-compare-price'),
                $counter = el.find('.js-counter').not('.cart-product-quantity .js-counter'),
                $sale_container = $price.find('.sale');

            if (variant) {
                if (variant.available) {
                    $submit.removeClass('is-disabled').prop('disabled', false).html(shopifyData.products.form.submit);
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
                        $submit.attr( 'disabled', false );
                    } else {
                        $sale_container.hide();
                        $normal_price.show();
                    }
                }
                // this variant sold out
                else {
                    $submit.addClass('is-disabled').prop('disabled', true).html(shopifyData.products.form.sold_out);
                    $counter.css({'opacity': 0.3, 'pointer-events': 'none'});
                    $price.css({'opacity': 0.3});
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
                }

                // this will swap images in the quickView
                Product.showVariantImage(variant, el);
            } else {
                $submit.addClass('is-disabled').prop('disabled', true).html(shopifyData.products.labels.unavailable);
                $counter.css({'opacity': .3, 'pointer-events': 'none'});
                $price.css({'opacity': 0.3});
            }
        }

        /*
         * option_selection.js doesn't add a label if there's only one option,
         * so this logic:
         * * adds a label (and arrow) if there's only one option and multiple variants
         * * prepends the arrow if there are more than one option (this is a normal successful call to option_selection.js)
         * * hides the select element and wrapper if there is only one variant
         */

        if (obj['options'].length === 1 && obj['variants'].length){
            if (obj['variants'][0].title === 'Default Title') {
                for (i = 0; i < obj['options'].length; i++) {
                    $('#'+select+'-option-'+[i]).closest('.productForm-block').hide();
                }
            } else {
                for (i = 0; i < obj['options'].length; i++) {
                    $('#'+select+'-option-'+[i]).closest('.selector-wrapper').attr('data-id', 'product-select-option-'+[i]).prepend('<span class="selectArrow"></span><label>'+obj['options'][0]['name']+'</label>');
                }
            }
        } else if (obj['options'].length > 1){
            for (i = 0; i < obj['options'].length; i++) {
                $('#'+select+'-option-'+[i]).closest('.selector-wrapper').attr('data-id', 'product-select-option-'+[i]).prepend('<span class="selectArrow"></span>');
            }
        }

        QuickView.show(el)
    } // end selectOptions
}
