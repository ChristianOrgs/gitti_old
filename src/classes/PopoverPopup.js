import $ from 'jquery';
import Cart from './Cart';
import QuickViewPopover from './QuickViewPopover';

export default class PopoverPopup {
    constructor() {
        // this.QuickViewPopover = Qui  ckViewPopover;
        // hide
        $('#popover-popup .icon-close').on('click', (e) => {
                e.preventDefault();
                PopoverPopup.hide();
        });

        $('#popover-popup .js-go-to-cart').on('click', (e) => {
                e.preventDefault();
                Cart.showCart();
        })
    }

    static show() {
        QuickViewPopover.hide();
        $('#popover-popup').addClass('active');
        $('#popover-overlay').addClass('active');
    }

    static hide() {
        $('#popover-popup').removeClass('active');
        $('#popover-overlay').removeClass('active');
    }
}
