(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{91:function(i,n,e){"use strict";e.r(n);var t=e(0),o=e.n(t),a={init:function(){o()('.productImgSlider[data-gallery="lightbox"]')||o()(".product-image-img").on("click",(function(){var i=o()(this).closest(".product-image").attr("data-bg-src")||o()(this).closest(".product-image").attr("data-image");a.image(i)}))},image:function(i){var n=o()(".mobile-zoom-overlay"),e=new Image;e.src=i,n.append(e),o()(e).load((function(){var i=o()(this),e=i.height(),t=(o()(window).innerHeight()-e)/2;i.css("top",t),n.addClass("is-visible"),i.addClass("fade-in"),i.panzoom()})),o()(".js-MobileZoom-close").on("click",(function(){a.hide(n)}))},hide:function(i){i.addClass("is-hiding"),setTimeout((function(){i.removeClass("is-hiding is-visible"),i.find("img").panzoom("destroy").remove()}),300)}};a.init();var s=o()(".product-navigation-bar");s.length&&e.e(33).then(e.t.bind(null,57,7)).then((function(i){s.find(".slide-wrapper").on("click",".js-slide",(function(i){var n=o()(i.currentTarget).index();o()(".productImgSlider").flickity("select",n)}))}))}}]);