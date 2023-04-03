import $ from 'jquery';

  var didScroll;
  var lastScrollTop = 0;
  var delta = 0;
  var $header = $('header');
  var headerScrolling = false;
  var navbarHeight = $header.outerHeight();
  var $document = $(document);
  // $('.bodyWrap').css('margin-top','130px');
  $(window).scroll(function(event){
      didScroll = true;
  });

  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);

  function hasScrolled() {
      var st = $document.scrollTop();
      
      if(!headerScrolling && st > 4){
        $header.addClass('header-scrolling');
        headerScrolling= true
      }

      if(headerScrolling && st < 4){
        $header.removeClass('header-scrolling');
        headerScrolling= false
      }

      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
          return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight){
          // Scroll Down
          $header.addClass('header-scroll__down');
      } else {
          // Scroll Up
          if(st + $(window).height() < $(document).height()) {
            $header.removeClass('header-scroll__down');
          }
      }

      lastScrollTop = st;
  }
