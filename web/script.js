
window.onload = init;


function init() {
	getEvent();
        getMelding();
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
                div.innerHTML = event.titel + " " + event.gebruiker.voornaam+ " " + event.gebruiker.naam;
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
                div.innerHTML = melding.titel;
		meldingDiv.appendChild(div);
                
	}
}

function createEventFromInput() {
    //var events = [];
    var event = {};
    
    event.titel = jQuery.trim($("#selectmenuTitelEvent").val());
    event.gebruiker = {gebruikerId: 1};
    event.details = jQuery.trim($("#textareaOmschrijvingEvent").val());
    //event.datum = $('#datepickerEvent').datepicker({ dateFormat: 'dd-mm-yy' }).val();



    
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

    function createGebruikerFromInput() {
    //var events = [];
    var gebruiker = {};
    
    gebruiker.naam = jQuery.trim($("#selectmenuTitelEvent").val());
    
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
    var url = "http://localhost:8080/onzebuurt/resources/gebruikers";
    request.open("POST", url);
    request.onload = function() {
        if (request.status === 201) {
            gebruiker.gebruikerId = request.getResponseHeader("Location").split("/").pop();
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
    request.send(JSON.stringify(gebruiker));
    
}

function createMeldingFromInput() {
    //var events = [];
    var melding = {};
    
    melding.titel = jQuery.trim($("#selectmenuTitelMelding").val());
    melding.details = jQuery.trim($("#textareaOmschrijvingMelding").val());
    melding.gebruiker = {gebruikerId: 1};

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
