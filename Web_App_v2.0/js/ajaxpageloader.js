(function($) {

    var options;
    var pageToShow = 0;

    /*
     * plugin definition
     */
    $.fn.ajaxpageloader = function(configuration) {
        //console.log('PAGE DATA: ' + JSON.stringify(showPagingButton));
        // build main options before element iteration
        options = $.extend({}, $.fn.ajaxpageloader.defaults, configuration);
        if (showPagingButton) {
          addOnClickHandler($(this));
        } else {
          button.hide();
        }
    };

    function addOnClickHandler(button) {
      $(button).click(function(event){
        ajaxPageLoad(button);
        event.preventDefault();
      });
    }

    function ajaxPageLoad(button) {
      pageToShow++;
      var urlParams = $.param({'pageToShow' : pageToShow}, true);
      $.get(options.pageUrl + window.location.search, urlParams, function(data) {
        $(data).insertAfter($(options.resultDivIdPrefix+(pageToShow-1)));
        if(!showPagingButton) {
          button.hide();
        }
        $('html, body').last().animate({
          scrollTop: $(options.resultDivIdPrefix+pageToShow).offset().top - $('#menu-bar-wrapper').height(),
        }, options.scrollSpeed);

        // Adds the publication list link on person search results
        if ($.fn.publicationListLink) {
          $.each($(".publicationListLink"), function(i, val) {
            $(this).publicationListLink();
          });
        }
      });
    };

    /*
     * plugin defaults
     */
    $.fn.ajaxpageloader.defaults = {
      pageUrl: '/search/search/page',
      resultDivIdPrefix: '#resultHitsSlot-',
      scrollSpeed: 800
    };

})(jQuery);