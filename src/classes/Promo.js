import $ from 'jquery';
import Reqs from './Reqs';

export default class Promo {
    constructor() {
        this.$alert = $('.js-siteAlert');
        this.$header = $('.site-header');
        this.$promo_inner = $('.js-siteAlert .block');
        this.$alert = this.$alert.html();
        this.updateHeader();
        $('.header-fix-cont-inner').css('opacity','1');

        $('.js-alert-close').on('click', function(){
            alert.removeClass('no-transition');
            setTimeout(function(){
                Site.promo.hide();
            }, 500);
        });
    }

    updateHeight() {
        const { $promo_inner, $alert } = this;
        const height = $promo_inner.innerHeight();
        $alert.css('height', height);
    }

    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    checkCookie() {
        var user = getCookie("username");
        if (user != "") {
            alert("Welcome again " + user);
        } else {
            user = prompt("Please enter your name:", "");
            if (user != "" && user != null) {
                setCookie("username", user, 365);
            }
        }
    }

    setHeight() {
        const { $alert } = this;
        const $promo_inner = $alert.find('.block');
        const height = $promo_inner.innerHeight();
        $alert.css({'height': height});
    }

    show(){
        this.setHeight();
        this.updateHeader();

        $(window).resize(
            Reqs.throttle(() => {
                this.setHeight();
            }, 500)
        );
    }

    hide(){
        const { $alert } = this;
        const $content = $alert.html();

        $alert.css({'height': 0});
        setTimeout(function(){
            $alert.remove();
        }, 500);
    }

    updateHeader(){
        const { $alert, $header } = this;

        $header.addClass('alert--is-visible');

        $header.addClass('shift--alert');

        $(window).on('scroll', Reqs.throttle(() => {
            const height = $($alert).outerHeight();

            if ($(window).scrollTop() >= height) {
                $header.removeClass('shift--alert');
            } else {
                $header.addClass('shift--alert');
            }
        }, 50));
    }
}
