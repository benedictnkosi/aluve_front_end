$(document).ready(function () {
    refreshReservations();

    $('.filter-reservations').unbind('click')
    $(".filter-reservations").click(function (event) {
        filterReservations(event);
    });
});

function refreshReservations() {
    let url = hostname + "/api/reservations/future";
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#reservations-list").html(data.html);
            let url = hostname + "/api/reservations/stayover";
            $.ajax({
                type: "get",
                url: url,
                crossDomain: true,
                cache: false,
                dataType: "jsonp",
                contentType: "application/json; charset=UTF-8",
                success: function (data) {
                    $("#stayOver-list").html(data.html);
                    let url = hostname + "/api/reservations/checkout";
                    $.ajax({
                        type: "get",
                        url: url,
                        crossDomain: true,
                        cache: false,
                        dataType: "jsonp",
                        contentType: "application/json; charset=UTF-8",
                        success: function (data) {
                            $("#checkouts-list").html(data.html);
                            let url = hostname + "/api/reservations/past";
                            $.ajax({
                                type: "get",
                                url: url,
                                crossDomain: true,
                                cache: false,
                                dataType: "jsonp",
                                contentType: "application/json; charset=UTF-8",
                                success: function (data) {
                                    $("#past-res-list").html(data.html);
                                    let url = hostname + "/api/reservations/pending";
                                    $.ajax({
                                        type: "get",
                                        url: url,
                                        crossDomain: true,
                                        cache: false,
                                        dataType: "jsonp",
                                        contentType: "application/json; charset=UTF-8",
                                        success: function (data) {
                                            $("#pending-res-list").html(data.html);
                                        },
                                        error: function (xhr) {
                                            console.log("request for refreshReservations is " + xhr.status);
                                            if (xhr.status > 400) {
                                                refreshReservations();
                                            }
                                        }
                                    });
                                },
                                error: function (xhr) {
                                    console.log("request for refreshReservations is " + xhr.status);
                                    if (xhr.status > 400) {
                                        refreshReservations();
                                    }
                                }
                            });
                        },
                        error: function (xhr) {
                            console.log("request for refreshReservations is " + xhr.status);
                            if (xhr.status > 400) {
                                refreshReservations();
                            }
                        }
                    });
                },
                error: function (xhr) {
                    console.log("request for refreshReservations is " + xhr.status);
                    if (xhr.status > 400) {
                        refreshReservations();
                    }
                }
            });
        },
        error: function (xhr) {
            console.log("request for refreshReservations is " + xhr.status);
            if (xhr.status > 400) {
                refreshReservations();
            }
        }
    });
}

function setBindings() {
    $('.changeBookingStatus').unbind('click')
    $(".changeBookingStatus").click(function (event) {
        changeBookingStatus(event);
    });

    $.getScript("js/jquery.timepicker.min.js", function () {
        $('.time-picker').timepicker({
            'minTime': '8:00',
            'maxTime': '23:00',
            'showDuration': false,
            'timeFormat': 'H:i'
        });
    });

    $.getScript("https://cdn.jsdelivr.net/jquery/latest/jquery.min.js", function () {
        $.getScript("https://cdn.jsdelivr.net/momentjs/latest/moment.min.js", function () {
            $.getScript("https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js", function () {
                $('input[name="check_in_date"]').daterangepicker({
                    opens: 'left',
                    autoApply: true
                }, function (start, end, label) {
                    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
                });

                $('input[name="check_in_date"]').on('apply.daterangepicker', function (event, picker) {
                    updateCheckInDate(event, picker.startDate.format('YYYY-MM-DD'), picker.endDate.format('YYYY-MM-DD'));
                });

                $('input[name="check_in_date"]').on('show.daterangepicker', function (event, picker) {
                    localStorage.setItem('original_check_in_date', picker.startDate.format('MM/DD/YYYY'));
                    localStorage.setItem('original_check_out_date', picker.endDate.format('MM/DD/YYYY'));
                });


            });
        });
    });

    $('.check_in_time_input').unbind('change')
    $(".check_in_time_input").change(function (event) {
        updateCheckInOutTime(event, "check_in_time")
    });

    $('.check_out_time_input').unbind('change')
    $(".check_out_time_input").change(function (event) {
        updateCheckInOutTime(event, "check_out_time")
    });

    $('.reservation_room_input').unbind('change')
    $(".reservation_room_input").change(function (event) {
        const roomId = $(this).find(':selected').val()
        updateReservationRoom(event, roomId)
    });

    $('.blockGuest').unbind('click')
    $(".blockGuest").click(function (event) {
        blockGuest(event);
    });

    $('.phone_number_input').unbind('change')
    $(".phone_number_input").change(function (event) {
        captureGuestPhoneNumber(event);
    });

    $('.image_verified').off();
    $('.image_verified').on('click', function (event) {
        var customerID = event.target.id.replace("img_upload_", "");
        $(".uploadImageInput").click();
        $("#customer_image_id").val(customerID);
    });

    $('.NotCheckedIn').unbind('click')
    $(".NotCheckedIn").click(function (event) {
        markReservationAsCheckedInOut(event, "checked_in");
    });

    $('.res_add_payment').unbind('click')
    $(".res_add_payment").click(function (event) {
        addPayment(event);
    });

    $('.res_add_guest_id').unbind('click')
    $(".res_add_guest_id").click(function (event) {
        addGuestID(event);
    });

    $('.res_add_note').unbind('click')
    $(".res_add_note").click(function (event) {
        addNote(event);
    });

    $('.res_mark_cleaned').unbind('click')
    $(".res_mark_cleaned").click(function (event) {
        markAsCleaned(event);
    });

    $('.res_block_guest').unbind('click')
    $(".res_block_guest").click(function (event) {
        blockGuest(event);
    });

    $('.res_add_add_on').unbind('click')
    $(".res_add_add_on").click(function (event) {
        addAddOn(event);
    });

    $('.reservations_actions_link').unbind('click')
    $(".reservations_actions_link").click(function (event) {
        showRightDivForMobile(event);
    });
}

