$(document).ready(function () {

});

function loadConfigurationPageData() {
    getConfigRooms();
    getConfigRoomsDropDown();
    getConfigRoomStatusesDropDown();
    getConfigRoomBedSizesDropDown();
    getAddOns();
    getEmployees();
    getScheduledMessages();
    getSchedules();
    getVariables();
    getRoomsForMessages();
    getConfigRoomTvsDropDown();
    getTemplates();
    getTerms();
    bindConfigElements();
}

function bindConfigElements(){
    $('.filter-configuration').unbind('click')
    $(".filter-configuration").click(function (event) {
        event.stopImmediatePropagation();
        filterConfiguration(event);
    });

    $("#config_room_form").validate({
        // Specify validation rules
        rules: {
            room_name: "required",
            room_description: "required",
            room_sleeps: "required",
            room_price: {
                required: true,
                digits: true
            },
            room_size: {
                required: true,
                digits: true
            }
        },
        submitHandler: function () {
            createUpdateRoom();
        }

    });

    $("#config_addOn_form").validate({
        // Specify validation rules
        rules: {
            addon_name: "required",
            addon_price: {
                required: true,
                digits: true
            }
        },
        submitHandler: function () {
            createAddOn();
        }

    });

    $("#config_employee_form").validate({
        // Specify validation rules
        rules: {
            employee_name: "required",
        },
        submitHandler: function () {
            createEmployee();
        }
    });

    $('#messages_submit').unbind('click')
    $("#messages_submit").click(function (event) {
        event.stopImmediatePropagation();
        createScheduleMessage(event);
    });

    $("#config_createScheduleMessage_form").submit(function (event) {
        event.preventDefault();
    });

    $("#terms_form").submit(function (event) {
        event.preventDefault();
    });

    $("#terms_form").validate({
        // Specify validation rules
        rules: {
            terms_text: "required"
        },
        submitHandler: function () {
            updateTerms();
        }
    });

    $("#ical_form").submit(function (event) {
        event.preventDefault();
    });

    $("#ical_form").validate({
        // Specify validation rules
        rules: {
            icalLink: "required"
        },
        submitHandler: function () {
            addNewChannel();
        }
    });

    $("#config_createMessageTemplate_form").validate({
        // Specify validation rules
        rules: {
            template_name_input: "required",
            template_message: "required"
        },
        submitHandler: function () {
            createMessageTemplate();
        }
    });
}

const uploader = $('#ssi-upload').ssi_uploader({
    url: '/admin/UploadController.php',
    allowed: ['jpg', 'jpeg', 'png', 'bmp', 'gif'],
    maxNumberOfFiles: '10',
    errorHandler: {
        method: function (msg, type) {
            ssi_modal.notify(type, {content: msg});
        },
        success: 'success',
        error: 'error'
    },
    maxFileSize: 5,//mb,
});

uploader.on('onEachUpload.ssi-uploader', function () {
    uploader.data('ssi_upload').uploadFiles();
});

function createUpdateRoom() {
    const room_id = $("#room_id").val().trim();
    const room_name = $("#room_name").val().trim();
    const room_description = $("#room_description").val().trim();
    const room_price = $("#room_price").val().trim();
    const room_sleeps = $("#room_sleeps").val().trim();
    const room_size = $('#room_size').val().trim();
    const select_room_status = $('#select_room_status').find(":selected").val();
    const select_linked_room = $('#select_linked_room').find(":selected").val();
    const select_bed = $('#select_bed').find(":selected").val();
    const select_Stairs = $('#select_Stairs').find(":selected").val();
    const select_tv = $('#select_tv').find(":selected").val();

    $("body").addClass("loading");

    let url = hostname + "/api/createroom/" + room_id + "/" + room_name + "/" + room_price + "/" + room_sleeps + "/" + select_room_status + "/" + select_linked_room + "/" + room_size + "/" + select_bed + "/" + select_Stairs + "/" + select_tv + "/" + encodeURIComponent(room_description.replaceAll("/", "###")) + "/" + sessionStorage.getItem("PROPERTY_UID");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("body").removeClass("loading");
            const jsonObj = data[0];
            if (jsonObj.result_code === 0) {
                showResSuccessMessage("configuration", jsonObj.result_message)
                getConfigRooms();
            } else {
                showResErrorMessage("configuration", jsonObj.result_message)
            }
        },
        error: function (xhr) {
            showResErrorMessage("configuration", "Server error occurred")
        }
    });

}

