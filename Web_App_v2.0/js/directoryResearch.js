	$(document).ready(function(){
	if ($("#kth-q").val() != "") {
	$("#kth-clearButton").addClass("visible");
	$("#kth-clearButton").disabled=false;
	$("#kth-searchFieldset").addClass("hasText");
	}		
	$("#kth-clearButton").click(function(e){
	$("#kth-q").val("");
	$(this).removeClass("visible");
	$('#kth-searchFieldset').removeClass('hasText');
	e.preventDefault();
	$('#kth-q').focus();
	});
	$("#kth-q").on("keyup", function(e) {
	if ($("#kth-q").val() != "") {
	$("#kth-clearButton").addClass("visible");
	$("#kth-searchFieldset").addClass("hasText");
	} else {
	$("#kth-clearButton").removeClass("visible");
	}
	});
	$("#kth-searchButton").click(function(e){
	researchEmployee($("#kth-q").val());
	console.log($("#kth-q").val());
	});
	
	
	});