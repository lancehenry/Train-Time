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

// Variables to store data
var name;
var destination;
var trainTime;
var tFrequency;

$("#submitBtn").on("click", function (event) {
    event.preventDefault();

    // Store the most recent train information entered
    name = $("#trainName").val().trim();
    destination = $("#trainDestination").val().trim();
    trainTime = $("#trainTime").val().trim();
    tFrequency = $("#trainFrequency").val().trim();

    // First Time Converted (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between Current Time and First Time Converted
    var diffTime = moment().diff(firstTimeConverted, "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minutes until next train
    var minutesAway = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next train arrival time
    var nextArrival = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: name,
        destination: destination,
        time: trainTime,
        frequency: tFrequency,
        minutes: minutesAway,
        arrival: nextArrival.toLocaleString(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    // Uploads train data to the firebase
    database.ref().push(newTrain);

    // Clears all of the input fields
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainTime").val("");
    $("#trainFrequency").val("");
});

// Firebase watcher + initial loader
database.ref().on("child_added", function (childSnapshot) {

    // Change the HTML to reflect
    var sv = childSnapshot.val();

    var nextTrainFormat = moment(sv.arrival).format("hh:mm");

    var html =
        '<tr class="test">' +
        '<td>' + sv.name + '</td>' +
        '<td>' + sv.destination + '</td>' +
        '<td>' + sv.frequency + '</td>' +
        '<td>' + nextTrainFormat + '</td>' +
        '<td>' + sv.minutes + '</td>' +
        '</tr>';

    $('#outPutRow').append(html);

    // Log the values from firebase
    console.log("------ VALUES FROM FIREBASE -------");
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().time);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().arrival);
    console.log(childSnapshot.val().minutes);

// Handles the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});