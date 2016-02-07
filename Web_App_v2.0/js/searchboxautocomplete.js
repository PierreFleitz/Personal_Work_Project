
/**
 * Autocomplete for search fields from www.kth.se/search
 *
 * Version: 0.3.19
 */
 $(function($) {

  var options;

  //
  // plugin definition
  //
  $.fn.searchboxautocomplete = function(configuration) {

    // build main options before element iteration
    options = $.extend({}, $.fn.searchboxautocomplete.defaults, configuration);

    addAutocomplete($(this));
  };

  function exists(element) {

    if (element == null) {
      return false;
    }

    if (element.length > 0) {
      return true;
    }

    return false;

  }

  function getFilter() {

    if (options.entities) {
      if (options.entities.indexOf('kth-profile') > -1) {
        return 'kth-profile';
      }
    }

    if (exists($(options.filterId))) {
      var filterId = $(options.filterId).val();

      if (filterId.indexOf('kth-profile') > -1) {
        return 'kth-profile';
      }
    }

    return null;
  }


  function addAutocomplete(searchbox) {

    $(options.searchFormId).addClass("searchboxautocomplete");

    searchbox.bind("keydown", function(event) {
      if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
        event.preventDefault();
      }
    });

    searchbox.autocomplete({
    
        source : function(request, response) {
            $.ajax({
                url : options.suggestUrl,
                dataType : 'jsonp',
                data : {
                    q : request.term,
                    filter : getFilter()
                },
                messages: {
                  noResults: '',
                  results: function() {}
                },
                success : function(data) {
                    response($.map(data, function(item) {
                        return item;
                    }));
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    console.error('Error while fetching autocomplete: ' + textStatus);
                }
            });
        },
        search : function() {
          if (this.value.length < 2) {
            return false;
          }
          return true;
        },
        open: function( event, ui ) {
          $(options.formsetId).removeClass("closed").addClass("open");
        },
        close: function( event, ui ) {
          $(options.formsetId).removeClass("open").addClass("closed");
        },
        focus : function(event, ui) {
        
           if(ui.item){
                var query;
                var match = ui.item.match;
                
                if (getFilter() == 'kth-profile') {
                    query = match.value + " " + match.title + " " + match.extension;
                    query = query.replace(/,/g,'').trim();
                } else {
                    query = match.value;
                }

                $(options.searchInputId).val(query);
                
            }
            return false;
        },
        select : function(event, ui) {
            $(options.searchFormId).submit();
            return false;
        }

    }).data("ui-autocomplete")._renderItem = function(ul, item) {
      
        ul.addClass(options.cssClass);
    
        var renderFunction;
        var elementClass;
                
        if (getFilter() == 'kth-profile') {
            renderFunction = renderPerson;
            elementClass = 'kth-profile';
            ul.addClass('filter kth-profile');
        } else {
            renderFunction = renderBulk;
            elementClass = 'bulk';
        }
      
        return  $("<li class='" + elementClass + "'></li>")
            .data("item", item.match)
            .append(renderFunction(item.match))
            .appendTo(ul);
    };

    function renderBulk(match) {
        return "<a><span class='label'>" + match.value + "</span></a>";
    }

    function renderPerson(match) {
        var snippet = match.title +
            getWithCommaOrElse(match.extension, match.telephone) +
            getWithCommaOrElse(match.email, "");

        snippet = snippet.trim();
        if (snippet.indexOf(",", snippet.length - 1) !== -1) {
            snippet = snippet.substring(0, snippet.length - 1);
        }
        if (snippet.indexOf(",", 0) === 0) {
            snippet = snippet.substring(1, snippet.length);
        }

        return "<a><img src='" + match.image_url + "' height='40' width='40'/>" +
                "<span class='label'><span class='name'>" + match.value + "</span>" +
                "<span class='snippet'>" + snippet + "</span></span></a>";
    }

    function getWithCommaOrElse(field, orElse) {
        if (field && field.trim().length > 0) {
            return ", " + field;
        } else {
            if (orElse && orElse.trim().length > 0) {
                return ", " + orElse;
            } else {
                return "";
            }
        }
    }

    searchbox.keydown(function(e) {
      if (e.keyCode == $.ui.keyCode.ENTER) {
        $(options.searchFormId).submit();
      }
    });
  }

  //
  // plugin defaults.
  //
  $.fn.searchboxautocomplete.defaults = {
    suggestUrl: 'https://www.kth.se/search/suggestJsonp',
    searchInputId: '#q',
    searchFormId: '#search-form',
    formsetId: '#searchFieldset',
    cssClass: 'default',
    filterId: '#filter',
    entities : null
  };

});