function filterConfiguration(event) {
    var id = event.currentTarget.id;
    $('.configuration_tabs').addClass("display-none");

    switch (id) {
        case "configuration_rooms":
            $('#configuration-rooms-list').removeClass("display-none");
            $('#configuration-heading').text("Rooms");
            break;
        case "configuration_add_ons":
            $('#configuration-add_on-list').removeClass("display-none");
            $('#configuration-heading').text("Add-Ons");
            break;
        case "configuration_employees":
            $('#configuration-employees-list').removeClass("display-none");
            $('#configuration-heading').text("Employees");
            break;
        case "configuration_messages":
            $('#configuration-messages').removeClass("display-none");
            $('#configuration-heading').text("Schedule Messages");
            break;
        case "configuration_terms":
            $('#configuration-terms').removeClass("display-none");
            $('#configuration-heading').text("Terms & Conditions");
            break;
        default:
        // code block
    }
}

function getConfigRooms() {
    let url = hostname + "/api/configurationrooms/" + sessionStorage.getItem("PROPERTY_UID");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#config_rooms_list").html(data.html);
            $('.roomsMenu').unbind('click')
            $(".roomsMenu").click(function (event) {
                event.stopImmediatePropagation();
                populateFormWithRoom(event);
            });
        },
        error: function (xhr) {
            console.log("request for getConfigRooms is " + xhr.status);
            if (!isRetry("getConfigRooms")) {
                return;
            }
            getConfigRooms();
        }
    });
}

function getConfigRoomsDropDown() {
    let url = hostname + "/api/combolistrooms/" + sessionStorage.getItem("PROPERTY_UID");

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#select_linked_room").html(data.html);
        },
        error: function (xhr) {
            console.log("request for getConfigRoomsDropDown is " + xhr.status);
            if (!isRetry("getConfigRoomsDropDown")) {
                return;
            }
            getConfigRoomsDropDown();
        }
    });
}

function getConfigRoomStatusesDropDown() {
    let url = hostname + "/api/combolistroomstatuses";

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#select_room_status").html(data.html);
        },
        error: function (xhr) {
            console.log("request for getConfigRoomStatusesDropDown is " + xhr.status);
            if (xhr.status > 400) {
                getConfigRoomStatusesDropDown();
            }
        }
    });
}

function getConfigRoomBedSizesDropDown() {
    let url = hostname + "/api/combolistroombedsizes";

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#select_bed").html(data.html);
        },
        error: function (xhr) {
            console.log("request for getConfigRoomBedSizesDropDown is " + xhr.status);
            if (!isRetry("getConfigRoomBedSizesDropDown")) {
                return;
            }
            getConfigRoomBedSizesDropDown();
        }
    });
}

function getConfigRoomTvsDropDown() {
    let url = hostname + "/api/combolistroomtvs";

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#select_tv").html(data.html);
        },
        error: function (xhr) {
            console.log("request for getConfigRoomTvsDropDown is " + xhr.status);
            if (!isRetry("getConfigRoomTvsDropDown")) {
                return;
            }
            getConfigRoomTvsDropDown();
        }
    });
}

