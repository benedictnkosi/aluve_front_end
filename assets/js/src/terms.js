$(document).ready(function () {
    $("body").addClass("loading");
    getTerms();
});

function getTerms() {
    let url = hostname + "/api/property/terms/";
    $.ajax({
        type: "get",
        url: url,
        crossDomain: true,
        cache: false,
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            $("body").removeClass("loading");
            $("#terms_text").html(data[0].terms_html);
        },
        error: function (xhr) {
            $("body").removeClass("loading");
            console.log("request for getTerms is " + xhr.status);
            if (!isRetry("getTerms")) {
                return;
            }
            getTerms();
        }
    });

}