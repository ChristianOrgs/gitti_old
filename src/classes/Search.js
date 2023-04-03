import $ from 'jquery';
import { setBadgePosition } from '../utils';

export default class Search {
	constructor() {
		var self = this;
		self.searchForm = $('.nav-standard .search-form');
		self.searchContainer = $('.nav-standard .nav-search-container');
		self.searchScroller = $('.nav-standard .nav-search-scroller');
		self.searchResultsContainer = $('#search-results');
		self.searchType = self.searchForm.find('input[name="type"]').val();
		self.searchRequest = null;
		self.searchForm.on('keyup', '.nav-search-input', function(e) {
			// Close if escape key pressed
			if (e.keyCode === 27) {
				self.close();
				Site.nav.search.close();
			}

			var query = $(this).val();
			if (query.length) {
				 query += '*';
				self.request(query);
			} else {
				self.close();
			}
		});

		self.searchContainer.on('click', '.js-loadMore', function(e) {
			e.preventDefault();
			var requestedURL = this.href;
			this.classList.add('loading');
			self.loadMore(requestedURL);
		});

		self.searchContainer.on('click', '.results__popular-links a', function(e) {
			e.preventDefault();
			var searchText = $(this).text();
			self.searchForm.find('.nav-search-input').val(searchText);
			self.request(searchText);
		});

		self.infiniteScroll();
    }
    
	close() {
		var self = this;
		self.searchResultsContainer.empty();
		self.searchContainer.removeClass('is-searching');
    }
    
	request(query) {
		var self = this;

		self.searchResultsContainer.empty();
		self.searchContainer.addClass('is-searching');

		// Kill previous ajax request
		if (self.searchRequest != null) {
		 	self.searchRequest.abort();
		}

		// Do a new ajax request
		self.searchRequest = $.ajax({
			method: 'GET',
			url: '/search?view=json',
			dataType: 'json',
			data: {
				q: query,
				type: self.searchType
			}
		}).done(function(data) {
			var searchResultsContent = '';
			var pagination = '';

			if (data.results_count) {
				var resultsText = data.results_count == 1 ? data.results_count + "{{ 'search.content.results.one' | t }}" : data.results_count + "{{ 'search.content.results.other' | t }}";
				var nextPage = data.next_page;

				searchResultsContent += '<div class="results__count">' + resultsText + '</div>\
										 <ul class="results__list">' + self.getResultsContent(data) + '</ul>';

				if (nextPage) {
					pagination = '<div class="pagination u-center"><a href="' + nextPage + '" class="js-loadMore loadMore loadMore--endlessScroll button">{{ "collections.pagination.load_more" | t }}</a><div class="load-more-icon"></div></div>';
				}

			} else {
				searchResultsContent = '<p class="no-results">{{ "search.content.results.no_results" | t }}</p>';
			}

			self.searchResultsContainer.html(searchResultsContent);
			self.searchResultsContainer.append( pagination );
			self.searchContainer.removeClass('is-searching');
			setBadgePosition();
			$(window).on('resize', Reqs.debounce(function() {
				setBadgePosition();
			}, 250));
		});
    }
    
	infiniteScroll() {
		var self = this;
		self.searchScroller.on('scroll',function() {
			var scrolled = $(this).scrollTop();
			var scrollTriggerPoint = self.searchContainer.height() - self.searchScroller.height() * 2;
			var isSearching = self.searchContainer.hasClass('is-searching');

			if (scrolled >= scrollTriggerPoint && !isSearching) {
				self.searchContainer.find('.js-loadMore').trigger('click');
				self.searchScroller.off('scroll');
			}
		});
    }
    
	loadMore(requestedURL) {
		var self = this;

		self.searchRequest = $.ajax({
			method: 'GET',
			url: requestedURL,
			dataType: 'json'
		}).done(function(data) {
			var pagination = '';
			var searchResultsContent = '';
			var nextPage = data.next_page;

			if (data.results_count) {
				searchResultsContent = self.getResultsContent(data);

				if (nextPage) {
					pagination += '<div class="pagination u-center"><a href="' + nextPage + '" class="js-loadMore loadMore loadMore--endlessScroll button">{{ "collections.pagination.load_more" | t }}</a><div class="load-more-icon"></div></div>';
				}
			}

			self.searchResultsContainer.find('.pagination').remove();
			self.searchResultsContainer.find('.results__list').append(searchResultsContent);
			self.searchResultsContainer.append( pagination );
			self.infiniteScroll();
			setBadgePosition();
		});
    }
    
	getResultsContent(data) {
		var searchResultsContent = '';

		for ( var i = 0; i < data.results.length; i++ ) {
			var title = data.results[i].title;
			var url = data.results[i].url;
			var image = data.results[i].featured_image;
			var imageAspectRatio = data.results[i].image_aspectratio;
			var object_type = data.results[i].object_type;
			var sold_out = data.results[i].available ? false : true;
			var on_sale = data.results[i].on_sale;
			var flag = '';
			var flagClass = '';

			if (object_type == 'product')  {
				if (on_sale || sold_out) {
					flagClass += on_sale ? ' is-sale' : '';
					flagClass += sold_out ? ' is-sold-out' : '';

					flag = '<span class="product-status-flag' + flagClass + '">';
					if (sold_out) {
						flag += "{{ 'products.labels.sold_out' | t }}";
					} else if (on_sale) {
						flag += "{{ 'products.labels.on_sale' | t }}";
					} else if (on_sale && sold_out) {
						flag += "{{ 'products.labels.sold_out' | t }}";
					}

					flag += '</span>';
				}
			}

			searchResultsContent += '<li class="result">\
										<div class="result__image" data-aspectratio="' + imageAspectRatio + '"><a href="' + url + '" tabindex="3"><img src="' + image + ' alt="' + title + '" class="lazyload fade-in"/>' + flag + '</a></div>\
										<h3 class="result__title"><a href="' + url + '">' + title + '</a></h3>\
									</li>';
		}

		return searchResultsContent;
    }
    
	setBadgePosition() {
		var self = this;

		self.searchResultsContainer.find('.product-status-flag').each(function() {
			var badge = $(this);
			var imgContainer = badge.closest('.result__image');
			var imgContainerWidth = imgContainer.outerWidth();
			var imgContainerHeight = imgContainer.outerHeight();
			var imgContainerRatio = imgContainerWidth / imgContainerHeight;
			var imageAspectRatio = imgContainer.data('aspectratio');
			var diffRatio = imageAspectRatio / imgContainerRatio;
			var posLeft = 0;
			var posTop = 0;

			if ( imageAspectRatio > imgContainerRatio ) {
				posLeft = 0;
				posTop = parseInt( ( imgContainerHeight - imgContainerHeight / imgContainerRatio ) / 2 );
			} else {
				posTop = 0;
				posLeft = parseInt( ( imgContainerWidth - imgContainerWidth * diffRatio)  / 2 );
			}

			badge.css({
				top: posTop,
				left: posLeft,
				opacity: 1
			});
		});
	}

}
