$(document).ready(function() {
	console.log("ready!");
	getBlockedRooms();

	getBlockRooms();

	$("#block-form").validate({
		// Specify validation rules
		rules: {
			block_notes: "required"
		},
		// Specify validation error messages
		messages: {
			block_notes: "Please enter notes",
		}
	});

	$("#block-form").submit(function (event) {
		event.preventDefault();
		blockRoom();
	});

	$.getScript("https://cdn.jsdelivr.net/jquery/latest/jquery.min.js", function(){
		$.getScript("https://cdn.jsdelivr.net/momentjs/latest/moment.min.js", function(){
			$.getScript("https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js", function(){
				const date = new Date();

				$('input[name="block_date"]').daterangepicker({
					opens: 'left',
					autoApply:true,
					minDate: date
				}, function(start, end, label) {
					console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
				});
			});
		});
	});

$(".filter-block-room-tabs").click(function(event) {
	filterBlockedRoomsTabs(event);
	});
	
});


function getBlockedRooms() {
	let url =  hostname + "/api/blockedroom/get/" + sessionStorage.getItem("PROPERTY_UID");
	$.ajax({
		type: "get",
		url: url,
		crossDomain: true,
		cache: false,
		dataType: "jsonp",
		contentType: "application/json; charset=UTF-8",
		success: function (data) {
			$("#block-list").html(data.html);
			$(".deleteBlockRoom").click(function(event) {
				deleteBlockRoom(event);
			});
		},
		error: function (xhr) {
			console.log("request for getBlockedRooms is " + xhr.status);
			if (xhr.status > 400) {
				getBlockedRooms();
			}
		}
	});
}

function deleteBlockRoom(event) {
	const id = event.target.id.replace("delete_blocked_", "");
	let url =  hostname + "/api/blockedroom/delete/" +  id;
	$.ajax({
		type: "get",
		url: url,
		crossDomain: true,
		cache: false,
		dataType: "jsonp",
		contentType: "application/json; charset=UTF-8",
		success: function (response) {
			const jsonObj = response[0];
			if (jsonObj.result_code === 0) {
				getCalendar("future");
				getBlockedRooms();
			}
		},
		error: function (xhr) {
			console.log("request for deleteBlockRoom is " + xhr.status);
			if (xhr.status > 400) {
				getOverallOccupancy(period, elementId)
			}
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
