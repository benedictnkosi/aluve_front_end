$(document).ready(function() {
	$("#login-form").submit(function(event) {
		event.preventDefault();
		login()
	});
});

function isEmptyOrSpaces(str) {
	return str === null || str.match(/^ *$/) !== null;
}


function login() {
	if (isEmptyOrSpaces($("#secret").val())) {
		showResErrorMessage("login", "Please enter pin")
		return;
	}

	$("#login_error_message_div").addClass("display-none");
	$("#login_success_message_div").addClass("display-none");

	$("body").addClass("loading");

	let url =  hostname + "/api/login/" + $("#secret").val();
	$.getJSON(url + "?callback=?", null, function(data) {
		$("body").removeClass("loading");
		if (data[0].result_code === 0) {
			sessionStorage.setItem("PROPERTY_ID", data[0].property_id);
			sessionStorage.setItem("PROPERTY_UID", data[0].property_uid);
			window.location.href = "/admin/admin.html";
		} else {
			showResErrorMessage("login", data[0].result_message)
		}
	});

}


