import $ from 'jquery';
import Cookies from 'js-cookie';

export default class Popup {
	constructor() {
		var self = this;
		var $popup = $('#popup');
		var popupEnabled = $popup.data('enabled');

		if (popupEnabled) {
			var testMode = $popup.data('testmode');
			var modalDelay = parseInt($popup.data('delay')) * 1000; // Convert from ms to seconds
			var reappearTime = parseInt($popup.data('reappear_time')) * 1000; // Convert from ms to seconds

			enquire.register("screen and (min-width:768px)", function() {
				Reqs.popup();
				Reqs.cookie();

				if (testMode) {
					self.show($popup, modalDelay, testMode);
				} else {
					//If cookie doesn't exist or it's expired
					if (Cookies.get('newsletter_delay') === undefined || reappearTime == 0){
						self.show($popup, modalDelay, testMode);
						self.createCookie(reappearTime);
					}
				}

				$.modal.defaults = {
					escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
					clickClose: true,       // Allows the user to close the modal by clicking the overlay
					closeText: " ",     // Text content for the close <a> tag.
					closeClass: 'icon-close',         // Add additional class(es) to the close <a> tag.
					showClose: true,        // Shows a (X) icon/link in the top-right corner
					modalClass: "modal",    // CSS class added to the element being displayed in the modal.
					spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
					showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
					fadeDuration: 250,     // Number of milliseconds the fade transition takes (null means no transition)
					fadeDelay: .5          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
				};
			});
		}
    }
    
	static show($popup, modalDelay, testMode){
		var self = this;
		//Only show if it hasn't already been shown during that browser session
		if (sessionStorage.name != "shown" && $('html').hasClass('lt-ie9') == false){
			setTimeout(function() {
				$popup.modal();
				$popup.css('display','inline-block');
			}, modalDelay);

			// Safari Private Browsing Mode shiv
			if (typeof localStorage === 'object') {
				try {
					localStorage.setItem('localStorage', 1);
					localStorage.removeItem('localStorage');
					sessionStorage.name = "shown";
				} catch (e) {
					Storage.prototype._setItem = Storage.prototype.setItem;
					Storage.prototype.setItem = function() {};
				}
			}
		} else if (testMode) {
			setTimeout(function() {
				$popup.modal();
				$popup.css('display','inline-block');
			}, modalDelay);
		}
    }
    
	static hide() {
		$('.jquery-modal').remove();
    }
    
	static createCookie(reappearTime){
		if (reappearTime != 0){
			Cookies.set('newsletter_delay', 'value', { expires: reappearTime });
		}
	}

}
