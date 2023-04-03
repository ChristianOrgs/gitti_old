import $ from 'jquery';
import Reqs from './Reqs';

export default class Animations {
    constructor() {
        this.animateAll();
        $(window).on('scroll', Reqs.throttle(this.animateAll, 100));
        $(window).on('load', this.animateAll);
        $(document).on('ajaxify:updated', this.animateAll);
    }

    animateAll() {
        const $animatedElements = $('.will-animate');
        if ($animatedElements.length === 0) return;

        $animatedElements.each(function() {
            const animationClass = 'animated ' + $(this).data('animation');
            
            if ($(this).is(':visible')) { // TODO: improve this as jquery-visible didn't work  properly
                $(this).addClass(animationClass).removeClass('will-animate');
            }
        });
    }
}
