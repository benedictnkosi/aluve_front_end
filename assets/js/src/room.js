$(document).ready(function () {
    $("body").addClass("loading");
    getRoomSlide();
    getRoomDetails();
});


function getRoomDetails() {
    let url = hostname + "/public/rooms/" + getUrlParameter("id");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (response) {
            $('#room_name').html(response[0].name)
            $('#room_description').html(response[0].description_html);
            $('#room_price').html("R" + response[0].price + ".00");
            $('#room_sleeps').html(response[0].sleeps + " Guests");
            $('#room_bed').html(response[0].bed_name);
            $('#room_tv').html(response[0].tv);
            $('#room_book_button').attr("href","/booking.html?id=" +response[0].id);
            $("body").removeClass("loading");
        },
        error: function (xhr) {
            console.log("request for getRoomDetails is " + xhr.status);
            if (xhr.status > 400) {
                if (!isRetry("getRoomDetails")) {
                    return;
                }
                getRoomDetails();
            }
        }
    });

}

function getRoomSlide() {
    let url = hostname + "/public/roomslide/" + getUrlParameter("id");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $(".image-container").html(data.html);
            displaySlide(slideIndex);
        },
        error: function (xhr) {
            console.log("request for getRoomSlide is " + xhr.status);
            if (xhr.status > 400) {
                if (!isRetry("getRoomSlide")) {
                    return;
                }
                getRoomSlide();
            }
        }
    });
}


function moveSlides(n) {
    displaySlide(slideIndex += n);
}

function activeSlide(n) {
    displaySlide(slideIndex = n);
}

/* Main function */
function displaySlide(n) {
    var i;
    var totalslides =
        document.getElementsByClassName("slide");

    var totaldots =
        document.getElementsByClassName("footerdot");

    if (n > totalslides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = totalslides.length;
    }
    for (i = 0; i < totalslides.length; i++) {
        totalslides[i].style.display = "none";
    }
    for (i = 0; i < totaldots.length; i++) {
        totaldots[i].className =
            totaldots[i].className.replace(" active", "");
    }
    totalslides[slideIndex - 1].style.display = "block";
    totaldots[slideIndex - 1].className += " active";
}