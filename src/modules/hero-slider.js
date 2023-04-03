import $ from 'jquery';
import Reqs from '../classes/Reqs';
import { setSlidesHeight } from '../utils';

function initHeroSlider() {
    const $hero = $( '.js-hero-slider' );
    const $scrollDownBtn = $('.js-scroll-down');
    let options = {};
    
    if ($hero.length === 0) return false;
    
    import(/* webpackChunkName: "modernizr" */ '../vendor/modernizr').then(() => {
        if ( !Modernizr.cssvhunit || !Modernizr.cssvmaxunit ) $hero.css( 'height', $(window).height() );
    });
    
    import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then((mod) => {
        $hero.each( function () {
            const $currentHero = $(this);
            options = JSON.parse( $currentHero.data( 'slick' ).replace(/'/g, '"') );
    
            $currentHero.on('init', function() {
                const currentStyle = $(this).find('.js-slide[data-slick-index="1"]').data('style');
                $(this).attr('data-current-style', currentStyle);
                $(this).removeClass('hero--is-loading');
    
                // Resizes background image without stretching it
                if ( $currentHero.data('image-height') == 'original-height' ){
                    setSlidesHeight($currentHero);
                }
            });
    
            $currentHero.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                var activeSlide = parseInt(nextSlide + 1);
                var currentStyle = $(this).find('.js-slide[data-slick-index="' + activeSlide +'"]').data('style');
                $(this).attr('data-current-style', currentStyle);
            });
    
            $currentHero.slick( options );
    
            $(window).resize(
                Reqs.debounce(function(event){
                    setSlidesHeight( $currentHero );
            }, 250));
        } );
    
        $('.slick-list').attr('tabindex','-1');
    
        $scrollDownBtn.on('click', function(e) {
            e.preventDefault();
    
            var isStandardNav = $(window).width() >= 768 && $('.site-header').hasClass('is-standard');
            var headerHeight = isStandardNav ? 59 : -1;
            var scrollToPosition = parseInt($hero.offset().top + $hero.outerHeight() - headerHeight);
            $('html, body').stop(true, false).animate({ 'scrollTop': scrollToPosition }, 500);
        });
    });
};

initHeroSlider();
