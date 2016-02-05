var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var today = new Date();
var dd = "" + today.getDate();
var dayname = days[today.getDate()];
if(dd.length < 2) {
	dd = "0" + dd;
}
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var todayStr = yyyy + "-" + mm + "-" + dd;

var allrestaurants = [];
var restaurantslist = $('#restaurants');
var debugtext = $('#debugtext');
//YQL stuff..
var BASE_URI = 'http://query.yahooapis.com/v1/public/yql?';  
// This utility function creates the query string
// to be appended to the base URI of the YQL Web
// service.
function toQueryString(obj) {
  var parts = [];    
  for(var each in obj) if (obj.hasOwnProperty(each)) {
	parts.push(encodeURIComponent(each) + '=' + encodeURIComponent(obj[each]));    
  }    
  return parts.join('&');  
};

//create a JSON of the restaurant
function restaurantToJSON(name, tags) {
	var jsonObj = {"name": name, "tags":[], "meals":[]};
	$.each(tags, function(index, value) {
		jsonObj.tags.push(value);
	});
	return jsonObj;
}

//Create the HTML code to put the meal in the list
function mealEntry(meal) {
	return "<li class='list-group-item'><a href='#'>" + meal + "</a></li>";
}

//Add the restaurant to the list 
function addRestaurantEntry(restaurant) {
	htmlstring = "<a id='toggler' data-toggle='collapse' class='list-group-item active' data-target='#" + restaurant.name + "_meals'>" +
				restaurant.name +
				"</a>" +
					"<div id='" + restaurant.name + "_meals' class='collapse in'>" + 
						"<ul class='nav nav-list'>";
						$.each( restaurant.meals, function (index, value) {
							htmlstring += mealEntry(value);
						});
						htmlstring += "</ul></div>";
	restaurantslist.append(htmlstring);
}
//getting meal for Q restaurant
var q_json = restaurantToJSON("Q",["q","kth"]);
allrestaurants.push(q_json);
var q_url = "http://www.hors.se/veckans-meny/?week_for=" + todayStr + "&l=e#tillmenyn";
  
// Create a YQL query to get data for the meal
var yql_q_query = "SELECT * from html WHERE url='" + q_url +"';"; //
var qurl = BASE_URI + toQueryString({q: yql_q_query, format: 'xml',callback: 'parseQCallback'});

// Using YQL and JSONP
$.ajax({
	type:'GET',
	url: qurl,
});

function parseQCallback(data) {
	//console.log(yql_q_query);
	var xmlString = data.results[0];
	var meal = $.parseXML(xmlString);

	var meal = $(xmlString).find("table")[0];
	for (var i = 0, row; row = meal.rows[i]; i++) {
		//iterate through rows
		//rows would be accessed using the "row" variable assigned in the for loop

		if(i!=0){
			for (var j = 0, col; col = row.cells[j]; j++) {
				 //iterate through columns
				 //columns would be accessed using the "col" variable assigned in the for loop
				var rowDate = col.innerHTML;
				if(j==0 && rowDate.indexOf(dd) < 0) {
					break;
				}else if(j!=0) {
					q_json.meals.push(col.innerHTML);
				}
				
			}
		}	
	}
	createlist("");
}

//Nymble
var nymble_json = restaurantToJSON("Nymble",["nymble","kth"]);
allrestaurants.push(nymble_json);
var nymble_url = "http://ths.kth.se/om-ths/restaurang-cafe/restaurang-nymble-meny/";
  
// Create a YQL query to get data for the meal
var yql__nymble_query = "SELECT * from html WHERE url='" + nymble_url + "' and xpath=\"//p[strong=\'Friday\n\' or strong=\'Vegetarian of the week\n\' or strong=\'Fish of the week\n\' or strong=\'Salad\n\']\";"; //
var nymble_query = BASE_URI + toQueryString({q: yql__nymble_query, format: 'xml',callback: 'parseNymbleCallback'});
// Using YQL and JSONP
$.ajax({
	type:'GET',
	url: nymble_query,
});

function parseNymbleCallback(data) {
	console.log(nymble_query)
	var xmlString = data.results;
	$.each(xmlString, function(index,obj) {
		var htmlObj = $.parseHTML(obj);
		debugtext.val(obj);
			var inner = htmlObj[0].innerHTML; 
			debugtext.val(inner);
			var reg = /<strong>(.*?)<br>\n<\/strong>(.*?)/g;
			var match = inner.match(reg);
			var plaintext = match[0].replace(/(<([^>]+)>)/g,"");
			var title = plaintext.replace(/(\r\n|\n|\r)/gm,"");
			var meal = inner.replace(match[0],"");
			nymble_json.meals.push(meal);
	});
	createlist("");
}

function createlist() {
	var selector = $('#meal_filter').val().toLowerCase();
	var toshow = [];
	if(selector != "") {
		$.each(allrestaurants,function(index, restaurant){
			for (var j = 0, tag; tag = restaurant.tags[j]; j++) {
				if(tag.indexOf(selector) >= 0) {
					toshow.push(restaurant);
					break;
				}
			}
		});
	}else {
		$.each(allrestaurants,function(index,value){toshow.push(value);});
	}
	restaurantslist.empty();
	$.each(toshow,function(i,value){addRestaurantEntry(value)});
}

createlist("");


//OTHER Restaurant