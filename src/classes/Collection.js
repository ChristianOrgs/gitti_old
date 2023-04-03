import $ from 'jquery';
import '../vendor/ajaxify';
import Reqs from './Reqs';
import Gitti from './Gitti';
import { setBadgePosition } from '../utils';

export default class Collection extends Gitti {
    constructor(options) {
        super(options);
        var tagFilter = document.getElementById( 'tagFilter' ) || false;
        var collectionFilter = document.getElementById( 'collectionFilter' ) || false;

        if( tagFilter ) {
            tagFilter.addEventListener( 'change', function() {
                document.location.href = this.options[ this.selectedIndex ].value;
            });
        }

        if( collectionFilter ) {
            collectionFilter.addEventListener( 'change', function() {
                document.location.href = '?sort_by=' + this.options[ this.selectedIndex ].value;
            } );
        }

        ajaxify();

        this.$window
				.on('load', () => {
					setBadgePosition();
				})
				.on('resize', Reqs.debounce(() => {
					setBadgePosition();
				}, 250));

		this.$document.on('ajaxify:updated', () => {
				setBadgePosition();
				if ( typeof(Currency) != 'undefined' && Currency ){
				    Currency.convertAll(shopCurrency, $('[name=currencies]').val());
				    onCurrencySet();
				}
			});
    }

    /**
     * Sort collection using the dropdown
     */
    initSort(){
        var	url = window.location.href,
            url_split = url.split('?sort_by='),
            active_filter = url_split[1],

            $selector = $('#collectionFilter'),
            $selected = $selector.find('option[value="'+active_filter+'"]');

        $selected.attr('selected', true);

        $selector.on('click', function() {
            if($selector.hasClass('loading')) {
                event.preventDefault();
            }
        });

        $selector.bind('change', function(event) {
            $selector.addClass('loading');
            $('body').addClass('ajax-sorting');

            var delay = Modernizr.csstransitions ? 200 : 0;

            setTimeout(function() {
                var filter = $selector.val();
                var url = window.location.href;
                var urlBase = url.split('?sort_by=')[0];

                var filterUrl = (filter === '') ? urlBase : urlBase+'?sort_by='+filter;

                if(Modernizr.history) {
                    history.replaceState({}, $('title').text(), filterUrl);
                    this.ajaxSort(filterUrl);
                } else {
                    window.location = filterUrl;
                }
            }.bind(this), delay);
        }.bind(this));
    }

    ajaxSort(url) {
        const { loadBackgrounds } = this;
        var $loadMoreIcon = $('.collectionGrid-load.load-more-icon');

        $loadMoreIcon.show();
        $('.js-collectionGrid').hide().next('.row').hide();

        $.ajax({
            type: 'GET',
            dataType: "html",
            url: url,
            success: function(data) {
                var products = $(data).find('.js-collectionGrid')[0].outerHTML;
                var nextPage = $(data).find('.js-collectionGrid').next('.row')[0] ? $(data).find('.js-collectionGrid').next('.row')[0].outerHTML : '';

                $('.js-collectionGrid').replaceWith(products);
                $('.js-collectionGrid').next('.row').replaceWith(nextPage);
                $loadMoreIcon.hide();

                $('#collectionFilter').removeClass('loading');
                $('body').removeClass('ajax-sorting');

                loadBackgrounds();
            }
        });
    }

    /*
    * AJAX call to load more products
    */
    initLoadMore() {
        $('body').on('click', '.js-loadMore:not(.loading)', function(event) {

            // hide open quickViews
            QuickView.hide();

            var $el = $(event.target);
            var url = $el.attr('href');

            event.preventDefault();

            $el.addClass('loading');

            // load products
            this.ajaxLoadMore(url);

        }.bind(this));
    }

    ajaxLoadMore(url) {
        const { loadBackgrounds } = this;
        $.ajax({
            type: 'GET',
            dataType: "html",
            url: url,
            success: function(data) {
                var products = $(data).find('.js-collectionGrid').html();
                var nextPage = $(data).find('.js-loadMore').attr('href');

                $('.js-collectionGrid').find('.gridSpacer').remove();

                $(products).appendTo('.js-collectionGrid');

                if ( typeof(nextPage) !== 'undefined' ){
                    $('.js-loadMore').attr('href', nextPage).removeClass('loading');
                } else {
                    $('.js-loadMore').remove();
                }

                loadBackgrounds();
                collectionBlocks = $('.js-collectionBlock');
            }
        });
    }
	
}
