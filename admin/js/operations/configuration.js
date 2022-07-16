$(document).ready(function () {
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
    getTemplates();

    $('.filter-configuration').unbind('click')
    $(".filter-configuration").click(function (event) {
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
        createScheduleMessage(event);
    });

    $("#config_createScheduleMessage_form").submit(function (event) {
        event.preventDefault();
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

});


const uploader = $('#ssi-upload').ssi_uploader({
    url: 'http://aluveapp.co.za/api/doUpload',
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

    $("body").addClass("loading");


    let url = hostname + "/api/createroom/" + room_id + "/" + room_name + "/" + room_price + "/" + room_sleeps + "/" + select_room_status + "/" + select_linked_room + "/" + room_size + "/" + select_bed + "/" + select_Stairs + "/" + encodeURIComponent(room_description);
    $.getJSON(url + "?callback=?", null, function (data) {
        $("body").removeClass("loading");
        const jsonObj = data[0];
        if (jsonObj.result_code === 0) {
            showResSuccessMessage("configuration", jsonObj.result_message)
            getConfigRooms();
        } else {
            showResErrorMessage("configuration", jsonObj.result_message)
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
        default:
        // code block
    }
}

function getConfigRooms() {
    let url = hostname + "/api/configurationrooms";
    $.getJSON(url + "?callback=?", null, function (data) {
        $("#config_rooms_list").html(data.html);
        $('.roomsMenu').unbind('click')
        $(".roomsMenu").click(function (event) {
            populateFormWithRoom(event);
        });
    });
}

function getConfigRoomsDropDown() {
    let url = hostname + "/api/combolistrooms";
    $.getJSON(url + "?callback=?", null, function (data) {
        $("#select_linked_room").html(data.html);
    });
}

function getConfigRoomStatusesDropDown() {
    let url = hostname + "/api/combolistroomstatuses";
    $.getJSON(url + "?callback=?", null, function (data) {
        $("#select_room_status").html(data.html);
    });
}

function getConfigRoomBedSizesDropDown() {
    let url = hostname + "api/combolistroombedsizes";
    $.getJSON(url + "?callback=?", null, function (data) {
        $("#select_bed").html(data.html);
    });
}

function populateFormWithRoom(event) {
    let roomId = event.target.getAttribute("data-roomid");
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
        $("#select_Stairs").val($("#select_Stairs option:first").val());
    } else {
        let url = hostname + "/api/rooms/" + roomId;
        $.getJSON(url + "?callback=?", null, function (response) {
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
                $('#select_Stairs').val(response[0].stairs);

                //show uploaded images
                $("#uploaded_images_div").html(response[0].uploaded_images);
                $('#imageUploaderDiv').removeClass("display-none");

                $('.close').unbind('click')
                $(".close").click(function (event) {
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

                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#manage_room_h3").offset().top
                }, 2000);


            } else {
                showResErrorMessage("reservation", response[0].result_message);
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
    let url =  hostname + "/api/addon/configaddons";
    $.getJSON(url + "?callback=?", null, function(data) {
        $("#add_ons_div").html(data.html);
        $(".addon_field").change(function (event) {
            updateAddOn(event);
        });

        $(".remove_addon_button").click(function (event) {
            deleteAddOn(event);
        });
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

    let url = hostname + "/api/createaddon/" + addon_name + "/" + addon_price;
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

    let url =  hostname + "/api/addon/delete/" + addOnId;
    $.getJSON(url + "?callback=?", null, function(data) {
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

    let url =  hostname + "/api/config/employees";
    $.getJSON(url + "?callback=?", null, function(data) {
        $("#employee_div").html(data.html);
        $(".employee_field").change(function (event) {
            updateEmployee(event);
        });

        $(".remove_employee_button").click(function (event) {
            deleteEmployee(event);
        });
    });
}

function updateEmployee(event) {
    let employeeId = event.target.getAttribute("data-employee-id");
    $("body").addClass("loading");

    let url =  hostname + "/api/employee/update/" + employeeId + "/" + event.target.value;
    $.getJSON(url + "?callback=?", null, function(response) {
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

    let url =  hostname + "/api/createemployee/" + employee_name;

    $.getJSON(url + "?callback=?", null, function(data) {
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

    let url =  hostname + "/api/employee/delete/" + employeeId;
    $.getJSON(url + "?callback=?", null, function(response) {
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

    let url =  hostname + "/api/schedulemessages/templates" ;
    $.getJSON(url + "?callback=?", null, function(data) {
        $("#template_name_select").html(data.html);
        $(".template_option").change(function (event) {
            getTemplateMessage(event);
        });
        getTemplateMessage($("#template_name_select").find("option:first-child").val());
    });
}

function getSchedules() {
    let url =  hostname +  "/api/schedulemessages/schedules";
    $.getJSON(url + "?callback=?", null, function(data) {
        $('#schedule_name')
            .find('option')
            .remove();

        $.each(data, function (i, schedule) {
            $('#schedule_name').append($('<option/>').attr({
                "value": schedule.id,
                "data-price": schedule.name
            }).text(schedule.name));
        });
    });
}

function getVariables() {
    let url =  hostname + "/api/schedulemessages/variables";
    $.getJSON(url + "?callback=?", null, function(data) {
        let variables = "<b>Variables</b>: ";
        $.each(data, function (i, schedule) {
            variables += schedule.name + ", ";
        });
        $('#message_variables').html(variables.substring(0, variables.length - 2));
    });
}

function getRoomsForMessages() {
    let url =  hostname + "/api/rooms/all" ;

    $.getJSON(url + "?callback=?", null, function(data) {
        $.each(data, function (i, room) {
            addCheckbox(room.name, room.id);
        });
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

        let url =  hostname + "/api/schedulemessages/create/" + template_name_select + "/" + schedule_name + "/" + selected.toString() ;
        $.getJSON(url + "?callback=?", null, function(data) {
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

    let url =  hostname + "/api/schedulemessages" ;
    $.getJSON(url + "?callback=?", null, function(data) {
        $("#messages_div").html(data.html);
        $('.deleteScheduledMessage').unbind('click')
        $(".deleteScheduledMessage").click(function (event) {
            deleteScheduledMessage(event);
        });
    });
}

function deleteScheduledMessage(event) {
    let scheduleMessageId = event.target.getAttribute("data-id");
    $("body").addClass("loading");

    let url =  hostname +  "/api/schedulemessages/delete/" + scheduleMessageId;

    $.getJSON(url + "?callback=?", null, function(response) {
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

    let url =  hostname +  "/api/schedulemessages/createtemplate/" + name + "/" + encodeURIComponent(message);
    $.getJSON(url + "?callback=?", null, function(response) {
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
    let url =  hostname + "/api/schedulemessages/template/" + templateId ;
    $.getJSON(url + "?callback=?", null, function(data) {
        $("#template_message_text").html(data.html);
    });
}