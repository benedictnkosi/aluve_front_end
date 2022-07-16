$(document).ready(function() {
	console.log("ready!");
	getNotifications();
});

function getNotifications() {
	let url =  hostname +  "/api/notifications";
	$.getJSON(url + "?callback=?", null, function(data) {
		$("#notifications-list").html(data.html);
		const numNotifications = $('.notification_message').length;
		if(numNotifications > 0){
			$("#notification_count").text(numNotifications);
			$("#notification_count").addClass("badge-red");
			$("#notification_count").removeClass("badge-green");
		}else{
			$("#notification_count").text("0");
			$("#notification_count").removeClass("badge-red");
			$("#notification_count").addClass("badge-green");
		}
	});

}