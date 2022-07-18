$(document).ready(function () {
    $("#contact_us_form").submit(function (event) {
        event.preventDefault();
    });

    $("#send_message").click(function (event) {
        event.preventDefault();
        sendMessage();
    });

    getPropertyId();
});

function getPropertyId(){
    let url = hostname + "/api/property/getid";
    $.getJSON(url + "?callback=?", null, function (data) {

    });
}
function sendMessage() {
    const guestName = $('#guestName').val();
    const email = $('#email').val();
    const phoneNumber = $('#phoneNumber').val();
    const message = $('#message').val();

    let url = hostname + "/api/property/contact/" + guestName + "/" + email + "/" + phoneNumber+ "/" + encodeURIComponent(message);
    $("body").addClass("loading");
    $("#success_message_div").addClass("display-none");
    $("#error_message_div").addClass("display-none");
    $.getJSON(url + "?callback=?", null, function (data) {
        $("body").removeClass("loading");
        $("#error_message_div").removeClass("display-none");
        if (data[0].result_code === 0) {
            $("#success_message_div").removeClass("display-none");
            $("#success_message").text(data[0].result_message)
        }else{
            $("#error_message_div").removeClass("display-none");
            $("#error_message").text(data[0].result_message)
        }
    });
}