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

    // Calculate Next Arrival time
    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");

    var currentTime = moment();

    var diffTime = moment().diff(firstTimeConverted, "minutes");

    var tRemainder = diffTime % tFrequency;

    var minutesAway = tFrequency - tRemainder;

    var nextArrival = moment().add(minutesAway, "minutes");

    // Log what you're storing from above
    console.log(name);
    console.log(destination);
    console.log(trainTime);
    console.log(tFrequency);
    console.log(nextArrival);

    // Code for the push to firebase
    database.ref().push({
        name: name,
        destination: destination,
        time: trainTime,
        frequency: tFrequency,
        minutes: minutesAway,
        arrival: nextArrival.toLocaleString(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
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

/*
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

    // This is for only populating one child at a time
    // Change the HTML to reflect
    var sv = snapshot.val();

    var html =
        '<tr class="test">' +
        '<td>' + sv.name + '</td>' +
        '<td>' + sv.destination + '</td>' +
        '<td>' + sv.frequency + '</td>' +
        // '<td>$ ' + sv.nextArrival + '</td>' +
        // '<td>$ ' + sv.minutesAway + '</td>' +
        '</tr>';

    $('#outPutRow').append(html);
});
*/