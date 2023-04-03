import $ from 'jquery';
import { setCarouselState } from '../utils';

function initCollectionCarousel() {
    const $container = $( '.js-collection-grid' );
    const $carousel = $( '.js-collection-slider' );
    const self = this;

    $carousel.find('.will-animate').removeClass('will-animate');

    $('.quickView-button', $carousel).on('click', function() {
        $(this).closest('.slick-slide').addClass('slick-slide--quickView');
    });

    $('html, body').on('quickView:show', function() {
        setQuickViewPosition();
        $carousel.find('.slick-slide--quickView').removeClass('slick-slide--quickView');
    });

    $('html, body').on('quickView:ajax', setQuickViewPosition);

    $container.each(function() {
        setCarouselState( $(this) );
    });

    $(window).on( 'resize', Reqs.debounce(function() {
        setQuickViewPosition();

        $container.each(function() {
            setCarouselState( $(this) );
        });
    }, 250));

    function setQuickViewPosition() {
        let $slide = $carousel.find('.slick-slide--quickView');

        if ( !$slide.length ) {
            $slide = $carousel.find('.quickView--is-visible').closest('.slick-slide');
        }

        if ( $carousel.length && $slide.length ) {
            const $quickView = $slide.find('.quickView-wrap');
            const offsetLeft = $carousel.find('.slick-slide.slick-current').position().left - $slide.position().left;

            $quickView.css('left', offsetLeft);
        }
    }

    const item = '.collectionBlock';
    // Site.scroller( $carousel, item ); Need to import this somewhere...
}

initCollectionCarousel();
