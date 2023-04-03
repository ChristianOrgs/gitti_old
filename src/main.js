import $ from 'jquery';
import Site from './classes/Site';
import Cart from './classes/Cart';
import './public-path';
import Nav from './classes/Nav';

window.jQuery = window.$ = $;

$(document).ready(function() {
    const shopifyData = JSON.parse(document.getElementById('shopify-data').innerHTML);
    const $body = $('body');
    const $window = $(window);
    const $document  = $(document);
    const spinner = $('#Spinner').html();

    const bodyTemplate = name => {
      return $body.hasClass(name);
    };

    const containsElement = query => {
      return $(query).length > 0;
    };

    const options = {
      shopifyData,
      $body,
      $window,
      $document,
      spinner,
    };

    const site = new Site(options);
    new Nav(options);
    new Cart(options);
    // new Collection(options);

    if (containsElement('.js-productImgSlider')) {
      import(/* webpackChunkName: "product-slider" */ './modules/product-slider').then(module => {
        console.log('product-slider loaded');
      });
    }

    if (containsElement('.js-hero-slider')) {
      import(/* webpackChunkName: "hero-slider" */ './modules/hero-slider').then(module => {
        console.log('hero-slider loaded');
      });
    }

    if (containsElement('.js-carousel-slider')) {
      import(/* webpackChunkName: "carousel-slider" */ './modules/carousel-slider').then(module => {
        console.log('carousel-slider loaded');
      });
    }

    if (containsElement('.js-collection-slider')) {
      import(/* webpackChunkName: "collection-carousel" */ './modules/collection-carousel').then(module => {
        console.log('collection-carousel loaded');
      });
    }
    
    if (containsElement('.js-slider')) {
      import(/* webpackChunkName: "gallery-slider" */ './modules/gallery-slider').then(module => {
        console.log('gallery-slider loaded');
      });
    }

    if (containsElement('.js-mosaic__blocks')) {
      import(/* webpackChunkName: "mosaic-slider" */ './modules/mosaic-slider').then(module => {
        console.log('mosaic-slider loaded');
      });
    }

    if (containsElement('.js-logos-slider')) {
      import(/* webpackChunkName: "logos-slider" */ './modules/logos-slider').then(module => {
        console.log('logos-slider loaded');
      });
    }

    if (containsElement('.js-product-tabs .product-tab')) {
      import(/* webpackChunkName: "product-tabs" */ './modules/product-tabs').then(module => {
        console.log('product-tabs loaded');
      });
    }

    if (bodyTemplate('show-grid-items-transition')) {
      import(/* webpackChunkName: "Animations" */ './classes/Animations').then(module => {
        const Animations = module.default;
        new Animations();
      });
    }

    if (bodyTemplate('template-collection')) {
      import(/* webpackChunkName: "Collection" */ './classes/Collection').then(Collection => {
        new Collection.default(options);
      });
    }

    if (bodyTemplate('template-product')) {
      import(/* webpackChunkName: "page-product" */ './modules/page-product');
      import(/* webpackChunkName: "Product" */ './classes/Product').then(module => {
        const Product = module.default;
        new Product(options);
      });
    }

    if (bodyTemplate('template-customers-login')) {
      import(/* webpackChunkName: "Login" */ './classes/Login').then(module => {
        const Login = module.default;
        new Login();
      });
    }

    if (bodyTemplate('js-addAddress')) {
      import(/* webpackChunkName: "Addresses" */ './classes/Addresses').then(module => {
        const Addresses = module.default;
        new Addresses();
      });
    }

    if (containsElement('.js-collection-grid')) {
      import(/* webpackChunkName: "ListCollections" */ './classes/ListCollections').then(module => {
        const ListCollections = module.default;
        new ListCollections(options);
      });
    }

    if (containsElement('.js-quickView')) {
      import(/* webpackChunkName: "QuickView" */ './classes/QuickView').then(module => {
        const QuickView = module.default;
        new QuickView(options);
      });
    }

    if (containsElement('.js-quickViewPopover')) {
      import(/* webpackChunkName: "QuickViewPopover" */ './classes/QuickViewPopover').then(module => {
        const QuickViewPopover = module.default;
        new QuickViewPopover();
      });
    }

    if (containsElement('#popover-popup')) {
      import(/* webpackChunkName: "PopoverPopup" */ './classes/PopoverPopup').then(module => {
        const PopoverPopup = module.default;
        new PopoverPopup();
      });
    }

    if (containsElement('#info-popup')) {
      import(/* webpackChunkName: "InfoPopup" */ './classes/InfoPopup').then(module => {
        const InfoPopup = module.default;
        new InfoPopup();
      });
    }

    if (containsElement('#notify-popup')) {
      import(/* webpackChunkName: "NotifyPopup" */ './classes/NotifyPopup').then(module => {
        const NotifyPopup = module.default;
        new NotifyPopup();
      });
    }

    if (containsElement('#blog-template')) {
      import(/* webpackChunkName: "Blog" */ './classes/Blog').then(module => {
        const Blog = module.default;
        new Blog();
      });
    }

    if (containsElement('.js-instafeed')) {
      import(/* webpackChunkName: "Insta" */ './classes/Insta').then(module => {
        const Insta = module.default;
        new Insta();
      });
    }

    if (containsElement("div[data-section-type='map']")) {
      import(/* webpackChunkName: "Gmap" */ './classes/Gmap').then(module => {
        const Gmap = module.default;
        new Gmap();
      });
    }

    if (containsElement('#popup')) {
      import(/* webpackChunkName: "Popup" */ './classes/Popup').then(module => {
        const Popup = module.default;
        new Popup();
      });
    }

    if (containsElement('[id^=moodja_set_custom_options]')) {
      import(/* webpackChunkName: "moodja_set" */ './modules/moodja_set').then(() => {
        console.log('moodja sets loaded');
      });
    }


    $(window).trigger('scroll');

    if (containsElement('.js-siteAlert')) {
      import(/* webpackChunkName: "Promo" */ './classes/Promo').then(module => {
        const Promo = module.default;
        new Promo();
      });
    }

    if (shopifyData.settings.show_multiple_currencies) {
        site.onPriceAdded();
    }

    if (containsElement('.template-password')) {
      import(/* webpackChunkName: "Password" */ './classes/Password').then(module => {
        const Password = module.default;
        new Password();
      });
    }

    if (containsElement('[data-section-type="featured-product"]') && containsElement('#product-select')) {
      import(/* webpackChunkName: "FeaturedProduct" */ './classes/FeaturedProduct').then(module => {
        const FeaturedProduct = module.default;
        new FeaturedProduct(options);
      });
    }

    if ($('.hero-slider').siblings('.teaser-bubbles-wrapper').length) {
      import(/* webpackChunkName: "slideshow-cstm" */ './modules/slideshow-cstm');
    }

    if ($('.site-header').hasClass('site-header-scroll')) {
      import(/* webpackChunkName: "header" */ './modules/header');
    }
    
    if ($(".discount-bar").length) {
      import(/* webpackChunkName: "discount-bar" */ './modules/discount-bar');
    }
});
