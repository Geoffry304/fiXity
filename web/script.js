
window.onload = init;


function init() {
	//getEvent();
        //getMeldingen();
        initialiseListMeldingen();
        initialiseListEvenementen();
}

function getEvent() {
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
	var eventDiv = document.getElementById("eventTonen");
	var events = JSON.parse(responseText);
	for (var i = 0; i < events.length; i++) {
		var event = events[i];
		var div = document.createElement("div");
		div.setAttribute("class", "eventItem");
                div.innerHTML = event.titel + " door " + event.gebruiker.voornaam+ " " + event.gebruiker.naam;
		eventDiv.appendChild(div);
                
	}
}

function getMeldingen() {
	var url = "http://localhost:8080/onzebuurt/resources/meldingen";
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onload = function() {
		if (request.status === 200) {
			updateMeldingen(request.responseText);
		}
	};
	request.send(null);
        
}

function updateMeldingen(responseText) {
	var meldingDiv = document.getElementById("meldingTonen");
	var meldingen = JSON.parse(responseText);
	for (var i = 0; i < meldingen.length; i++) {
		var melding = meldingen[i];
		var div = document.createElement("div");
		div.setAttribute("class", "meldingItem");
                div.innerHTML = melding.titel + " door " + melding.gebruiker.voornaam + "" + melding.gebruiker.naam;
		meldingDiv.appendChild(div);
                
	}
}

function createEventFromInput() {
    //var events = [];
    var event = {};
    
    event.titel = jQuery.trim($("#selectmenuTitelEvent").val());
    event.gebruiker = {gebruikerId: 1};
    event.details = jQuery.trim($("#textareaOmschrijvingEvent").val());
    
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

//    function createGebruikerFromInput() {
//    //var events = [];
//    var gebruiker = {};
//    
//    gebruiker.naam = jQuery.trim($("#selectmenuTitelEvent").val());
//    
//    /*if (event.title.length < 1) {
//        $("#eventDialog .alert-error").text("A event's title cannot be empty").show();
//        return;
//    }
//    
//    for (var i = 0; i < events.length; i++) {
//        if (event.title === events[i].title) {
//            $("#eventDialog .alert-error").text("A event with this title already exists").show();
//            return;
//        }
//    }*/
//    
//    // Send the new group to the back-end.
//    var request = new XMLHttpRequest();
//    var url = "http://localhost:8080/onzebuurt/resources/gebruikers";
//    request.open("POST", url);
//    request.onload = function() {
//        if (request.status === 201) {
//            gebruiker.gebruikerId = request.getResponseHeader("Location").split("/").pop();
//           // events.push(event);
//            /*("#eventList").append(createListElementForGroup(events.length - 1));
//            selectGroupAndLoadReminders(events.length - 1);
//            $(".reminderDialogToggle").attr("disabled", false);
//            $("#eventDialog").modal("hide");*/
//        } else {
//            //$("#eventDialog .alert-error").text("Error creating event. See the console for more information.").show();
//            console.log("Error creating event: " + request.status + " " + request.responseText);
//        }
//    };
//    request.setRequestHeader("Content-Type", "application/json");
//    request.send(JSON.stringify(gebruiker));
//    
//}

function createMeldingFromInput() {
    //var events = [];
    var melding = {};
    
    melding.titel = jQuery.trim($("#selectmenuTitelMeldingen").val());
    melding.details = jQuery.trim($("#textareaOmschrijvingMeldingen").val());
    melding.gebruiker = {gebruikerId: 2};

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
    var url = "http://localhost:8080/onzebuurt/resources/meldingen";
    request.open("POST", url);
    request.onload = function() {
        if (request.status === 201) {
            melding.MeldingId = request.getResponseHeader("Location").split("/").pop();
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
    request.send(JSON.stringify(melding));
    
}

//listview op homepage automatisch laden met meldingen
function initialiseListMeldingen() {
    
    // Load the groups from the back-end.
    var request = new XMLHttpRequest();
    var url = "http://localhost:8080/onzebuurt/resources/meldingen";
    request.open("GET", url);
    request.onload = function() {
        if (request.status === 200) {
            meldingen = JSON.parse(request.responseText);
            for (var i = 0; i < meldingen.length; i++) {
                $("#meldingList").append(createListElementForMelding(i));
            }
            
            if (meldingen.length > 0) {
                console.log("Error");
            } else {
                console.log("Error");
            }
        } else {
            console.log("Error loading groups: " + request.status + " - "+ request.statusText);
        }
    };
    request.send(null);
}

function createListElementForMelding(meldingIndex) {
    
    var link = $("<a>")
        .text(meldingen[meldingIndex].titel + ": " + meldingen[meldingIndex].details);

    var gebruiker = $("<p>") 
        .text("Geplaatst door " + meldingen[meldingIndex].gebruiker.voornaam + " " + meldingen[meldingIndex].gebruiker.naam);

    return $("<li>")
        .append(link)
        .append(gebruiker);
       
}

// listview op homepage laden met Events
function initialiseListEvenementen() {
    
    // Load the groups from the back-end.
    var request = new XMLHttpRequest();
    var url = "http://localhost:8080/onzebuurt/resources/evenements";
    request.open("GET", url);
    request.onload = function() {
        if (request.status === 200) {
            events = JSON.parse(request.responseText);
            for (var i = 0; i < events.length; i++) {
                $("#eventList").append(createListElementForEvent(i));
            }
            
            if (events.length > 0) {
                console.log("Error");
            } else {
                console.log("Error");
            }
        } else {
            console.log("Error loading groups: " + request.status + " - "+ request.statusText);
        }
    };
    request.send(null);
}

function createListElementForEvent(eventIndex) {
    
    var link = $("<a>")
        .text(events[eventIndex].titel + ": " + events[eventIndex].details);

    var gebruiker = $("<p>") 
        .text("Geplaatst door " + events[eventIndex].gebruiker.voornaam + " " + events[eventIndex].gebruiker.naam);

    return $("<li>")
        .append(link)
        .append(gebruiker);
       
}