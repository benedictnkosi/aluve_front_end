$(document).ready(function () {

    getAllRooms();

    //get available rooms for today
    const date = new Date();
    const tomorrow = new Date(date.getTime());
    tomorrow.setDate(date.getDate() + 2);
    const strToday = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const strTomorrow = tomorrow.getFullYear() + "-" + (tomorrow.getMonth() + 1) + "-" + tomorrow.getDate();
    sessionStorage.setItem('checkInDate', strToday);
    sessionStorage.setItem('checkOutDate', strTomorrow);

    //date picker
    $.getScript("https://cdn.jsdelivr.net/jquery/latest/jquery.min.js", function () {
        $.getScript("https://cdn.jsdelivr.net/momentjs/latest/moment.min.js", function () {
            $.getScript("https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js", function () {

                $('#rooms_checkindate').daterangepicker({
                    opens: 'right',
                    autoApply: false,
                    minDate: date,
                    autoUpdateInput: false,
                }, function (start, end, label) {
                    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                });

                $('#rooms_checkindate').on('apply.daterangepicker', function (event, picker) {
                    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
                    sessionStorage.setItem('checkInDate', picker.startDate.format("YYYY-MM-DD"));
                    sessionStorage.setItem('checkOutDate', picker.endDate.format("YYYY-MM-DD"));
                    filterRooms(picker.startDate.format("YYYY-MM-DD"), picker.endDate.format("YYYY-MM-DD"));
                });
            });
        });
    });

});

function getAllRooms() {
    $("body").addClass("loading");
    let url = hostname + "/public/allrooms/";
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#rooms_parent_div").html(data.html);
            $("body").removeClass("loading");
        },
        error: function (xhr) {
            console.log("request for getConfigRooms is " + xhr.status);
            let count = 0;
            if (xhr.status > 400) {
                if (!isRetry("getAllRooms")) {
                    return;
                }
                getAllRooms();
            }
        }
    });
}

function filterRooms(checkIn, checkOut) {
    $("body").addClass("loading");
    let url = hostname + "/public/roomspage/" + checkIn + "/" + checkOut;
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#rooms_parent_div").html(data.html);
            $("body").removeClass("loading");
        },
        error: function (xhr) {
            console.log("request for getConfigRooms is " + xhr.status);
            $("body").removeClass("loading");
            if (xhr.status > 400) {
                if (!isRetry("filterRooms")) {
                    return;
                }
                filterRooms(checkIn, checkOut);
            }
        }
    });

}
