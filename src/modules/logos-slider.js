import $ from 'jquery';

function initLogoSlider() {
    const $slider = $('.js-logos-slider');
    const options = {
        'infinite': true,
        'autoplay': false,
        'speed': 300,
        'slidesToShow': 8,
        'centerPadding': '80px',
        'arrows': true,
        'dots': false,
        'responsive': [
            {
              'breakpoint': 1440,
              'settings': {
                'centerPadding': '40px',
                'slidesToShow': 6
              }
            },
            {
              'breakpoint': 1024,
              'settings': {
                'centerPadding': '30px',
                'slidesToShow': 5
              }
            },
            {
              'breakpoint': 992,
              'settings': {
                'centerPadding': '25px',
                'slidesToShow': 4
              }
            },
            {
              'breakpoint': 768,
              'settings': {
                'centerPadding': '20px',
                'slidesToShow': 3
              }
            },
            {
              'breakpoint': 640,
              'settings': {
                'centerPadding': '15px',
                'slidesToShow': 2
              }
            },
            {
              'breakpoint': 375,
              'settings': {
                'centerPadding': '10px',
                'slidesToShow': 1
              }
            }
        ]
    };

    if($slider.length > 0) {
        import(/* webpackChunkName: "slick-slider" */ 'slick-slider').then(() => {
            $slider.each(function() {
                $( this ).slick( options );
            });
        });
    }
}

initLogoSlider();
