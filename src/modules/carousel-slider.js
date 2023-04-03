import $ from 'jquery';

function initCarouselSlider() {
    const $carousel = $( '.js-carousel-slider' );
    
    if($carousel.length === 0) return false;
    
    const flickity = $carousel.data( 'flickity' );
    
    if (flickity == undefined) {
        import(/* webpackChunkName: "flickity" */ 'flickity').then(() => {
            $carousel.flickity({
                cellSelector: '.js-slide',
                cellAlign: 'center',
                watchCSS: true,
                prevNextButtons: false,
                pageDots: false
            });
        });
    }
}

initCarouselSlider();