function populateFormWithRoom(event) {
    let roomId = "";
    if (typeof event === 'string' || event instanceof String) {
        roomId = event;
    } else {
        roomId = event.target.getAttribute("data-roomid");
    }

    $('#room_id').val(roomId);
    setCookie("room_id", roomId);
    if (roomId.localeCompare("0") === 0) {

        $('#manage_room_h3').html("Create A New Room");
        $('#imageUploaderDiv').addClass("display-none");
        $('#room_name').val("");
        $('#room_description').val("");
        $('#room_price').val("");
        $('#room_sleeps').val("2");
        $("#select_room_status").val($("#select_room_status option:first").val());
        $("#select_linked_room").val($("#select_linked_room option:first").val());
        $('#room_size').val("");
        $("#select_bed").val($("#select_bed option:first").val());
        $("#select_tv").val($("#select_tv option:first").val());
        $("#select_Stairs").val($("#select_Stairs option:first").val());
    } else {
        let url = hostname + "/api/rooms/" + roomId;
        $("body").addClass("loading");
        $.getJSON(url + "?callback=?", null, function (response) {
            $("body").removeClass("loading");
            if (response[0].result_code === 0) {
                $('#manage_room_h3').html("Update " + response[0].name + " Details");
                $('#room_name').val(response[0].name);
                $('#room_description').val(response[0].description);
                $('#room_price').val(response[0].price);
                $('#room_sleeps').val(response[0].sleeps);
                $('#select_room_status').val(response[0].status);
                $('#select_linked_room').val(response[0].linked_room);
                $('#room_size').val(response[0].room_size);
                $('#select_bed').val(response[0].bed);
                $('#select_tv').val(response[0].tv);
                $('#select_Stairs').val(response[0].stairs);
                $("#links_div").html(response[0].ical_links);
                //show uploaded images
                $("#uploaded_images_div").html(response[0].uploaded_images);
                $('#imageUploaderDiv').removeClass("display-none");
                $('#icalDiv').removeClass("display-none");

                $('.close').unbind('click')
                $(".close").click(function (event) {
                    event.stopImmediatePropagation();
                    const imageId = event.target.getAttribute("data-image-id");
                    const roomId = event.target.getAttribute("data-room-id");
                    let url = hostname + "/api/configuration/removeimage/" + imageId;
                    $.getJSON(url + "?callback=?", null, function (response) {
                        if (response[0].result_code === 0) {
                            $('#image-thumbnail-' + imageId).remove();
                        }
                    });
                });

                $(".default_image_star").click(function (event) {
                    event.stopImmediatePropagation();
                    const imageId = event.target.getAttribute("data-image-id");
                    let url = hostname + "/api/configuration/markdefault/" + imageId;

                    $.getJSON(url + "?callback=?", null, function (response) {
                        if (response[0].result_code === 0) {
                            //remove the yellow start from previous default image
                            $(".default_image_star").attr("src", "images/star_gray.png");
                            $(event.target).attr("src", "images/star_yellow.png");
                        }
                    });
                });

                $(".remove_link_button").click(function (event) {
                    event.stopImmediatePropagation();
                    removeChannel(event);
                });

                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#manage_room_h3").offset().top
                }, 2000);


            } else {
                showResErrorMessage("reservation", response[0].result_message);
            }
        }).fail(function (d) {
            if (d.status === 500) {
                populateFormWithRoom(event);
            }
        });
    }

}

function setCookie(name, value) {
    //expires in one hour
    var now = new Date();
    now.setTime(now.getTime() + 1 * 3600 * 1000);
    document.cookie = name + '=' + value + '; ' + now.toUTCString() + '; path=/';
}

function getAddOns() {
    let url = hostname + "/api/addon/configaddons/" + sessionStorage.getItem("PROPERTY_UID");

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#add_ons_div").html(data);

            $('.addon_field').unbind('click')
            $(".addon_field").change(function (event) {
                event.stopImmediatePropagation();
                updateAddOn(event);
            });

            $('.remove_addon_button').unbind('click')
            $(".remove_addon_button").click(function (event) {
                event.stopImmediatePropagation();
                deleteAddOn(event);
            });
        },
        error: function (xhr) {
            console.log("request for getAddOns is " + xhr.status);
            if (!isRetry("getAddOns")) {
                return;
            }
            getAddOns();
        }
    });
}

