import $ from 'jquery';

export default class ColorSwatches {
    constructor(variant, selector) {
        const $form = $( '#' + selector.domIdPrefix ).closest( 'form' );
		const enableColorSwatches = $form.data( 'color_swatches' );

		if ( enableColorSwatches ) {
			if ( variant ) {
				for ( let i = 0, length = variant.options.length; i < length; i++ ) {
					let radioButton = $form.find( '.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]' );
					if ( radioButton.length ) {
						radioButton.get(0).checked = true;
					}
				}
			}
		}
    }

    static bind($container) {
		$container.find( '.productForm' ).on( 'change', '.swatch :radio', function() {
			const colorTitle = $( this ).val();
			const optionIndex = $( this ).closest( '.swatch' ).attr( 'data-option-index' );
		  	const optionValue = $( this ).val();

		  	$( this )
				.closest( 'form' )
				.find( '.single-option-selector' )
				.eq( optionIndex )
				.val( optionValue )
				.trigger( 'change' );

			$( this ).closest( '.swatch' ).find( '.header__value' ).fadeIn( 300 ).text( colorTitle );

			// Change money format
			if ( typeof(Currency) != 'undefined' && Currency ){
			    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
			    onCurrencySet();
			}
		});

		// Set color title on page load
		$container.find( '.productForm .swatch :radio:checked' ).trigger( 'change' );
		$container.find( '.productForm-block--swatches', $container).removeClass( 'is-loading' );
    }
    
	static unbind($container) {
		$( '.productForm', $container ).off( 'change', '.swatch :radio' );
	}
}
