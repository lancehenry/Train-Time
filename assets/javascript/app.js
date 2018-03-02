// Initialize Firebase
var config = {
    apiKey: "AIzaSyB80ALdL-VkK2CxeT94jK4DbrT4cNFFHuM",
    authDomain: "train-tracker-2831c.firebaseapp.com",
    databaseURL: "https://train-tracker-2831c.firebaseio.com",
    projectId: "train-tracker-2831c",
    storageBucket: "train-tracker-2831c.appspot.com",
    messagingSenderId: "279986433088"
};

firebase.initializeApp(config);

// Variable for talking to the database
var database = firebase.database();

// Capture button click
$("#submitBtn").on("click", function (event) {
    event.preventDefault();

    // Store the most recent train information entered
    var name = $("#name-input").val().trim();
    var destination = $("#dest-input").val().trim();
    var tTime = $("#time-input").val().trim();
    var tFreq = $("#freq-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: name,
        dest: destination,
        time: tTime,
        freq: tFreq,
        timeAdded: firebase.database.ServerValue.TIMESTAMP
    };

    // Uploads train data to the firebase
    database.ref().push(newTrain);

    // Clears all of the input fields
    $("#name-input").val("");
    $("#dest-input").val("");
    $("#time-input").val("");
    $("#freq-input").val("");
});

// Firebase watcher + initial loader
database.ref().on("child_added", function (childSnapshot) {

    // Change the HTML to reflect
    var name = childSnapshot.val().name;
    var dest = childSnapshot.val().dest;
    var time = childSnapshot.val().time;
    var freq = childSnapshot.val().freq;

    // Current Time
    var currentTime = moment();

    // First Time Converted (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(childSnapshot.val().time, "hh:mm").subtract(1, "years");

    var trainTime = moment(firstTimeConverted).format("hh:mm");

    // Difference between Current Time and First Time Converted
    var convertTime = moment(trainTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(convertTime), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % freq;

    // Minutes until next train
    var minutesAway = freq - tRemainder;

    // Next train arrival time
    var nextArrival = moment().add(minutesAway, "minutes");

    // Change the HTML to reflect
    var html =
        '<tr class="test">' +
        '<td>' + childSnapshot.val().name + '</td>' +
        '<td>' + childSnapshot.val().dest + '</td>' +
        '<td>' + childSnapshot.val().freq + '</td>' +
        '<td>' + moment(nextArrival).format("hh:mm a") + '</td>' +
        '<td>' + minutesAway + '</td>' +
        '</tr>';

    $('#outPutRow').append(html);

    // Log the values from firebase
    console.log("------ VALUES FROM FIREBASE -------");
    console.log("TRAIN NAME: " + childSnapshot.val().name);
    console.log("DESTINATION: " + childSnapshot.val().dest);
    console.log("FIRST TRAIN: " + childSnapshot.val().time);
    console.log("FREQUENCY: " + childSnapshot.val().freq);
    console.log("NEXT ARRIVAL: " + moment(nextArrival).format("hh:mm a"));
    console.log("MINUTES AWAY: " + minutesAway);

// Handles the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});