function updateAddOn(event) {
    let addOnId = event.target.getAttribute("data-addon-id");
    let fieldName = event.target.getAttribute("data-addon-field");
    $("body").addClass("loading");

    let url = hostname + "/api/addon/update/" + addOnId + "/" + fieldName + "/";
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        if (response[0].result_code === 0) {
            showResSuccessMessage("configuration", response[0].result_message);
        } else {
            showResErrorMessage("configuration", response[0].result_message);
        }
    });
}

function createAddOn() {
    const addon_name = $("#addon_name").val().trim();
    const addon_price = $("#addon_price").val().trim();
    $("body").addClass("loading");

    let url = hostname + "/api/createaddon/" + addon_name + "/" + addon_price + "/" + sessionStorage.getItem("PROPERTY_UID");
    $.getJSON(url + "?callback=?", null, function (data) {
        $("body").removeClass("loading");
        const jsonObj = data[0];
        if (jsonObj.result_code === 0) {
            showResSuccessMessage("configuration", jsonObj.result_message)
            getAddOns();
        } else {
            showResErrorMessage("configuration", jsonObj.result_message)
        }
    });
}

function deleteAddOn(event) {
    let addOnId = event.target.getAttribute("data-addon-id");
    $("body").addClass("loading");

    let url = hostname + "/api/addon/delete/" + addOnId;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        if (response[0].result_code === 0) {
            getAddOns();
            showResSuccessMessage("configuration", response[0].result_message);
        } else {
            showResErrorMessage("configuration", response[0].result_message);
        }
    });
}

function getEmployees() {

    let url = hostname + "/api/config/employees" + "/" + sessionStorage.getItem("PROPERTY_UID");

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#employee_div").html(data.html);
            $('.employee_field').unbind('click')
            $(".employee_field").change(function (event) {
                updateEmployee(event);
            });

            $('.remove_employee_button').unbind('click')
            $(".remove_employee_button").click(function (event) {
                event.stopImmediatePropagation();
                deleteEmployee(event);
            });
        },
        error: function (xhr) {
            console.log("request for getEmployees is " + xhr.status);
            if (!isRetry("getEmployees")) {
                return;
            }
            getEmployees();
        }
    });
}

function updateEmployee(event) {
    let employeeId = event.target.getAttribute("data-employee-id");
    $("body").addClass("loading");

    let url = hostname + "/api/employee/update/" + employeeId + "/" + event.target.value;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        if (response[0].result_code === 0) {
            showResSuccessMessage("configuration", response[0].result_message);
        } else {
            showResErrorMessage("configuration", response[0].result_message);
        }
    });
}

function createEmployee() {
    const employee_name = $("#employee_name").val().trim();
    $("body").addClass("loading");

    let url = hostname + "/api/createemployee/" + employee_name + "/" + sessionStorage.getItem("PROPERTY_UID");

    $.getJSON(url + "?callback=?", null, function (data) {
        $("body").removeClass("loading");
        const jsonObj = data[0];
        if (jsonObj.result_code === 0) {
            showResSuccessMessage("configuration", jsonObj.result_message)
            getEmployees();
        } else {
            showResErrorMessage("configuration", jsonObj.result_message)
        }
    });
}

function deleteEmployee(event) {
    let employeeId = event.target.getAttribute("data-employee-id");
    $("body").addClass("loading");

    let url = hostname + "/api/employee/delete/" + employeeId;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        if (response[0].result_code === 0) {
            getEmployees();
            showResSuccessMessage("configuration", response[0].result_message);
        } else {
            showResErrorMessage("configuration", response[0].result_message);
        }
    });
}

