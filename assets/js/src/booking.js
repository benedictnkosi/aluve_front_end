$(document).ready(function () {

    $("#new-res-form").submit(function (event) {
        event.preventDefault();
    });

    if (document.referrer.includes("admin")) {
        $("#new-res-form").validate({
            // Specify validation rules
            rules: {
                guestName: "required",
                phoneNumber: "required",
                email: {
                    email: true
                }
            },
            submitHandler: function () {
                createReservation();
            }
        });
    }else{
        $("#new-res-form").validate({
            // Specify validation rules
            rules: {
                guestName: "required",
                phoneNumber: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            submitHandler: function () {
                createReservation();
            }
        });
    }

    $("#phoneNumber").blur(function () {
        if (document.referrer.includes("admin")) {
            getCustomer();
        }
    });

    $("body").addClass("loading");

    let date = new Date();
    let endDate = new Date(date.getTime());
    //get available rooms for today if previous date not set
    if (sessionStorage.getItem("checkInDate") == null) {
        endDate.setDate(date.getDate() + 1);
        const strToday = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        const strTomorrow = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
        sessionStorage.setItem('checkInDate', strToday);
        sessionStorage.setItem('checkOutDate', strTomorrow);
        getAvailableRooms(strToday, strTomorrow);
    } else {
        date = new Date(sessionStorage.getItem('checkInDate'));
        endDate = new Date(sessionStorage.getItem('checkOutDate'));
        $(this).val(sessionStorage.getItem('checkInDate') + ' - ' + sessionStorage.getItem('checkOutDate'));
        getAvailableRooms(sessionStorage.getItem('checkInDate'), sessionStorage.getItem('checkOutDate'));
    }

    //date picker
    $.getScript("https://cdn.jsdelivr.net/jquery/latest/jquery.min.js", function () {
        $.getScript("https://cdn.jsdelivr.net/momentjs/latest/moment.min.js", function () {
            $.getScript("https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js", function () {

                $('#checkindate').daterangepicker({
                    opens: 'left',
                    autoApply: false,
                    minDate: date
                }, function (start, end, label) {
                    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                });

                $('#checkindate').daterangepicker({startDate: date, endDate: endDate});

                $('#checkindate').on('apply.daterangepicker', function (event, picker) {
                    getAvailableRooms(picker.startDate.format("YYYY-MM-DD"), picker.endDate.format("YYYY-MM-DD"));
                    sessionStorage.setItem('checkInDate', picker.startDate.format("YYYY-MM-DD"));
                    sessionStorage.setItem('checkOutDate', picker.endDate.format("YYYY-MM-DD"));

                    let checkInDate = new Date(picker.startDate.format("YYYY-MM-DD"));
                    let checkOutDate = new Date(picker.endDate.format("YYYY-MM-DD"))
                    let difference = checkOutDate - checkInDate;
                    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
                    console.log("date diff is " + totalDays);
                    sessionStorage.setItem('numberOfNights', totalDays);
                });
            });
        });
    });
});


function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function displayTotal() {
    let numberOfNights = parseInt(sessionStorage.getItem('numberOfNights'));
    let total = 0;
    let nightsMessage = "";
    let roomIdArray = [];
    //find all rooms added
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === "Remove") {
            roomId = buttons[i].getAttribute("data-roomId");
            roomName = buttons[i].getAttribute("data-roomName");
            roomPrice = buttons[i].getAttribute("data-roomPrice");
            total += (numberOfNights * parseInt(roomPrice));
            nightsMessage += roomName + " - " + numberOfNights + " x nights @ R" + roomPrice + ".00" + "<br>";
            roomIdArray.push(roomId);
        }

    }

    if(total > 0){
        sessionStorage.setItem("isRoomSelected", "yes");
    }else{
        sessionStorage.removeItem("isRoomSelected");
    }
    sessionStorage.setItem("selected_rooms_array", JSON.stringify(roomIdArray));

    let totalMessage = "Total: R" + total + ".00";

    $('#total_message').html(totalMessage);
    $('#nights_message').html(nightsMessage);
}