function showRightDivForMobile(event) {
    let reservationID = event.target.getAttribute("data-res-id");
    $('.right-div').css("display", "none");
    $('#right-div-' + reservationID).css("display", "block");
}

function changeBookingStatus(event) {
    var data = {};
    var newButtonText = "";
    data["field"] = "status";

    var className = $('#' + event.target.id).attr('class');

    if (className.includes("glyphicon-triangle-top")) {
        data["new_value"] = "pending";
        $('#' + event.target.id).toggleClass("glyphicon-triangle-top");
        $('#' + event.target.id).toggleClass("glyphicon-triangle-bottom");
    } else if (className.includes("glyphicon-triangle-bottom")) {
        data["new_value"] = "confirmed";
        $('#' + event.target.id).toggleClass("glyphicon-triangle-top");
        $('#' + event.target.id).toggleClass("glyphicon-triangle-bottom");
    } else if (className.includes("glyphicon-remove")) {
        data["new_value"] = "cancelled";
        $('#' + event.target.id).toggleClass("glyphicon-remove");
        $('#' + event.target.id).toggleClass("glyphicon-ok");
    } else if (className.includes("glyphicon-ok")) {
        data["new_value"] = "confirmed";
        $('#' + event.target.id).toggleClass("glyphicon-remove");
        $('#' + event.target.id).toggleClass("glyphicon-ok");
    }

    if (className.includes("glyphicon-triangle")) {
        data["reservation_id"] = event.target.id.replace("changeBookingStatus_", "");
    } else {
        data["reservation_id"] = event.target.id.replace("cancelBooking_", "");
    }


    $("body").addClass("loading");
    let url = hostname + "/api/reservations/" + data["reservation_id"] + "/update/status/" + data["new_value"];
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        if (response[0].result_code === 0) {
            $("#" + event.target.id).val(newButtonText);
            getCalendar("future");
            refreshReservations();
            showResSuccessMessage("reservation", response[0].result_message);
        } else {
            showResErrorMessage("reservation", jsonObj.result_message);
        }
    });
}

function blockGuest(event) {
    const res_id = event.target.id.replace("block_guest_button_", "");
    const article = document.querySelector('#block_guest_button_' + res_id);
    if (!$("#block_note_" + article.dataset.resid).val()) {
        $("#block_note_" + article.dataset.resid).removeClass("display-none");
    } else {
        const note = $("#block_note_" + article.dataset.resid).val();
        $("body").addClass("loading");
        let url = hostname + "/api/reservation/" + res_id + "/blockguest/" + note;
        $.getJSON(url + "?callback=?", null, function (response) {
            $("body").removeClass("loading");
            $("#res_message_div_" + event.target.id).removeClass("display-none");

            if (response[0].result_code === 0) {
                refreshReservations();
                showResSuccessMessage("reservation", response[0].result_message);
            } else {
                showResErrorMessage("reservation", response[0].result_message);
            }
        });
    }

}

