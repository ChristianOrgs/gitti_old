import $ from 'jquery';

export default class InfoPopup {
    constructor() {
        // hide
        $('#info-popup .icon-close').on('click', function(e){
            e.preventDefault();
            InfoPopup.hide();
        })
        $('#info-popup-open').on('click', function(e){
            e.preventDefault();
            InfoPopup.show();
        })
        $('#info-popup').appendTo("body");
    }
    
    static show(){
        $('#info-popup').addClass('active');
        $('#notify-overlay').addClass('active');
    }

    static hide(){
        $('#info-popup').removeClass('active');
        $('#notify-overlay').removeClass('active');
    }
}
