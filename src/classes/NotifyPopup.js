import $ from 'jquery';

export default class NotifyPopup {
    constructor() {			
        NotifyPopup.init();

        $(document).on('ajaxify:updated', function(){
            NotifyPopup.init();
        })
    }

    static init() {
        $('#notify-popup .icon-close').on('click', function(e){
            e.preventDefault();
            NotifyPopup.hide();
        })

        $('.js-notify-popup').on('click',function(e){
            e.preventDefault();
            var prodID = e.target.dataset.id;
            var variantID = e.target.dataset.variant;
            if(prodID !== undefined && variantID !== undefined){
                var template = `setMailSubscribe(${prodID},${variantID})`;
                $('#notify-popup form .js-signUp-form .inputGroup #notify_me_submit').attr('onclick',template);
                NotifyPopup.show();
            }
        });
        $('#notify-popup form .js-signUp-form .inputGroup .signUp-submit').on('click', function(e){
            NotifyPopup.hide();
        });
    }

    static show() {
        $('#notify-popup').addClass('active');
        $('#notify-overlay').addClass('active');
    }

    static hide() {
        $('#notify-popup').removeClass('active');
        $('#notify-overlay').removeClass('active');
    }
}