function getAvailableRooms(checkInDate, checkOutDate) {
    let url = hostname + "/public/availablerooms/" + checkInDate + "/" + checkOutDate;
    $.getJSON(url + "?callback=?", null, function (data) {
        let roomIndex;
        $("#availableRoomsDropdown").html(data.html);
        const roomArray = [];
        const roomIdsArray = [];
        let room_id = "";
        $('.vodiapicker option').each(function () {
            var img = $(this).attr("data-thumbnail");
            var price = $(this).attr("data-price");
            room_id = $(this).attr("data-roomId");
            var sleeps = $(this).attr("data-sleeps");
            var room_name = this.innerText;
            if (price.localeCompare("0") === 0) {
                var item = '<li><img src="' + img + '" data-price="' + price + '" data-roomId="' + room_id + '" data-roomName="' + room_name + '"/><div class="div-select-room-name">' + room_name + '<div class="select_sleeps"><span class="fa fa-users">' + sleeps + ' Guests</span><span>ZAR ' + price + '</span></div></div>' +
                    '</li>';
            } else {
                var item = '<li><img src="' + img + '" data-price="' + price + '" data-roomId="' + room_id + '" data-roomName="' + room_name + '"/><div class="div-select-room-name">' + room_name + '<div class="select_sleeps"><span class="fa fa-users">' + sleeps + ' Guests</span><span>ZAR ' + price + '</span></div><button class="btn btn-style btn-secondary book mt-3 add-room-button" data-roomId="' + room_id + '" data-roomName="' + room_name + '" data-roomPrice="' + price + '">Add</button></div>' +
                    '</li>';
            }

            roomArray.push(item);
            roomIdsArray.push(room_id);
        })

        $('#a').html(roomArray);

//Set the button value to the first el of the array

        $(".b").css("display", "block");

        //check local storage for the lang
        const roomId = getUrlParameter("id");
        if (roomId) {
            //find an item with value of roomId
            roomIndex = roomIdsArray.indexOf(roomId);
            $('.btn-select').html(roomArray[roomIndex]);
            $('.btn-select').attr('value', roomId);
        } else {
            roomIndex = roomArray.indexOf('ch');
            console.log(roomIndex);
            $('.btn-select').html(roomArray[roomIndex]);
            $('.btn-select').attr('value', roomId);
        }
        let checkInDateDate = new Date(checkInDate);
        let checkOutDateDate = new Date(checkOutDate)
        let difference = checkOutDateDate - checkInDateDate;
        let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
        console.log("date diff is " + totalDays);
        sessionStorage.setItem('numberOfNights', totalDays);

        if (room_id.localeCompare("0") !== 0) {
            displayTotal();
        }

        $(".add-room-button").click(function (event) {
            event.preventDefault();
            if ($(this).text().localeCompare("Remove") === 0) {
                $(this).text("Add");
            } else {
                $(this).text("Remove");
            }

            displayTotal();
        });

        $("body").removeClass("loading");
    });
}

function createReservation() {
    $("#reservation_error_message_div").addClass("display-none");
    let isRoomSelected;
    if ($('#accept_terms').is(':checked')) {
        $("#reservation_error_message_div").addClass("display-none");
        const guestName = $('#guestName').val();
        const phoneNumber = $('#phoneNumber').val().trim().replaceAll(" ", "");
        const email = $('#email').val();
        const checkInDate = sessionStorage.getItem('checkInDate');
        const checkOutDate = sessionStorage.getItem('checkOutDate');

        if (guestName.length < 1) {
            $("#reservation_message").text("Please provide guest name")
            $("#reservation_error_message_div").removeClass("display-none");
            return;
        }
        if (phoneNumber.length < 1) {
            $("#reservation_message").text("Please provide guest phone number")
            $("#reservation_error_message_div").removeClass("display-none");
            return;
        }

        if (email.length > 0) {
            if (!isEmail(email)) {
                $("#reservation_message").text("The email format is invalid")
                $("#reservation_error_message_div").removeClass("display-none");
                return;
            }
        }

        isRoomSelected = sessionStorage.getItem("isRoomSelected");
        if (isRoomSelected === null) {
            $("#reservation_message").text("Please select a room")
            $("#reservation_error_message_div").removeClass("display-none");
            return;
        }

        $("body").addClass("loading");
        let url = hostname + "/public/reservations/create/" + sessionStorage.getItem("selected_rooms_array") + '/' + guestName + '/' + phoneNumber + '/' + checkInDate + '/' + checkOutDate + '/' + email;
        $.getJSON(url + "?callback=?", null, function (data) {
            $("body").removeClass("loading");
            if (data[0].result_code !== 0) {
                $("#reservation_message").text(data[0].result_message)
                $("#reservation_error_message_div").removeClass("display-none");
            } else {
                sessionStorage.setItem("reservation_id", JSON.stringify(data[0].reservation_id));
                window.location.href = "/confirmation.html";
            }
        });
    } else {
        $("#reservation_message").text("Please accept the terms and conditions")
        $("#reservation_error_message_div").removeClass("display-none");
    }
}

function getCustomer() {
    sessionStorage.setItem('customer_state', 'clear');
    $("#phoneNumber").val($("#phoneNumber").val().replaceAll(" ", ""));
    let url = hostname + "/public/guests/" + $("#phoneNumber").val();
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            if (response[0].result_code === 0) {
                $('#guestName').val(response[0].name);
                $('#email').val(response[0].email);
            }
        },
        error: function (xhr) {
            $("body").removeClass("loading");
            console.log("request for getCustomer is " + xhr.status);

        }
    });

}