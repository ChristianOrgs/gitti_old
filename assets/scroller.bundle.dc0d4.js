(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{50:function(t,e,o){"use strict";o.r(e);var i=o(0),r=o.n(i),d=o(5),n=o(4);var c=r()(".product-image").length,s=null;if(c>1){var a=function(){(window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)<1024&&r()(".js-productImgScroller .js-slide").length>1?o.e(33).then(o.t.bind(null,57,7)).then((function(){var t=r()(".js-productImgScroller"),e=r()(".js-productImgScroller-nav"),o=t.data("arrows"),i=t.data("dots"),c=e.find(".js-slide").length>3,a=t.find(".is-selected-product").index();a=-1==a?0:a;var l=r()(".js-productImgScroller").data("flickity"),u=r()(".js-productImgScroller-nav").data("flickity");t.find(".js-slide").length>1&&(null==l&&(s=t.flickity({cellSelector:".js-slide",prevNextButtons:o,arrowShape:"M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z",pageDots:i,initialIndex:a,selectedAttraction:.08,friction:.8,adaptiveHeight:!0,wrapAround:!0,contain:!0})).on("change.flickity",n.d),null==u&&($mobileSliderNav=e.flickity({cellSelector:".js-slide",asNavFor:".js-productImgScroller",initialIndex:a,pageDots:!1,prevNextButtons:c,arrowShape:"M 69.65625 6.96875 A 3.0003 3.0003 0 0 0 67.875 7.875 L 27.875 47.875 A 3.0003 3.0003 0 0 0 27.875 52.09375 L 67.875 92.09375 A 3.0003 3.0003 0 1 0 72.125 87.875 L 34.25 50 L 72.125 12.09375 A 3.0003 3.0003 0 0 0 69.65625 6.96875 z",contain:!0}))),Product.setSlidesHeight(t),r()(window).resize(d.a.debounce((function(e){Product.setSlidesHeight(t)}),250))})):function(){var t=r()(".js-productImgScroller").data("flickity"),e=r()(".js-productImgScroller-nav").data("flickity");t&&t.isActive&&s.flickity("destroy");e&&e.isActive&&$mobileSliderNav.flickity("destroy")}()},l=!1,u=r()(".js-row--scrollable"),m=r()(".product-image"),p=r()(".js-productImgScroller"),h=r()(".js-productImgScroller-nav"),f=r()(".js-product-info__wrapper");r()(window).on("scroll",d.a.throttle((function(t){if((window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)>=1024){var e=r()(this).scrollTop(),o=u.outerHeight(),i=p.outerHeight(),d=h.outerHeight(),n=f.outerHeight(),c=u.offset().top-60,s=f.parent().offset().right,a=f.parent().width();e>=c?(h.addClass("is-sticky"),e>=c+i-d?h.addClass("stick-to-bottom"):h.removeClass("stick-to-bottom"),n<i&&(f.addClass("is-sticky"),f.css({right:s,width:a}),e>=c+o-n?f.addClass("stick-to-bottom"):f.removeClass("stick-to-bottom"))):(h.removeClass("is-sticky"),f.removeClass("is-sticky"),f.css({right:"auto",width:"auto"}));for(var l=m.length-1;l>=0;l--){var g=r()(".product-image").eq(l),w=g.attr("data-index"),v=g.outerHeight();if(e>=g.offset().top-60-v){h.find('.product-image-thumb[data-index="'+w+'"]').addClass("active").siblings().removeClass("active");break}}}else h.removeClass("is-sticky stick-to-bottom"),f.removeClass("is-sticky stick-to-bottom"),f.css({right:"auto",width:"auto"})}),10)).on("load",(function(){(function(t){throw new Error('"'+t+'" is read-only')})("isPageLoaded"),l=!0})),h.on("click",".product-image-thumb",(function(){if((window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)>=1024){var t=r()(this).data("index"),e=r()('.product-image[data-index="'+t+'"]'),o=r()(".header--standard").outerHeight();e.length&&l&&r()("html, body").stop(!0,!1).animate({scrollTop:e.offset().top-o},500)}})),r()(window).on("resize",d.a.throttle((function(t){a(),g()}),50)),r()(window).on("load",g),a()}function g(){var t=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;r()(".product-info__wrapper").outerHeight()>r()(".productImgScroller").outerHeight()&&t>=1024?$productInfo.addClass("product-info__wrapper--static"):$productInfo.removeClass("product-info__wrapper--static")}}}]);