function filterReservations(event) {
    var id = event.currentTarget.id;
    $('.reservations_tabs').addClass("display-none");

    switch (id) {
        case "reservations_all":
            $('#reservations-list').removeClass("display-none");
            $('#reservations-heading').text("Upcoming Reservations");
            break;
        case "reservations_checkouts":
            $('#checkouts-list').removeClass("display-none");
            $('#reservations-heading').text("Check Outs");
            break;
        case "reservations_stay_overs":
            $('#stayOver-list').removeClass("display-none");
            $('#reservations-heading').text("Stay Overs");
            break;
        case "reservations_past_reservations":
            $('#past-res-list').removeClass("display-none");
            $('#reservations-heading').text("Past Reservations");
            break;
        case "reservations_pending_reservations":
            $('#pending-res-list').removeClass("display-none");
            $('#reservations-heading').text("Pending Reservations");
            break;
        default:
        // code block
    }
}

function markReservationAsCheckedInOut(event, status) {
    let reservationID = event.target.getAttribute("reservation_id");
    $("body").addClass("loading");

    let url = hostname + "/api/reservations/" + reservationID + "/update/check_in_status/" + status;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        if (response[0].result_code === 0) {
            refreshReservations();
            showResSuccessMessage("reservation", response[0].result_message);
        } else {
            refreshReservations();
            showResErrorMessage("reservation", response[0].result_message);
        }
    });


}

function captureGuestPhoneNumber(event) {
    let guestID = event.target.getAttribute("customer_id");
    const phoneNumber = event.target.value.trim();
    if (phoneNumber.length < 10) {
        return;
    }

    $("body").addClass("loading");
    let url = hostname + "/api/guests/" + guestID + "/phone/" + phoneNumber;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        const jsonObj = response[0];
        if (jsonObj.result_code === 0) {
            refreshReservations();
            showResSuccessMessage("reservation", response[0].result_message);
        } else {
            showResErrorMessage("reservation", response[0].result_message);
        }
    });
}

function updateCheckInOutTime(event, $field) {
    let reservationID = event.target.getAttribute("data-res-id");
    let checkinTime = event.target.value;
    $("body").addClass("loading");

    let url = hostname + "/api/reservations/" + reservationID + "/update/" + $field + "/" + checkinTime;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        var jsonObj = response[0];
        if (jsonObj.result_code === 0) {
            refreshReservations();
            showResSuccessMessage("reservation", response[0].result_message);
        } else {
            showResErrorMessage("reservation", response[0].result_message);
        }
    });
}

function updateCheckInDate(event, checkInDate, checkOutDate) {
    let reservationID = event.target.getAttribute("data-res-id");
    $("body").addClass("loading");

    let url = hostname + "/api/reservations/" + reservationID + "/update/dates/" + checkInDate + "/" + checkOutDate;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        var jsonObj = response[0];
        if (jsonObj.result_code === 0) {
            refreshReservations();
            showResSuccessMessage("reservation", response[0].result_message);
        } else {
            refreshReservations();
            showResErrorMessage("reservation", response[0].result_message);
        }
    });
}

function updateReservationRoom(event, roomId) {
    let reservationID = event.target.getAttribute("data-res-id");
    $("body").addClass("loading");

    let url = hostname + "/api/reservations/" + reservationID + "/update_room/" + roomId;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        var jsonObj = response[0];
        if (jsonObj.result_code === 0) {
            refreshReservations();
            showResSuccessMessage("reservation", response[0].result_message);
        } else {
            refreshReservations();
            showResErrorMessage("reservation", response[0].result_message);
        }
    });
}

function markAsCleaned(event) {
    const id = event.target.id.replace("mark_cleaned_button_", "");
    if ($("#div_mark_cleaned_" + id).hasClass("display-none")) {
        $("#div_mark_cleaned_" + id).removeClass("display-none");
    } else {
        const employee_id = $("#select_employee_" + id).val();

        if (employee_id.localeCompare("none") === 0) {
            showResErrorMessage("reservation", "Please select cleaner");
            return;
        }

        $("body").addClass("loading");
        let url = hostname + "/api/cleaning/" + id + "/cleaner/" + employee_id;
        $.getJSON(url + "?callback=?", null, function (response) {
            $("body").removeClass("loading");

            if (response[0].result_code === 0) {
                refreshReservations();
                showResSuccessMessage("reservation", response[0].result_message);
            } else {
                showResErrorMessage("reservation", response[0].result_message);
            }
        });
    }
}

