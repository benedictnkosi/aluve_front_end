$(document).ready(function () {
    let reservationIdArray = JSON.parse(sessionStorage.getItem("reservation_id"));
    let message;
    if (reservationIdArray.length > 1) {
        $('#viewReservation').css("display", "none");
        message = "Thank you for your reservations ( ";
        reservationIdArray.forEach(element => message += "#" + element + " ");
        message += ")";
        $('#thank_message').html(message);
    } else {
        $('#thank_message').html("Thank you for your reservation (#" + sessionStorage.getItem("reservation_id").replace('[','').replace(']', '') + ")");
    }


    $('#viewReservation').click(function(){
        window.open(
            "/invoice.html?id=" + sessionStorage.getItem("reservation_id").replace('[','').replace(']', ''),
            '_blank' // <- This is what makes it open in a new window.
        );
    });
});