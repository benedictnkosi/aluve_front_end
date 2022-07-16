$(document).ready(function() {
	console.log("ready!");
	getStatsForToday();
	//get day of month
	var d = new Date();
	var date = d.getDate();
	getOverallOccupancy("30", "overall-30-occupancy");
	getOverallOccupancy(date, "overall-month-occupancy");
	getOccupancyPerRoom("30");

	$(".glyphicon-log-in").click(function() {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#reservations-list").offset().top
		}, 2000);
	});

	$(".glyphicon-log-out").click(function() {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#checkouts-list").offset().top
		}, 2000);
	});

	$(".glyphicon-briefcase").click(function() {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#stayOver-list").offset().top
		}, 2000);
	});

	$('#occupancy_days').change(function (event) {
		const days = $('#occupancy_days').val();
		getOverallOccupancy(days, "overall-30-occupancy");
		getOccupancyPerRoom(days);
	});

});


function getStatsForTomorrow() {
	$('#today-tomorrow').text("TOMORROW");
	getcheckins("tomorrow");
	getcheckouts("tomorrow");
	getstayovers("tomorrow");
}


function getStatsForToday() {
	$('#today-tomorrow').text("TODAY");

	getcheckins("today");
	getcheckouts("today");
	getstayovers("today");
}

function getcheckins(period) {
	let url =  hostname +  "/api/stats/getreservationcount/checkIn/"+period;
	$.getJSON(url + "?callback=?", null, function(data) {
		if (data[0].result_code === 0) {
			$('#stats_checkin_count').text(data[0].count);
		}
	});
}


function getcheckouts(period) {
	let url =  hostname +  "/api/stats/getreservationcount/checkOut/" + period;
	$.getJSON(url + "?callback=?", null, function(data) {
		if (data[0].result_code === 0) {
			$('#stats_checkout_count').text(data[0].count);
		}
	});
}


function getstayovers(period) {
	let url =  hostname +  "/api/stats/getstayovercount/" + period;
	$.getJSON(url + "?callback=?", null, function(data) {
		if (data[0].result_code === 0) {
			$('#stats_overstays_count').text(data[0].count);
		}
	});
}


function getOverallOccupancy(period, elementId) {
	let url =  hostname +  "/api/occupancy/" + period;
	$.getJSON(url + "?callback=?", null, function(data) {
		const jsonObj = data[0];
		if (jsonObj.result_code === 0) {
			$('#' + elementId).text(jsonObj.occupancy);
		}
	});
}

function getOccupancyPerRoomForMonth() {
	var myDate = new Date();
	var dayOfmonth = myDate.getDate();
	getOccupancyPerRoom(dayOfmonth)

}


function getOccupancyPerRoom(period) {
	let url =  hostname + "/api/occupancy/perroom/" + period ;
	$.getJSON(url + "?callback=?", null, function(data) {
		$("#occupancy-div").html(data.html);
	});
}




