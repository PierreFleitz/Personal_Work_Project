var places = [];
var places_names = [];
var places_api = "http://www.kth.se/api/places/v2/places?callback=feedplaces";
var openmenu = false;
// Create a YQL query to get data for the meal
var yql_places_query = "SELECT * from html WHERE url='" + places_api +"';"; //
var url_query = BASE_URI + toQueryString({q: yql_places_query, format: 'json',callback: 'feedplaces'});

// Using YQL and JSONP
$.ajax({
	type:'GET',
	url: url_query,
});

function feedplaces( data ) {
	//console.log(url_query);
	var items = data.query.results;
	$.each( items, function( index, object ) {
		places = $.parseJSON(object);
	});
	$.each(places,function(index,place) {places_names.push(place.name + " - " + place.region);})
	places_names.sort();
}
$('#search_filter').on({
	"click":function(e){
	  e.stopPropagation();
	}
});
$('#search_filter').click(false);

function listitem(name) {
	return "<li><a href='#'>" +name + "</a></li>";
}

function filterproposition() {
	var minchar = 2;
	var selector = $('#search_filter').val().toLowerCase();
	if(!openmenu && selector.length >minchar) {
		$("#search_filter").dropdown('toggle');
		openmenu = true;
	}
	
	if(openmenu) {
		var propositions = $('#dropdown_menu');
		propositions.empty();
		$.each(places_names, function(index,place) {
			if(place.toLowerCase().indexOf(selector) >= 0) {
				propositions.append(listitem(place));
			}
		});
	}

	if(selector.length <=minchar && openmenu){
		$("#search_filter").dropdown('toggle');
		openmenu = false;
	}
}

//GOOGLE API
function initMap() {
	var mapDiv = document.getElementById('google_map');
	var oMap = new google.maps.Map( mapDiv,{ 'center' : new google.maps.LatLng( 46.80, 1.70), 'zoom' : 6, 'mapTypeId' : google.maps.MapTypeId.ROADMAP }); 
}
// init lorsque la page est chargée 
google.maps.event.addDomListener( window, 'load', initMap); 
