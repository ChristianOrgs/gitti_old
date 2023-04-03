import $ from 'jquery';
import Site from './Site';
import Reqs from './Reqs';

export default class Blog {
	constructor() {
		var self = this;
		var $blog = $('#blog-template');
		var showFeatured = $blog.data('featured');
		var itemSelector = $('.blogModule-posts');

		Blog.truncateText( itemSelector );

		$(window)
			.on('resize', Reqs.throttle(function() {
				Blog.truncateText( itemSelector );
			}, 50))
			.on('load', function() {
				Blog.truncateText( itemSelector );
			});

		if (showFeatured) {
			self.featuredTruncate();
			$(window)
				.on('resize', Reqs.throttle(self.featuredTruncate, 50))
				.on('load', self.featuredTruncate);

			// Start from second page if featured article enabled
			$blog.find('.loadMore').trigger('click');
		}

		$(document).on('ajaxify:updated', function() {
			Blog.truncateText( itemSelector );
		});

		var container = $('.blogModule-posts');
		var item = '.blogModule-posts-post';
		Site.scroller( container, item );
	}

	static truncateText( itemSelector ) {
		var textHasImage = itemSelector.find('.blogModule-posts-post--has-image').find('.h3, .excerpt');
		var textNoImage = itemSelector.find('.blogModule-posts-post--no-image').find('.h3, .excerpt');

		textHasImage.trunk8({
			lines: 2
		});

		textNoImage.trunk8({
			lines: 4
		});
	}

	static featuredTruncate() {
		var featuredArticle = $('.article--featured');
		var title = featuredArticle.find('.js-title');
		var excerpt = featuredArticle.find('.js-article__excerpt > p');

		title.trunk8({
			lines: 2
		});

		excerpt.trunk8({
			lines: 5
		});

		featuredArticle.removeClass('is-loading');
	}
}
