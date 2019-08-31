firebase.initializeApp(firebaseConfig);

var db = firebase.database();

function updateTime() {
    var cTime = moment().format("hh:mm");
    $("#cTime").text(cTime);
}

updateTime();
setInterval(updateTime, 1000);

$("#addTrain").click(function(e) {
    e.preventDefault();
    $("input[type='text']").each(function() {
        console.log($(this).attr("id"));
        if ($(this).val() === "") {
            alert("Empty found, no data submitted");
            return false;
        }
    })

})