function addAddOn(event) {
    const id = event.target.id.replace("add_add_on_button_", "");
    if ($("#div_add_on_" + id).hasClass("display-none")) {
        $("#div_add_on_" + id).removeClass("display-none");
    } else {
        const add_on_id = $("#select_add_on_" + id).val();
        const quantity = $("#add_on_quantity_" + id).val();

        if (add_on_id.localeCompare("none") === 0) {
            showResErrorMessage("reservation", "Please select an add on");
            return;
        }

        $("body").addClass("loading");
        let url = hostname + "/api/addon/" + add_on_id + "/reservation/" + id + "/quantity/" + quantity;
        $.getJSON(url + "?callback=?", null, function (response) {
            $("body").removeClass("loading");
            if (response[0].result_code === 0) {
                refreshReservations();
                showResSuccessMessage("reservation", response[0].result_message);
            } else {
                showResErrorMessage("reservation", response[0].result_message);
            }
        });
    }
}

function addGuestID(event) {
    const id = event.target.id.replace("add_guest_id_button_", "");
    const article = document.querySelector('#add_guest_id_button_' + id);
    if (!$("#guest_id_" + article.dataset.resid).val()) {
        $("#guest_id_" + article.dataset.resid).removeClass("display-none");
    } else {
        const idNumber = $("#guest_id_" + article.dataset.resid).val();
        $("body").addClass("loading");
        let url = hostname + "/api/reservation/" + id + "/idnumber/" + idNumber;
        $.getJSON(url + "?callback=?", null, function (response) {
            $("body").removeClass("loading");

            if (response[0].result_code === 0) {
                refreshReservations();
                getBlockedRooms();
                showResSuccessMessage("reservation", response[0].result_message);
            } else {
                showResErrorMessage("reservation", response[0].result_message);
            }
        });
    }
}

function addPayment(event) {
    const id = event.target.id.replace("add_payment_button_", "");
    const article = document.querySelector('#add_payment_button_' + id);
    if (!$("#amount_" + article.dataset.resid).val()) {
        $("#amount_" + article.dataset.resid).removeClass("display-none");
    } else {
        const amount = $("#amount_" + article.dataset.resid).val();
        if (isNaN(amount)) {
            showResErrorMessage(reservation, "Please provide numbers only for payment");
            return;
        }
        $("body").addClass("loading");
        let url = hostname + "/api/payment/" + id + "/amount/" + amount;
        $.getJSON(url + "?callback=?", null, function (response) {
            $("body").removeClass("loading");

            if (response[0].result_code === 0) {
                refreshReservations();
                getBlockedRooms();
                showResSuccessMessage("reservation", response[0].result_message);
            } else {
                showResErrorMessage("reservation", response[0].result_message);
            }
        });
    }
}

function addNote(event) {
    const id = event.target.id.replace("add_note_button_", "");
    const article = document.querySelector('#add_note_button_' + id);
    if (!$("#note_" + article.dataset.resid).val()) {
        $("#note_" + article.dataset.resid).removeClass("display-none");
    } else {
        const note = $("#note_" + article.dataset.resid).val();
        $("body").addClass("loading");
        let url = hostname + "/api/note/" + id + "/text/" + note;
        $.getJSON(url + "?callback=?", null, function (response) {
            $("body").removeClass("loading");

            if (response[0].result_code === 0) {
                refreshReservations();
                showResSuccessMessage("reservation", response[0].result_message);
            } else {
                $("#reservation_error_message_div").removeClass("display-none");
                $("#reservation_error_message").text(jsonObj.result_message)
                $("#reservation_success_message_div").removeClass("display-none");
                $("#reservation_success_message").addClass("display-none");
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#reservations_all").offset().top
                }, 2000);
            }
        });
    }

}

function getRooms(id) {
    let url = hostname + "/api/rooms/all";
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $('#' + id)
                .find('option')
                .remove();

            $('#' + id).append($('<option/>').attr({
                "value": "none",
                "data-price": 0
            }).text("Select Room"));

            $.each(data, function (i, room) {
                $('#' + id).append($('<option/>').attr({
                    "value": room.id,
                    "data-price": room.price
                }).text(room.name));
            });
        },
        error: function (xhr) {
            console.log("request for getRooms is " + xhr.status);
            if (xhr.status > 400) {
                getRooms();
            }
        }
    });
}