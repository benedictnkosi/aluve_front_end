$(document).ready(function () {
    $("body").addClass("loading");
    getInvoice();
});

function getInvoice() {
    let url = hostname + "/api/invoice/" + getUrlParameter("id");
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("#invoice-table-div").html(data.html);
        },
        error: function (xhr) {
            console.log("request for getInvoice is " + xhr.status);
            if (xhr.status > 400) {
                if (!isRetry("getInvoice")) {
                    return;
                }
                getInvoice();
            }
        }
    });
}