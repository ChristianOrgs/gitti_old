import $ from 'jquery';
import Gitti from './Gitti';

export default class Nav extends Gitti {
    constructor(options) {
		super(options);
        this.$hamburger = $('#hamburger-menu');
        this.$menuToggle = $('.js-menuToggle');
        this.$navSocialLink = $('.nav-social-link');
        this.submenu = this.initSubmenu();
        this.search = this.initSearch();
        this.bindings();
        this.activeLinks();
    }

	getWidth() {
		var ww = $(window).outerWidth();

		if(ww >= 1280) {
			return ww / 3;
		} else if(ww >= 768) {
			return ww * 2 / 3;
		} else {
			return ww;
		}
	}
	
	bindings(){
		const SiteNav = this;
		const { $menuToggle, $navSocialLink, $body } = this;
		$menuToggle.on('click', (e) => {
			e.preventDefault();

			if ($body.hasClass('nav--is-visible')){
				SiteNav.hide();
			} else {
				SiteNav.show();
			}
		});

		$('.nav-standard .menu li:has(a[aria-expanded])').hover(function() {
			$(this).find('a[aria-expanded]').attr('aria-expanded', true);
		}, function() {
			$(this).find('a[aria-expanded]').attr('aria-expanded', false);
		});

		$('.nav-standard .menu-item--meganav').hover(function() {
			$('.site-header').addClass('header--megamenu-visible');
		}, function() {
			$('.site-header').removeClass('header--megamenu-visible');
		});

		$('.bodyWrap').children().first().on('click', () => {
			SiteNav.hide();
		});

		$('.nav-container .has-submenu > a').on('click', function(e){
			e.preventDefault();
			SiteNav.submenu.open( $(this) );
		});

		$('.submenu-back').on('click', function(e){
			e.preventDefault();
			SiteNav.submenu.close( $(this) );
		});

		$('.js-searchToggle').on('click', function(){
			if ($(this).closest('.nav-main').hasClass('search--is-visible')){
				SiteNav.search.close();
				Search.close();
			} else {
				var search = $(this).closest('.nav-main');
				SiteNav.search.open(search);
			}
		});

		// Hide search modal on click outside
		$(document).on('click', function(e){
			if (!$(e.target).is('.nav-search-overlay, .nav-search-overlay *, .js-searchToggle, .js-searchToggle *')) {
				if ($('.nav-main').hasClass('search--is-visible')){
					SiteNav.search.close();
					Search.close();
				}
			}
		});

		$navSocialLink.on('click', function (e) {
			var $diamond = $(this).children('.diamond');
			$diamond.addClass('ripple-click');
			setTimeout(function(){
				$diamond.removeClass('ripple-click');
			},500);
		});

		// Close hamburger menu on body click
		$('body').on('click', function(e) {
			if (!$(e.target).is('.js-menuToggle *, .nav-main *')) {
				SiteNav.hide();
			}
		});
	}
	
	show(){
		const SiteNav = this;
		const { $hamburger, $body } = this;
		$hamburger.addClass('open');

		$('.js-searchToggle').focus();
		$('.js-searchToggle').attr('tabindex','0').attr('aria-expanded', true);;
		$('.last-focusable-element').attr('tabindex','0');

		$body.add('html').addClass('nav--is-visible');

		$('.nav-inner').css({
			'transform': 'translateX(100%)'
		});

		$('.header-fix-cont-inner, .bodyWrap, .siteAlert, .main-logo').css({
			'transform': 'translateX('+$('.nav-inner').width()+'px)'
		});

		$(window).on('resize.siteNav', function() {
			$('.header-fix-cont-inner, .bodyWrap').css({
				'transform': 'translateX('+$('.nav-inner').width()+'px)'
			});
		});

		var activeEl = document.activeElement;
		if($(activeEl).hasClass('js-menuToggle ')){
			$('body').on('keydown', function(e) {
				if(e.which == 9){
					$('.js-searchToggle').focus();
				}
			});
		}

		$('body').on('keydown', function(e) {
			if (e.which == 9) {
				var activeEl = document.activeElement;
					if($(document.activeElement).hasClass('last-focusable-element')){
					SiteNav.hide();
					$('.last-focusable-element').attr('tabindex','-1');
					}
				}
		});

		$('.visible-nav-link').each(function(){
			$(this).removeAttr('tabindex');
		});

		$('body').on('keydown', function(e) {
			var activeEl = document.activeElement;
			var sibling = $(activeEl).next();
			if($(sibling).hasClass('is-visible') && e.which == 9 ){
				$('.submenu-item--link').each(function(){
					$(this).attr('tabindex','0');
				});
			}
			if($(activeEl).data('last') == true && e.which == 9){
				var menu = $(activeEl).parents().eq(3);
				$(menu).removeClass('submenu--is-visible');
				$('.submenu-item--link').each(function(){
					$(this).attr('tabindex','-1');
				});
			}
		});

		$('.js-searchToggle').attr('tabindex','0');
		$('#shopName').attr('tabindex','-1');
		$('#cartTotal').attr('tabindex','-1');

	}
	
