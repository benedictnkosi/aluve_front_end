$(document).ready(function() {
	getCalendar();
});


function getCalendar() {
	let url =  hostname + "/api/calendar";
	$.ajax({
		type: "get",
		url: url,
		crossDomain: true,
		cache: false,
		dataType: "jsonp",
		contentType: "application/json; charset=UTF-8",
		success: function (data) {
			$("#calendar-table").html(data.html);
			$(".booked").click(function(event) {
				jumpToBooking(event);
			});
		},
		error: function (xhr) {
			console.log("request for getCalendar is " + xhr.status);
			if (xhr.status > 400) {
				getCalendar();
			}
		}
	});
}


function jumpToBooking(event) {
	let $reservation_id = event.target.getAttribute("resid");
	updateView("upcoming-reservations");
	$([document.documentElement, document.body]).animate({
        scrollTop: $("a:contains('" +$reservation_id +"')").offset().top
    }, 2000);
	$("a:contains('" +$reservation_id +"')").fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);
	
}



