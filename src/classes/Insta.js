import $ from 'jquery';

export default class Insta {
	constructor() {
		function getDateFormat(timestamp) {
			var date = new Date( timestamp * 1000 );
			var months = "{{ 'instagram.months' | t }}";
			months = months.split(', ');

			return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
		}

		if( $('.js-instafeed').length ) {
			$('.js-instafeed').each(function() {
				var instaFeed = $(this);
				var featuredClass = 'instagram-img__wrapper';
				var enableFeaturedImage = $(this).data( 'featured-image' );
				if (enableFeaturedImage){
					var featuredClass = 'instagram-img__wrapper--featured';
				}
				var error = $(this).find('.js-fallback');
				var options = {};
				var slides = '';
				var valencia = window.valencia.default;
				var token = $(this).attr( 'data-insta-token' );
				var count = $(this).attr( 'data-insta-count' ) || 5;
				var template = '<div class="instagram-img__wrapper %%featuredClass%%">\
									<a style="background-image:url(%%img%%);" class="instagram-img" target="_blank" href="%%link%%">\
										<div class="instagram-img__overlay">\
											<div class="instagram-img__content">\
												<div class="instagram__logo"><span class="icon-instagram"></span></div>\
												<p class="instagram-img__likes">%%likes%% {{ "instagram.likes" | t }}</p>\
												<p class="instagram-img__date">%%date%%</p>\
												<p class="instagram-img__caption">%%caption%%</p>\
											</div>\
										</div>\
									</a>\
								</div>';


				if( instaFeed.hasClass( 'insta-loaded' ) ) {

				}else {
					var feed = valencia( {
						token: token,
						count: count
					}, function( data ) {
						if( !data.images ) {
							return console.warn( 'Bad Instagram API request.' );
						}

						data.images.forEach( function( a, index ) {
							if ( enableFeaturedImage ) {
								featuredClass = index == 0 ? featuredClass : '';
							}

							var caption = '';
							if (a.caption != null){
								var caption = a.caption.text;
							}

							slides += template
										.replace( '%%featuredClass%%', featuredClass )
										.replace( '%%link%%', a.link )
										.replace( '%%likes%%', a.likes.count )
										.replace( '%%caption%%', caption )
										.replace( '%%date%%', getDateFormat(a.created_time) )
										.replace( '%%img%%', '\''+a.images.standard_resolution.url+'\'' );
						} );


						instaFeed.html( slides );
						instaFeed.addClass( 'insta-loaded' );
					} );
				}
			});
		}
	}

}
