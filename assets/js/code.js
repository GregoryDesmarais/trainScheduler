//Firebase confing and initialization

var appConfig = {
    apiKey: "AIzaSyDCbQb8aIds-apr9gn4MySIoKBP7Ptqc1w",
    authDomain: "trainscheduler-d2582.firebaseapp.com",
    databaseURL: "https://trainscheduler-d2582.firebaseio.com",
    projectId: "trainscheduler-d2582",
    storageBucket: "",
    messagingSenderId: "1082721802422",
    appId: "1:1082721802422:web:cdb09b4f46cf3d6f"
};

firebase.initializeApp(appConfig);

var db = firebase.database();

//functions

function updateTime() {
    var cTime = moment().format("HH:mm");
    $("#cTime").text(cTime);
}

function updateArrivalTime() {
    $("tr").each(function() {
        var trainFirstTime = $(this).find(".firstTime");
        var trainFreq = $(this).find(".freq");
        var nextTrain = $(this).find(".nextTrain");
        var nextTrainMin = $(this).find(".nextTrainMin");

        var firstTimeConverted = moment(trainFirstTime.text(), "HH:mm").subtract(1, "years");
        var difTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemain = difTime % trainFreq.text();
        nextTrainMin.text(trainFreq.text() - tRemain);
        nextTrain.text(moment().add(nextTrainMin.text(), "minutes").format("HH:mm"));

    })
}

function buildTable(childSnap) {
    $("#schedule").empty();
    var hide = "";
    console.log(childSnap.val());
    var dbVals = childSnap.val();
    for (x in dbVals) {
        var trainName = dbVals[x].tName;
        var trainDestination = dbVals[x].tDest;
        var trainFirstTime = dbVals[x].tFTime;
        var trainFreq = dbVals[x].tFreq;

        if (location.href.indexOf("admin.html") < 0) {
            hide = "hide"
        }
        var newTR = $("<tr>");
        newTR.append(`<button class='remove btn btn-danger ${hide}' data-name='${trainName}'>X</button>`);
        newTR.append(`<button class='edit btn btn-warning ${hide}' data-name='${trainName}'>edit</button>`);
        newTR.append(`<td>${trainName}</td>`);
        newTR.append(`<td>${trainDestination}</td>`);
        newTR.append(`<td class='firstTime ${hide}'>${trainFirstTime}</td>`);
        newTR.append(`<td class='freq'>${trainFreq}</td>`);
        newTR.append(`<td class='nextTrain'></td>`);
        newTR.append(`<td class='nextTrainMin'></td>`);
        $("#schedule").append(newTR);
    }

    updateArrivalTime();
}

//Listeners
$(document).on("click", ".remove", function() {
    var name = $(this).attr("data-name");
    db.ref(name).remove();
    db.ref().once("value").then(function(childSnap) {
        buildTable(childSnap);
    });
});
$(document).on("click", ".edit", function() {
    var name = $(this).attr("data-name");
    db.ref(name).once("value").then(function(childSnap) {
        var values = childSnap.val();
        $("#tDest").val(values.tDest);
        $("#tFTime").val(values.tFTime);
        $("#tName").val(values.tName);
        $("#tFreq").val(values.tFreq);
    });
});

$("#addTrain").click(function(e) {
    e.preventDefault();
    var tName = $("#tName").val();
    var tDest = $("#tDest").val();
    var tFTime = $("#tFTime").val();
    var tFreq = $("#tFreq").val();
    if (tName === "" || tDest === "" || tFTime === "" || tFreq === "") {
        alert("Please enter information in all fields");
        return false;
    } else {
        var data = {
            tName: tName,
            tDest: tDest,
            tFTime: tFTime,
            tFreq: tFreq
        }
        db.ref(tName).set(data);
        $("input.data").val("");
        $("#tName").focus();
    }
});


db.ref().on("value", function(childSnap) {
    buildTable(childSnap);
});



//Puts the current time on the screen.
updateTime();

//Interval to update the Current Time and the Arrival Time/Mins every second.
setInterval(function() {
    if (moment().format("ss") === "00") {
        updateTime();
        updateArrivalTime()
    }
}, 1000);