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