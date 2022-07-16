$(document).ready(function() {
	getRooms("cleaning_rooms_select")
	$("#cleaning_rooms_select").change(function(event) {
		getCleaning(event.target.value);
	});
});

function getCleaning(room) {
	let url =  hostname + "/api/cleanings/"+room;
	$.getJSON(url + "?callback=?", null, function(data) {
		$("#cleaning-list").html(data.html);
	});
}


