$(document).ready(function() {

});

function blockRoom() {
	const block_date = $("#block_date").val().replaceAll("/","-");
	const block_room = $("#block_rooms_select").val();
	const block_note = $("#block_notes").val().trim();

	if(block_room.localeCompare("none") ===0){
		showResErrorMessage("block", "Select Room")
		return;
	}

	if(block_note.length < 1){
		showResErrorMessage("block", "Please provide notes")
		return;
	}

	$("body").addClass("loading");

	let url =  hostname + "/api/blockroom/"+ block_room+ "/" + block_date + "/"+ block_note;
	$.getJSON(url + "?callback=?", null, function(data) {
		$("body").removeClass("loading");
		const jsonObj = data[0];
		if (jsonObj.result_code === 0) {
			showResSuccessMessage("block", jsonObj.result_message)
			getCalendar("future");
			getBlockedRooms();
		} else {
			showResErrorMessage("block", jsonObj.result_message)
		}

	});

}

function getBlockRooms() {
	getRooms("block_rooms_select");
}




