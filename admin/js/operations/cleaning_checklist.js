$(document).ready(function() {
	$("#cleaning_rooms_select").change(function(event) {
		getCleaning(event.target.value);
	});
});

function loadCleaningPageData(){
	getRooms("cleaning_rooms_select");
}

function getCleaning(room) {
	let url =  hostname + "/api/cleanings/"+room;
	$("body").addClass("loading");
	$.ajax({
		type: "get",
		url: url,
		crossDomain: true,
		cache: false,
		dataType: "jsonp",
		contentType: "application/json; charset=UTF-8",
		success: function (data) {
			$("body").removeClass("loading");
			$("#cleaning-list").html(data.html);
		},
		error: function (xhr) {
			$("body").removeClass("loading");
			console.log("request for getCleaning  is " + xhr.status);
			if (!isRetry("getCleaning")) {
				return;
			}
			getCleaning(room);
		}
	});

}