function getTemplates() {
    $("body").addClass("loading");
    let url = hostname + "/api/schedulemessages/templates" + "/" + sessionStorage.getItem("PROPERTY_UID");

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("body").removeClass("loading");
            $("#template_name_select").html(data.html);
            $(".template_option").change(function (event) {
                getTemplateMessage(event);
            });
            getTemplateMessage($("#template_name_select").find("option:first-child").val());
        },
        error: function (xhr) {
            $("body").removeClass("loading");
            console.log("request for getTemplates is " + xhr.status);
            if (!isRetry("getTemplates")) {
                return;
            }
            getTemplates();

        }
    });
}

function getSchedules() {
    let url = hostname + "/api/schedulemessages/schedules";

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $('#schedule_name')
                .find('option')
                .remove();

            $.each(data, function (i, schedule) {
                $('#schedule_name').append($('<option/>').attr({
                    "value": schedule.id,
                    "data-price": schedule.name
                }).text(schedule.name));
            });
        },
        error: function (xhr) {
            console.log("request for getSchedules is " + xhr.status);
            if (!isRetry("getSchedules")) {
                return;
            }
            getSchedules();
        }
    });
}

function getVariables() {
    let url = hostname + "/api/schedulemessages/variables";

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            let variables = "<b>Variables</b>: ";
            $.each(data, function (i, schedule) {
                variables += schedule.name + ", ";
            });
            $('#message_variables').html(variables.substring(0, variables.length - 2));
        },
        error: function (xhr) {
            console.log("request for getVariables " + xhr.status);
            if (!isRetry("getVariables")) {
                return;
            }
            getVariables();
        }
    });
}

function getRoomsForMessages() {
    let url = hostname + "/api/rooms/all" + "/" + sessionStorage.getItem("PROPERTY_UID");

    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $.each(data, function (i, room) {
                addCheckbox(room.name, room.id);
            });
        },
        error: function (xhr) {
            console.log("request for getRoomsForMessages is " + xhr.status);
            if (!isRetry("getRoomsForMessages")) {
                return;
            }
            getRoomsForMessages();
        }
    });

}

function addCheckbox(name, room_id) {
    var container = $('#checkbox_rooms');
    var inputs = container.find('input');

    $('<input />', {type: 'checkbox', id: 'cb' + room_id, value: room_id}).appendTo(container);
    $('<label />', {'for': 'cb' + room_id, text: name}).appendTo(container);
    $('<br />').appendTo(container);
}

function createScheduleMessage() {
    const template_name_select = $('#template_name_select').find(":selected").val();
    const schedule_name = $('#schedule_name').find(":selected").val();
    var selected = [];
    $('#checkbox_rooms input:checked').each(function () {
        selected.push($(this).attr('value'));
    });
    if (selected.length > 0) {
        $("body").addClass("loading");

        let url = hostname + "/api/schedulemessages/create/" + template_name_select + "/" + schedule_name + "/" + selected.toString();
        $.getJSON(url + "?callback=?", null, function (data) {
            $("body").removeClass("loading");
            const jsonObj = data[0];
            if (jsonObj.result_code === 0) {
                showResSuccessMessage("configuration", jsonObj.result_message)
                getScheduledMessages();
            } else {
                showResErrorMessage("configuration", jsonObj.result_message)
            }
        });
    } else {
        showResErrorMessage("configuration", "Please select at least one room");
    }
}

function getScheduledMessages() {

    let url = hostname + "/api/schedulemessages" + "/" + sessionStorage.getItem("PROPERTY_UID");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#messages_div").html(data.html);
            $('.deleteScheduledMessage').unbind('click')
            $(".deleteScheduledMessage").click(function (event) {
                event.stopImmediatePropagation();
                deleteScheduledMessage(event);
            });
        },
        error: function (xhr) {
            console.log("request for getScheduledMessages is " + xhr.status);
            if (!isRetry("getScheduledMessages")) {
                return;
            }
            getScheduledMessages();
        }
    });
}

