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

    // The start time from firebase and the startime entered by the train admin
    var dbStartTime = snapshot.val().startTime;
    var mStartTime = moment(dbStartTime, "HH:mm").subtract(1, "years");
    console.log("Start Time Test ", moment(mStartTime).format("hh:mm"))

    // var convertStartTime = moment(mStartTime).format("hh:mm");

    // Difference between the current time and the next start time
    var diffTime = moment().diff(moment(mStartTime), "minutes");

    // Frequency of each train eneterd by the train admin
    var tFrequency = snapshot.val().frequency;

    // Remainder for figuring out the minutes remaining until the next train
    var tRemainder = diffTime % tFrequency;
    // console.log("tfrequency ", tFrequency);

    // Calculating the remaining minutes until the next train to post to the schedule
    var minutesAway = tFrequency - tRemainder;
    console.log("minutes away ", minutesAway);

    // Just formatting the time of the next arrival to display on the schedule
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
    console.log("next arrival ", nextArrival);

    
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

adminDiv.append("<p id='trainAdminTitle'>Train Administration</p>");

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
