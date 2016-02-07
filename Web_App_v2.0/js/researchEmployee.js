	function researchEmployee(val2search){
		 //YQL stuff..
		var BASE_URI = 'http://query.yahooapis.com/v1/public/yql?q=';  
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

		var KTHsearch_URL = "\'https%3A%2F%2Fwww.kth.se%2Fsearch%2Fsearch%3Fentity%3Dkth-profile%26filterlabel%3DEmployees%3Fl=en%26q%3D"+val2search+"\'";
		var option_URL = "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		var yql_employee_query = "select * from data.headers where url=" + KTHsearch_URL; //
		var employee_query = BASE_URI + yql_employee_query + option_URL;

		// Using YQL and JSONP
		$.ajax({
			type:'GET',
			url: employee_query,
			success: function(data){
				parseResultCallback(data,val2search);
			}
			
		});

		function parseResultCallback(data,valField) {
			$("#resultatsArea").empty();
			$("#nbOfRes").empty();
			var htmlText = data.query.results.resources.content;
			var el = $(htmlText);
			var numRes = parseInt(nbOfResultats(el));
			console.log(numRes);
			if(numRes==0){
				$("#nbOfRes").append("<h4>No result found for "+valField+"<\h4>");
			}
			else if(numRes==1){
				$("#nbOfRes").append("<h4>1 result found for "+valField+"<\h4>");
				parseEmployee(el);
			}
			else if(numRes>1 && numRes<11){
				$("#nbOfRes").append("<h4>"+numRes+" results found for "+valField+"<\h4>");
				parseEmployee(el);
			}
			else{
				$("#nbOfRes").append("<h4>About "+numRes+" results found for "+valField+"<br>"+
									"Only 10 have been displayed<\h4>");		
				parseEmployee(el);
			}
			//var found = $("#resultHitsSlot-0",el).html();
			//document.getElementById("resultatsArea").innerHTML = found;
			//var moreRes = $(".pagingContainer",el).html();
			//document.getElementById("moreResults").innerHTML = moreRes;
		}
		};
		
	function nbOfResultats(el){
			var nbRes_obj = $(".nrOfHits",el).html();
			var reg = /[0-9]+/g;
			var match = reg.exec(nbRes_obj);
			var nbRes = match.toString();
			return nbRes;
		
	}	
	
	
	function parseEmployee(data){
			console.log("go");
			var emptyImage = "/search/assets/images/missing-profile-image.png";

			//console.log(toDisplay);
			
			$(".result",data).each(function(index,obj){
				//Get the url of the person
				var url_employee = $(".uri",obj).attr("href");
				console.log(url_employee);
				
				//Get the name
				var name_employee;
				var name_employee_obj = $(".uri",obj).html();
				var reg = /<b>.*/g;
				var match = reg.exec(name_employee_obj);
				if(match==null){
					name_employee = name_employee_obj;
				}
				else{
					var name_employee = match.toString();
				};
				console.log(name_employee);
				
				//Get the image and check if it exists
				var image_employee = $(".resultImage",obj).attr("src");
				var noImage = (image_employee==emptyImage);
				if (noImage){
					image_employee="img/missing-profile-image.png";
				};
				console.log(noImage);
				
				//Get the office
				var value_title_employee = $(".value.title",obj).html();
				var value_title_url = $(".value.title",obj).parent().attr("href");
				console.log(value_title_employee);
				console.log(value_title_url);
				
				//Get the email and the mailto
				var email_employee_obj = $(".value.eMail",obj).html();
				var reg = /[a-zA-Z]*@[a-zA-Z\.]*.se/g;
				var match = reg.exec(email_employee_obj);
				var email_employee = match.toString();
				var mailto_employee = "mailto:"+email_employee;
				console.log(email_employee);
				console.log(mailto_employee);
				
				//Get phone number and phone url
				var phone_number = "";
				var phone_number_url = "";
				var phone_number_obj = $(".value.phone",obj).html();
				reg = />[\+0-9][0-9\ ]*<span class="extension">[0-9\ ]*<\/span>|>0[0-9]*/g;
				match = reg.exec(phone_number_obj);
				console.log(match);
				if(match!=null){
					phone_number = match.toString().substr(1,match.toString().length-1);
					reg = /tel:[\+0-9][0-9]*/g;
					match = reg.exec(phone_number_obj);
					phone_number_url = match.toString();
				};
				console.log(phone_number);
				console.log(phone_number_url);
				
				$("#resultatsArea").append(
				"<div class='container'>"+
					"<li><a class='co-lg-2 text-center' href='"+url_employee+"'><font size='4'>"+name_employee+"</font></a></li>"+
					"<div class='col-sm-8 text-left'><font size='3'>"+
						"<p> Work for:\t<a href='"+value_title_url+"'>"+value_title_employee+"</a><br>"+
						"e-mail:\t<a href="+"mailto"+">"+email_employee+"</a><br>"+
						"Phone:\t<a href="+phone_number_url+">"+phone_number+"</a>"+
					"</font></div>"+
					"<div class='col-sm-4 text-right'>"+
						"<img src="+image_employee+" alt='No Available Picture' height='100' width='100'></img>"+
					"</div>"+
				"</div>"+
				"<br><br>"); //col-xs-8 text-left' col-xs-pull-5
				
				//console.log($(".listResult",toDisplay).html());
				
				//document.getElementById("resultatsArea").innerHTML = '<p>'+name_employee+'</p>';		
				
				
			})
		
		
	};