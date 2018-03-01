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
var frequency;
var nextArrival;
var minutesAway;

$("#submitBtn").on("click", function () {



    
})