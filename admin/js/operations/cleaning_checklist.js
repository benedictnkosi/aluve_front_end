$(document).ready(function() {
	getRooms("cleaning_rooms_select")
	$("#cleaning_rooms_select").change(function(event) {
		getCleaning(event.target.value);
	});
});

function getCleaning(room) {
	let url =  hostname + "/api/cleanings/"+room;

	$.ajax({
		type: "get",
		url: url,
		crossDomain: true,
		cache: false,
		dataType: "jsonp",
		contentType: "application/json; charset=UTF-8",
		success: function (data) {
			$("#cleaning-list").html(data.html);
		},
		error: function (xhr) {
			console.log("request for getCleaning  is " + xhr.status);
			if (!isRetry("getCleaning")) {
				return;
			}
			getCleaning(room);
		}
	});

}


