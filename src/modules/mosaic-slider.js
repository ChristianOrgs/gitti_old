import $ from 'jquery';
import { initMobileSlider } from '../utils';
import Reqs from '../classes/Reqs';

const $slider = $('.js-mosaic__blocks');

$slider.each( function() {
    const $currentSlider = $(this);

    initMobileSlider($currentSlider);
    $(window).resize(
        Reqs.debounce( function(event) {
        initMobileSlider($currentSlider);
    }, 250));
});

if ( typeof(Currency) != 'undefined' && Currency ){
    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
    onCurrencySet();
}
