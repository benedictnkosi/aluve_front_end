$(document).ready(function () {
    window.setTimeout(hideLoader, 15000);
    if (sessionStorage.getItem("current_page") === null) {
        updateView('calendar');
    } else {
        updateView(sessionStorage.getItem("current_page"));
    }

    $("#create_invoice_tab").click(function (event) {
        sessionStorage.setItem("property_manager_action", "create");
        $("#submit_create_invoice").prop("value", "Create Invoice");
        //in case it was disabled by stayover and checkout update
        $("#rooms_select").prop('disabled', false);
        $("#checkin_date").prop('disabled', false);
        $("#checkout_date").prop('disabled', false);
        $("#userNumber").prop('disabled', false);
        $("#userName").prop('disabled', false);
    });

    $(".info-input-box").click(function (event) {
        getPage();
        var copyText = event.target;
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */

        /* Copy the text inside the text field */
        document.execCommand("copy");

        var text = document.createTextNode("Copied");
        copyText.parentNode.insertBefore(text, copyText.nextSibling)
    });

    //other tabs
    $('.filter-other-tabs').unbind('click')
    $(".filter-other-tabs").click(function (event) {
        event.stopImmediatePropagation();
        filterOtherTabs(event);
    });

    $('.nav-links').unbind('click')
    $(".nav-links").click(function (event) {
        event.stopImmediatePropagation();
        $(".headcol").css("position", "absolute");
    });
});

function hideLoader() {
    $("body").removeClass("startup-loading");
    $("body").removeClass("loading");
}

const guid = a => (a ?
    (a ^ ((16 * Math.random()) >> (a / 4))).toString(16) :
    ([1E7] + -1E3 + -4E3 + -8E3 + -1E11).replace(/[018]/g, guid));


function updateView(selectedDiv) {
    //check if javascript loaded for div
    $(".toggleable").addClass("display-none");
    $(".headcol").css("position", "absolute");
    $("#checkbox_toggle").prop("checked", false);
    $("#div-" + selectedDiv).removeClass("display-none");
    sessionStorage.setItem("current_page", selectedDiv);
    isUserLoggedIn();
    loadDataOnMenuClick(selectedDiv);
}

function loadDataOnMenuClick(selectedDiv) {
    //if(sessionStorage.getItem(selectedDiv) === null){
    //sessionStorage.setItem(selectedDiv,"loaded");
    switch (selectedDiv) {
        case 'calendar':
            loadCalendarPageData();
            break;
        case 'notifications':
            loadNotificationsPageData();
            break;
        case 'upcoming-reservations':
            loadReservationsPageData();
            break;
        case 'other-tabs':
            loadOccupancyPageData();
            loadCleaningPageData();
            loadBlockedRoomsPageData();
            break;
        case 'configuration':
            loadConfigurationPageData();
            break;
        default:
        // code block
    }
    //}
}


function logout() {
    $("body").addClass("loading");
    sessionStorage.removeItem('PROPERTY_ID');
    sessionStorage.removeItem('PROPERTY_UID');
    window.location.href = "/admin/login.html";
}

function isUserLoggedIn() {
    let url = hostname + "/api/isloggedin/" + sessionStorage.getItem("PROPERTY_UID");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("body").removeClass("loading");
            if (data[0].logged_in === false) {
                sessionStorage.removeItem('PROPERTY_ID');
                sessionStorage.removeItem('PROPERTY_UID');
                window.location.href = "/admin/login.html";
            }
        },
        error: function (xhr) {
            console.log("request for isUserLoggedIn is " + xhr.status);
            if (!isRetry("isUserLoggedIn")) {
                return;
            }
            isUserLoggedIn();
        }
    });
}

function filterOtherTabs(event) {
    var id = event.currentTarget.id;
    $('.other_feature_tab').addClass("display-none");

    switch (id) {
        case "view_blocked_rooms_tab":
            $('#block-list').removeClass("display-none");
            break;
        case "block_a_room_tab":
            $('#div-block-room').removeClass("display-none");
            break;
        case "cleaning_tab":
            $('#div-cleaning').removeClass("display-none");
            break;
        case "whatsapp_tab":
            $('#div-whatapp-chat').removeClass("display-none");
            break;
        case "occupancy_tab":
            $('#div-occupancy').removeClass("display-none");
            break;
        default:
        // code block
    }
}
