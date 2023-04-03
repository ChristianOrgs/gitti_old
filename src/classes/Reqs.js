const Reqs = {
    throttle(fn, threshhold = 250, scope) {
		threshhold || (threshhold = 250);

		var last,
			deferTimer;

		return function () {
			var context = scope || this;

			var now = +new Date,
				args = arguments;

			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		}
    },
    
    debounce(fn, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) fn.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) fn.apply(context, args);
		};
	}
}

export default Reqs;
