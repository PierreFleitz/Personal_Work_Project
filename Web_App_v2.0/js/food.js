var pastday = 0;
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var today = new Date();
var dd = "" + (today.getDate()-pastday).toString();
var dayname = days[today.getDate()-pastday];
if(dd.length < 2) {
	dd = "0" + dd;
}
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var todayStr = yyyy + "-" + mm + "-" + dd;

var allrestaurants = [];
var restaurantslist = $('#restaurants');
var debugtext = $('#debugtext');


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
	return "<li class='list-group-item'><a href='#'><strong>" + meal.title + "<br></strong>" + meal.description + "</a></li>";
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
	console.log(qurl);
	var xmlString = data.results[0];
	var menu = $(xmlString).find("table")[0];
	for (var i = 0, row; row = menu.rows[i]; i++) {
		
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
					var meal = {"title":"", "description":col.innerHTML};
					q_json.meals.push(meal);
				}
				
			}
		}	
	}
}

//Nymble
var nymble_json = restaurantToJSON("Nymble",["nymble","kth"]);
allrestaurants.push(nymble_json);
var nymble_url = "http://ths.kth.se/om-ths/restaurang-cafe/restaurang-nymble-meny/";
  
//console.log(dayname);
// Create a YQL query to get data for the meal
var yql__nymble_query = "SELECT * from html WHERE url='" + nymble_url + "' and xpath=\"//p[strong=\'" + dayname +"\n\' or strong=\'Vegetarian of the week\n\' or strong=\'Fish of the week\n\' or strong=\'Salad\n\']\";"; //
var nymble_query = BASE_URI + toQueryString({q: yql__nymble_query, format: 'xml',callback: 'parseNymbleCallback'});
// Using YQL and JSONP
$.ajax({
	type:'GET',
	url: nymble_query,
});

function parseNymbleCallback(data) {
	//console.log(nymble_query)
	var xmlString = data.results;

	$.each(xmlString, function(index,obj) {

		var reg = /<strong>(.*?)<br\/>/g;
		var match =reg.exec(obj);
		var title = match[1];
		
		//first meal
		reg = /<\/strong>[\n]*(.*?)</g;
		match = reg.exec(obj);
		var description = match[1];
		
		//possible second meal
		reg = /<br\/>[\n]*(.*?)<\/p>/g;
		match = reg.exec(obj);
		var description2 = match[1];
		
		title = title==dayname ? "" : title;
		var meal = {"title":title, "description": description};
		nymble_json.meals.push(meal);
		if(description2.indexOf(description) < 0) {
			var meal2 = {"title":title, "description": description2};
			nymble_json.meals.push(meal2);
		}
	});
}

function createlist() {
	var selector = $('#meal_filter').val().toLowerCase();
	var toshow = [];
	if(selector != "") {
		$.each(allrestaurants,function(index, restaurant){
			var added = false;
			//restaurant tags match filter
			for (var j = 0, tag; tag = restaurant.tags[j]; j++) {
				if(tag.indexOf(selector) >= 0) {
					toshow.push(restaurant);
					added = true;
					break;
				}
			}
			//restaurant meal match filter
			if(!added){
				var filteredmeal = restaurantToJSON(restaurant.name,restaurant.tags);
				$.each(restaurant.meals,function(index, meal) {
					if(meal.title.toLowerCase().indexOf(selector) >= 0 || meal.description.toLowerCase().indexOf(selector) >= 0){
						filteredmeal.meals.push(meal);
					}
				});
				if(filteredmeal.meals.length != 0 && !added) {
					toshow.push(filteredmeal);
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