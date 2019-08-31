// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAyUCWDkIbv230Sevef25coBaeihE1Hv88",
    authDomain: "trainscheduler-1d254.firebaseapp.com",
    databaseURL: "https://trainscheduler-1d254.firebaseio.com",
    projectId: "trainscheduler-1d254",
    storageBucket: "",
    messagingSenderId: "64949939814",
    appId: "1:64949939814:web:013436536cf70ad6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function updateTime() {
    var cTime = moment().format("hh:mm");
    $("#cTime").text(cTime);
}

updateTime();
setInterval(updateTime, 1000);

$("#addTrain").click(function(e) {
    e.preventDefault();

})