function deleteScheduledMessage(event) {
    let scheduleMessageId = event.target.getAttribute("data-id");
    $("body").addClass("loading");

    let url = hostname + "/api/schedulemessages/delete/" + scheduleMessageId;

    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        var jsonObj = response[0];
        if (jsonObj.result_code === 0) {
            getScheduledMessages();
            showResSuccessMessage("configuration", response[0].result_message);
        } else {
            showResErrorMessage("configuration", response[0].result_message);
        }
    });
}

function createMessageTemplate() {
    $("body").addClass("loading");
    const name = $("#template_name_input").val().trim();
    const message = $("#template_message").val().trim();

    let url = hostname + "/api/schedulemessages/createtemplate/" + name + "/" + encodeURIComponent(message) + "/" + sessionStorage.getItem("PROPERTY_UID");
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        var jsonObj = response[0];
        if (jsonObj.result_code === 0) {
            getScheduledMessages();
            showResSuccessMessage("configuration", response[0].result_message);
        } else {
            showResErrorMessage("configuration", response[0].result_message);
        }
    });
}

function getTemplateMessage() {
    const templateId = $('#template_name_select').find(":selected").val();
    if (templateId != null) {
        let url = hostname + "/api/schedulemessages/template/" + templateId;

        $.ajax({
            type: "get",
            url: url,
            crossDomain: true,
            cache: false,
            dataType: "jsonp",
            contentType: "application/json; charset=UTF-8",
            success: function (data) {
                $("#template_message_text").html(data.html);
            },
            error: function (xhr) {
                console.log("request for getTemplateMessage is " + xhr.status);
                if (!isRetry("getTemplateMessage")) {
                    return;
                }
                getTemplateMessage();
            }
        });
    }
}


function getTerms() {
    let url = hostname + "/api/property/terms/" + sessionStorage.getItem("PROPERTY_UID");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#terms_text").val(data[0].terms);
        },
        error: function (xhr) {
            console.log("request for getTerms is " + xhr.status);
            if (!isRetry("getTerms")) {
                return;
            }
            getTerms();
        }
    });

}

function updateTerms() {
    const terms_text = $("#terms_text").val().trim();

    $("body").addClass("loading");

    let url = hostname + "/api/property/terms/update/" + sessionStorage.getItem("PROPERTY_UID") + "/" + encodeURIComponent(terms_text.replaceAll("/", "###"));
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("body").removeClass("loading");
            const jsonObj = data[0];
            if (jsonObj.result_code === 0) {
                showResSuccessMessage("configuration", jsonObj.result_message)
            } else {
                showResErrorMessage("configuration", jsonObj.result_message)
            }
        },
        error: function (xhr) {
            showResErrorMessage("configuration", "Server error occurred")
        }
    });

}

function addNewChannel() {
    const room_id = $("#room_id").val().trim();
    const link = $("#icalLink").val().trim();
    let url = hostname + "/api/ical/links/" + room_id + "/" + encodeURIComponent(link.replaceAll("/", "###"));
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
            const jsonObj = data[0];
            if (jsonObj.result_code === 0) {
                populateFormWithRoom(room_id);
            } else {
                showResErrorMessage("configuration", jsonObj.result_message)
            }
        },
        error: function (xhr) {
            $("body").removeClass("loading");
            console.log("request for addNewChannel " + xhr.status);
        }
    });
}

function removeChannel(event) {
    let channelId = event.target.getAttribute("data-link-id");
    $("body").addClass("loading");

    let url = hostname + "/api/ical/remove/" + channelId;
    $.getJSON(url + "?callback=?", null, function (response) {
        $("body").removeClass("loading");
        if (response[0].result_code === 0) {
            const parent = $(event.target).parent();
            parent.remove();
            showResSuccessMessage("configuration", response[0].result_message);
        } else {
            showResErrorMessage("configuration", response[0].result_message);
        }
    });
}
