import $ from 'jquery';

export default class Gitti {
    constructor(options = {}) {
        const defaults = {
            shopifyData: null,
            $body: null,
            $window: null,
            $document: null,
            spinner: null,
        };

        const settings = Object.assign(defaults, options);
        this.shopifyData = settings.shopifyData;
        this.$body = settings.$body;
        this.$window = settings.$window;
        this.$document = settings.$document;
        this.spinner = settings.spinner;
    }

    loadBackgrounds() {

        var $elementsToLoad = $('[data-bg-src]').not('.bg-loading, .bg-loaded');
        const { shopifyData, spinner } = this;
        $elementsToLoad.each(function() {

            var $el = $(this);

            var src = $el.attr('data-bg-src');
            var placeholder = false;

            if(src == '') {
                src = shopifyData.placeholderImage;
                placeholder = true;
            }

            if (spinner) {
                $el.addClass('bg-loading').prepend(spinner);
            }

            var im = new Image();

            $(im).on('load', function() {

                $el.css('background-image', 'url('+src+')').removeClass('bg-loading').addClass('bg-loaded').find('.spinner').fadeOut(300, function() {
                        $(this).remove();
                    });

                if(placeholder) {
                    $el.addClass('bg-placeholder');
                }

                // ensures image is visible in quickView when as it's opened
                if ($('.quickView').length){
                    $('.quickView').find('.quickView-img-inner').addClass('quickView-variant-img--is-active');
                }

            });

            $(im).on('error', function() {
                $el.css('background-image', `url(${shopifyData.placeholderImage})`)
                    .removeClass('bg-loading').addClass('bg-placeholder bg-loaded').find('.spinner').fadeOut(300, function() {
                        $(this).remove();
                    });
            });

            im.src = src;

            if(im.complete) {
                $(im).trigger('load');
            }

        })
    
    }
}
