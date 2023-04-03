import $ from 'jquery';

export default class Password {
    constructor() {
		var $targets = $('.password-signup, .password-login');

		$targets.each( function(){
			var $el = $(this);
			if ( $el.find('div.errors').length ) {
				$el.find('input.password, input.email').select();
			}
		});
	}
}
