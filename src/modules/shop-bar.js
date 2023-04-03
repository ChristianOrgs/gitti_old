import $ from 'jquery';

var product = JSON.parse(document.getElementById( 'product-json' ).innerHTML);

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