	hide(){
		const SiteNav = this;
		const { $hamburger, $body } = this;
		$hamburger.removeClass('open');
		$body.add('html').addClass('nav--is-hiding');

		$('.nav-inner, .header-fix-cont-inner, .bodyWrap, .siteAlert, .main-logo').add($hamburger).css({
			'transform': 'none'
		});

		$(window).off('resize.siteNav');

		setTimeout(function(){
			$body.add('html').removeClass('nav--is-visible');
			$body.add('html').removeClass('nav--is-hiding');
		}, 300);

		// close search too
		if ($('.nav-container').hasClass('search--is-visible')){
			SiteNav.search.close();
			Search.close();
		}

		$('.visible-nav-link').each(function(){
			$(this).attr('tabindex','-1');
		});

		$('.js-searchToggle').removeAttr('tabindex').attr('aria-expanded', false);
		$('#shopName').attr('tabindex','0');
		$('#cartTotal').attr('tabindex','0');

	}

	activeLinks(){
		var $menu_items = $(".menu-item"),
				$submenu_items = $('.submenu-item');

		$menu_items.each(function(){
			if ($(this).find('> a').attr('href')=== window.location.pathname) {
				$(this).addClass('is-active');
			}
			// if no top-level link is active, then a submenu link is probably active
			else {
				$submenu_items.each(function(){
					if ($(this).find('> a').attr('href')=== window.location.pathname) {
						$(this).addClass('is-active'); // activate the active submenu link
						$(this).closest('.menu-item.has-submenu').addClass('is-active'); // activate parent as well
					} else {
						return; // must be homepage or page not in menu
					}
				});
			}
		});
	}
	
	initSubmenu() {
		return {
			open: function(el){
				var $menu = $('.menu'),
					menuHeight = $menu.height();
				$menu.addClass('submenu--is-visible');

				var $elSubMenu = el.siblings('.submenu'),
					elSubMenuHeight = $elSubMenu.height();
				$elSubMenu.addClass('is-visible');

				if (menuHeight < elSubMenuHeight) {
					$menu.height(elSubMenuHeight);
				}
				return false;
			},
			close: function(el){
				var link = $(el).children().first(),
					$menu = $('.menu'),
					menuHeight = $menu.height(),
					$elSubMenu = el.closest('.submenu'),
					$elParentMenu = $elSubMenu.parents('.submenu'),
					elParentMenuHeight = $elParentMenu.height();

				if( $(link).hasClass('first-back--link') ){
					$('.menu').removeClass('submenu--is-visible').removeAttr("style");
				}

				$elSubMenu.removeClass('is-visible');

				if (menuHeight < elParentMenuHeight) {
					$menu.height(elParentMenuHeight);
				}

				return false;
			}
		}
	}

	initSearch() {
		return {
			open: function(search){
				$('.js-searchToggle').attr('aria-expanded', true);
				search.addClass('search--is-visible');
				search.find('.nav-search-input').focus();
			},
			close: function(){
				$('.js-searchToggle').attr('aria-expanded', false);
				$('.nav-main').addClass('search--is-hiding');
				setTimeout(function(){
					$('.nav-main').removeClass('search--is-visible search--is-hiding');
				}, 600);
			}
		}
	}
		
}
