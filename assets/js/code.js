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

function updateTime() {
    var cTime = moment().format("HH:mm");
    $("#cTime").text(cTime);
}

updateTime();
setInterval(updateTime, 1000);

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
        db.ref().push(data);
        $("input.data").val("");
    }
});


// 16 - 00 = 16 (Currnet minutes, minus beginning minutes)
// 16 % 3 = 1 (Modulus is the remainder) result from above, mod frequency time
// 3 - 1 = 2 minutes away frequency minus result from mod
// 2 + 3:16 = 3:18 add above result to current time.

db.ref().on("child_added", function(childSnap) {
    console.log(childSnap.val());
    var dbVals = childSnap.val();

    var trainName = dbVals.tName;
    var trainDestination = dbVals.tDest;
    var trainFirstTime = dbVals.tFTime;
    var trainFreq = dbVals.tFreq;

    var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");
    var difTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemain = difTime % trainFreq;
    var minTillNextTrain = trainFreq - tRemain;
    var nextTrain = moment().add(minTillNextTrain, "minutes").format("HH:mm");

    var newTR = $("<tr>");
    newTR.append(`<td>${trainName}</td>`);
    newTR.append(`<td>${trainDestination}</td>`);
    newTR.append(`<td class='firstTime'>${trainFirstTime}</td>`);
    newTR.append(`<td class='freq'>${trainFreq}</td>`);
    newTR.append(`<td>${nextTrain}</td>`);
    newTR.append(`<td>${minTillNextTrain}</td>`);
    $("#schedule").append(newTR);

});