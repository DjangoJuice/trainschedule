$( document ).ready(function() {

// Create a header at the top of the page
$(".bodyHeaderTitle").html("<h1>Train Schedule</h1>");

// Initialize firebase
firebase.initializeApp({
    apiKey: "AIzaSyCs2KjuxQf2HC0sevuACM7qAIWO6OgTBYM",
    authDomain: "assignment7-firebase.firebaseapp.com",
    databaseURL: "https://assignment7-firebase.firebaseio.com/",
    projectId: "assignment7-firebase",
    storageBucket: "",
    messagingSenderId: "651904821583"});

let database = firebase.database()

// Create the table for the Current Train Schedule
var scheduleRow = $("<tr>");
scheduleRow.append($("<th  scope='col'>Train Name</th>"));
scheduleRow.append($("<th  scope='col'>Destination</th>"));
scheduleRow.append($("<th  scope='col'>Frequency (Mins)</th>"));
scheduleRow.append($("<th  scope='col'>Next Arrival</th>"));
scheduleRow.append($("<th  scope='col'>Minutes Away</th>"));

var scheduleTHead = $("<thead>");
scheduleTHead.append(scheduleRow);

var currTrainTbl = $("<table>");
currTrainTbl.attr({"class": "table", "id":"currTrainTbl"});
currTrainTbl.append(scheduleTHead);

$("#currentTrainSchd").append(currTrainTbl);


// Firebase watcher + updating the Train Schedule table
database.ref().on("child_added", function(snapshot) {

    
    var dbStartTime = snapshot.val().startTime;
    var mStartTime = moment(dbStartTime, "HH:mm").subtract(1, "years");
    console.log("mStartTime ", mStartTime);
    console.log("test ", moment(mStartTime).format("hh:mm"))
    var convertStartTime = moment(mStartTime).format("hh:mm");
    var diffTime = moment().diff(moment(mStartTime), "minutes");
    console.log("diffTime ", diffTime);
    var tFrequency = snapshot.val().frequency;
    var tRemainder = diffTime % tFrequency;
    console.log("tfrequency ", tFrequency);
    var minutesAway = tFrequency - tRemainder;
    var nextArrival = moment().add(minutesAway, "hh:mm").format("hh:mm");
    console.log("next arrival ", nextArrival);
    //console.log("Test ", moment(startTime).format("hh:mm"))
    // console.log("start time ", startTime)
    // console.log(startTime.constructor == String)
    // var currentTime = moment();
    // var diffTime = moment().diff(moment("09:30"), "minutes");
    // console.log("What is this ", moment(startTime))
    // console.log("startTime ", startTime)
    // console.log("DIFFERENCE IN TIME: " + moment(startTime));


    // Log everything that's coming out of snapshot
    // console.log(snapshot.val().name);
    // console.log(snapshot.val().dest);
    // console.log(snapshot.val().startTime);
    // console.log(snapshot.val().frequency);
    
    // Change the HTML Table to reflect this (#currTrainTbl)
    var scheduleRowData = $("<tr>");
    scheduleRowData.append("<th>" + snapshot.val().name + "</th>");
    scheduleRowData.append("<th>" + snapshot.val().dest + "</th>");
    scheduleRowData.append("<th>" + snapshot.val().frequency + "</th>");
    scheduleRowData.append("<th>" + nextArrival + "</th>");
    scheduleRowData.append("<th>" + minutesAway + "</th>");

    var scheduleTbody = $("<tbody>");
    scheduleTbody.append(scheduleRowData);

    $("#currTrainTbl").append(scheduleTbody);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });



// Create a form for the Train Admin to add a new train to the schedule 
var adminDiv = $("<div>");
adminDiv.attr({"class": "form-group", "id":"trainAdminForm"});

adminDiv.append("<label for='trainName'>Train Name</label>");
adminDiv.append("<input type='text' class='form-control' id='adminTrainName' aria-describedby='trainName' placeholder='Enter train name'>");

adminDiv.append("<label for='trainDest'>Destination</label>");
adminDiv.append("<input type='text' class='form-control' id='adminDestination' aria-describedby='trainDest' placeholder='Enter train destination'>");

adminDiv.append("<label for='firstTrainTime'>First Train Time [HH:mm (military time)]</label>");
adminDiv.append("<input type='text' class='form-control' id='adminTrainTime' aria-describedby='trainTime' placeholder='Enter train departure'>");


adminDiv.append("<label for='trainFreq'>Train Frequency (min)</label>");
adminDiv.append("<input type='text' class='form-control' id='adminTrainFreq' aria-describedby='trainFreq' placeholder='Enter train frequency'>");

adminDiv.append("<button type='submit' class='btn btn-primary' id='adminSubmit'>Submit</button>");

var adminForm = $("<form>");
adminForm.append(adminDiv);
$("#trainAdminDiv").append(adminForm);



// Testing Moment JS library
function show(msg) {

    $('.console').append(`<p>${msg}</p>`);
    console.log(msg);
};

// Military Time
//show(JSON.stringify(database.ref().startTime));
// 3:30 PM
//show(moment(database.ref().startTime).format("hh:mm A"));

// var randomDate = "02/23/1999";
// var randomFormat = "MM/DD/YYYY";
// var convertedDate = moment(randomDate, randomFormat);

// show(moment(convertedDate).format("MM/DD/YY"));
// show(moment(convertedDate).format("MMM Do, YYYY hh:mm:ss"));
// show(moment(convertedDate).format("X"));
// show("----------------------------------------");

// The Train Admin should use this submit button to send train schedule data
$('#adminSubmit').on('click', function(event){
    event.preventDefault();
    console.log('clicked');
    console.log($('#adminTrainName').val());
    console.log($("#adminDestination").val());
    console.log($("#adminTrainName").val());
    console.log($("#adminTrainFreq").val());

    // var Train Name
        // Also needs to create value in Firebase
    var adminTrainName = $("#adminTrainName").val().trim();
    // var Train Destination
        // Also needs to create value in Firebase
    var adminDestination = $("#adminDestination").val().trim();
    // var first train arrival time
        // Also needs to create value in Firebase
    var adminTrainTime = $("#adminTrainTime").val().trim();
    // var Train Frequency
        // Also needs to create value in Firebase
    var adminTrainFreq = $("#adminTrainFreq").val().trim();

    // var for next arrival
    // var for minutes away

    // Push the Train Admin's new values to Firebase
    database.ref().push({
      name: adminTrainName,
      dest: adminDestination,
      startTime: adminTrainTime,
      frequency: adminTrainFreq
  })
});



// function Determine the next arrival of a train
// function Determine how long (in mins) for the next train arrival




}); // Terminate $( document ).ready(function()
