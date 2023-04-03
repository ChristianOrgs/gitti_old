import $ from 'jquery';
import FeaturedProduct from './FeaturedProduct';


export default class QuickViewPopover {
    constructor() {
        $('.js-quickViewPopover').on('click', function(e){
            if ($(e.target).hasClass('js-productForm-submit') || $(e.target).hasClass('js-notify-popup') || $(window).width() > 768) {
                return;
            }
            e.preventDefault();

            var productJSONEL	= $(this).find( ".product-json" )
            var product = JSON.parse(productJSONEL.html())

            $('.js-quickViewPopover-container', this).clone().appendTo('#QuickviewPopoverCont .inner');
            $('#QuickviewPopoverCont .inner .js-quickViewPopover-container').show();
            $('#QuickviewPopoverCont').addClass('quickView--is-visible quickView--is-active');
            $('#QuickviewPopoverCont .inner .js-quickViewPopover-container').removeClass('fp-initialized')
            new FeaturedProduct();
            // $('body').css({'overflow': 'hidden'});
        });
        // hide
        $('#QuickviewPopoverCont .quickView-close').on('click', (e) => {
                e.preventDefault();
                this.hide();
        });
    }

    static hide() {
        $('#QuickviewPopoverCont').removeClass('quickView--is-visible quickView--is-active');
        $('#QuickviewPopoverCont .inner').html('');
        // $('body').css({'overflow': 'visible'});
    }
}
