$(document).ready(function() {
	console.log("ready!");
	getBlockedRooms();

$(".filter-block-room-tabs").click(function(event) {
	filterBlockedRoomsTabs(event);
	});
	
});


function getBlockedRooms() {
	let url =  hostname + "/api/blockedroom/get";
	$.getJSON(url + "?callback=?", null, function(data) {
		$("#block-list").html(data.html);
		$(".deleteBlockRoom").click(function(event) {
			deleteBlockRoom(event);
		});
	});
}

function deleteBlockRoom(event) {
	const id = event.target.id.replace("delete_blocked_", "");

	let url =  hostname + "/api/blockedroom/delete/" +  id;
	$.getJSON(url + "?callback=?", null, function(data) {
		const jsonObj = response[0];
		if (jsonObj.result_code === 0) {
			getCalendar("future");
			getBlockedRooms();
		}
	});
}

function filterBlockedRoomsTabs(event) {
	var id = event.currentTarget.id;
	$('.blocked_rooms_tab').addClass("display-none");

	switch (id) {
		case "view_blocked_rooms_tab":
			$('#block-list').removeClass("display-none");
			break;
		case "block_a_room_tab":
			$('#div-block-room').removeClass("display-none");
			break;
		default:
		// code block
	}
}
