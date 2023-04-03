import $ from 'jquery';
import Reqs from '../classes/Reqs';
import { setSlidesHeight } from '../utils';

function initGallerySlider() {
    const self = this;
    const $slider = $('.js-slider');
    let options = {};

    $slider.each( function () {
        const $currentSlider = $(this);
        options = JSON.parse( $( this ).data( 'slick' ).replace(/'/g, '"') );

        import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then(() => {
            $currentSlider.on('init', function() {
                $(this).removeClass('gallery-slider--is-loading');
            });

            if ( $currentSlider.data('image-height') == 'original-height' ){
                setSlidesHeight( $currentSlider );
                $(window).resize(
                    Reqs.debounce(function(event){
                        setSlidesHeight( $currentSlider );
                }, 250));
            }

            $currentSlider.slick( options );

            // Pause slider if it's outside the viewport to prevent elements shaking
            $(window).on( 'scroll',
                Reqs.debounce( function(event) {
                    var isSliderVisible = isAnyPartOfElementInViewport($currentSlider.get( 0 ));

                    if ( isSliderVisible ) {
                        $currentSlider.slick( 'slickPlay' );
                    } else {
                        $currentSlider.slick( 'slickPause' );
                    }
                }, 150)
            );
        });
    });

    function isAnyPartOfElementInViewport(el) {

        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        return (vertInView && horInView);
    }
}

initGallerySlider();
