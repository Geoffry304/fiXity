
window.onload = init;


function init() {
	getEvent();
}

function getEvent() {
	// change the URL to match the location where you
	// put the sales.json file
	var url = "http://localhost:8080/onzebuurt/resources/evenements";
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onload = function() {
		if (request.status === 200) {
			updateEvents(request.responseText);
		}
	};
	request.send(null);
        
}

function updateEvents(responseText) {
	var eventDiv = document.getElementById("meldingTonen");
	var events = JSON.parse(responseText);
	for (var i = 0; i < events.length; i++) {
		var event = events[i];
		var div = document.createElement("div");
		div.setAttribute("class", "eventItem");
                div.innerHTML = event.titel + " " + event.gebruiker.voornaam+ " " + event.gebruiker.naam;
		eventDiv.appendChild(div);
                
	}
}

function setEvent(){
var url = "http://localhost:8080/onzebuurt/resources/evenements";
var xhr = new XMLHttpRequest();
xhr.open("POST", url);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
}
xhr.send(JSON.stringify(myData));
}


function createEventFromInput() {
    //var events = [];
    var event = {};
    
    event.titel = jQuery.trim($("#selectmenuTitelEvent").val());
    event.gebruiker = {gebruikerId: 1};
   // event.latitude = latitude;
   // event.longtitude = longtitude;
    
    /*if (event.title.length < 1) {
        $("#eventDialog .alert-error").text("A event's title cannot be empty").show();
        return;
    }
    
    for (var i = 0; i < events.length; i++) {
        if (event.title === events[i].title) {
            $("#eventDialog .alert-error").text("A event with this title already exists").show();
            return;
        }
    }*/
    
    // Send the new group to the back-end.
    var request = new XMLHttpRequest();
    var url = "http://localhost:8080/onzebuurt/resources/evenements";
    request.open("POST", url);
    request.onload = function() {
        if (request.status === 201) {
            event.evenementid = request.getResponseHeader("Location").split("/").pop();
           // events.push(event);
            /*("#eventList").append(createListElementForGroup(events.length - 1));
            selectGroupAndLoadReminders(events.length - 1);
            $(".reminderDialogToggle").attr("disabled", false);
            $("#eventDialog").modal("hide");*/
        } else {
            //$("#eventDialog .alert-error").text("Error creating event. See the console for more information.").show();
            console.log("Error creating event: " + request.status + " " + request.responseText);
        }
    };
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(event));
    
}

/*function createListElementForGroup(groupIndex) {
    var events = [] ;
    var editIcon = $("<i>")
        .addClass("icon-edit icon-large pull-right")
        .click(function(event) {
            event.stopPropagation();
            
            // Prepare the dialog for editing instead of adding.
            editingGroup = true;
            $("#eventDialog h3").text("Edit Event");
            $("#eventTitle").val(events[groupIndex].title);
            $("#eventDialogDelete").show();
            $("#eventDialog").modal("show");
        });
    
    var link = $("<a>")
        .text(events[groupIndex].title)
        .append(editIcon);
    
    return $("<li>")
        .append(link)
        .click(function() {
            selectGroupAndLoadReminders(groupIndex);
        });
}*/

function selectGroupAndLoadReminders(groupIndex, selectedReminderId) {
    
    selectedGroupIndex = groupIndex;
    $("#eventList li").removeClass("active");
    $("#eventList .icon-edit").hide();

    var selectedElement = $("#eventList li")[selectedGroupIndex];
    $(selectedElement).addClass("active");
    $(".icon-edit", selectedElement).show();

    $("#reminderList").empty();

    // Load the reminders in this group from the back-end.
    var request = new XMLHttpRequest();
    request.open("GET", BASE_URL + "/groups/" + groups[selectedGroupIndex].id + "/reminders");
    request.onload = function() {
        if (request.status === 200) {
            reminders = JSON.parse(request.responseText);
            for (var i = 0; i < reminders.length; i++) {
                $("#reminderList").append(createListElementForReminder(i));
            }
            
            if (selectedReminderId !== undefined) {
                for (var i = 0; i < reminders.length; i++) {
                    if (reminders[i].id === selectedReminderId) {
                        selectReminder(i);
                        break;
                    }
                }
            } else if (reminders.length > 0) {
                selectReminder(0);
            }
        } else {
            console.log("Error loading reminders: " + request.status + " - " + request.statusText);
        }
    };
    request.send(null);
}
