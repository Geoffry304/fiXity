
window.onload = init;
window.onhashchange = refresh;
var uid;

function init() {
	//getEvent();
        //getMeldingen();
        initialiseListMeldingen();
        initialiseListEvenementen();
}

        

function refresh(){
    if (events.length > 0 || meldingen.length > 0) {
                $("#eventList").listview('refresh');
                $("#meldingList").listview('refresh');
                //console.log("EvenementenookGelukt");
            } else {
                console.log("Error");
            }
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
     //   $("#eventList").listview('refresh');
   // $("#meldingList").listview('refresh');
   
    
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

//    /*function createGebruikerFromInput() {
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
//}*/

function createMeldingFromInput() {
    //var events = [];
    var melding = {};
    
    
    melding.titel = jQuery.trim($("#selectmenuTitelMeldingen").val());
    melding.details = jQuery.trim($("#textareaOmschrijvingMeldingen").val());
    melding.gebruiker = {gebruikerId : 1};

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
    
    //$("#eventList").listview('refresh');
    //$("#meldingList").listview('refresh');
    console.log(uid);
    
    
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
                console.log("Gelukt");
                $("#meldingList").listview('refresh');
                
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
                $("#eventList").listview('refresh');
                //console.log("EvenementenookGelukt");
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



/*FBLOGIN*/


window.fbAsyncInit = function() {
    FB.init({
        appId: '118529111674998', // App ID
        channelUrl: '//www.webs.hogent.be/timvdv/index.html', // Channel File
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });

}

window.onload = init;


function init() {
	login()
                initialiseListMeldingen();
        initialiseListEvenementen();
}

// Load the SDK Asynchronously
(function(d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));



function logout() {
    FB.logout(function(response) {
        window.location = "#pageAanmelden";
        console.log("Uitgelogd");

    });

}

function createGebruikerFromInput(uid, naam, voornaam, date, email) {
//var events = [];
    var gebruiker = {};

    gebruiker.naam = naam;
    gebruiker.uid = uid;
    gebruiker.voornaam = voornaam;
    gebruiker.geboortedatum = date;
    gebruiker.email = email;
// Send the new group to the back-end.
    var request = new XMLHttpRequest();
    var url = "http://localhost:8080/onzebuurt/resources/gebruikers";
    request.open("POST", url);
    request.onload = function() {
        if (request.status === 201) {
            gebruiker.gebruikerId = request.getResponseHeader("Location").split("/").pop();
        } else {
            console.log("Error creating event: " + request.status + " " + request.responseText);
        }
    };
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(gebruiker));

}


function login() {
    FB.getLoginStatus(function(response) {
        console.log("roept ze aan")
        if (response.status === 'connected') {
            window.location = "#page";
            console.log("Gelukt");


        }
//        else if
//                (response.status === 'not_authorized')
//        {
//            console.log("mss toch dit");
//        }
        else {


            FB.login(function(response) {
                var naam;
                var voornaam;
                

                if (response.authResponse) {
                    uid = response.authResponse.userID;

                    var url = "http://localhost:8080/onzebuurt/resources/gebruikers/";
                    var request = new XMLHttpRequest();
                    request.open("GET", url + uid);
                    request.onload = function() {
                        if (request.status === 200) {
                            window.location = "#page";
                            console.log("pagina 200 open");
                        }
                        else
                        {
                            console.log("404");
                            window.location.href = "#pageTut1";

                            FB.api('/me', function(response) {
                                naam = response.last_name;
                                voornaam = response.first_name;

                                createGebruikerFromInput(uid, naam, voornaam);
                                 console.log(test);
                            });

                        }
                    };
                    request.send(null);
                    // connected


                } else {
                    // cancelled
                }

            });

        }

    });
}

function getGebruikerByUID() {
                   

    var url = "http://localhost:8080/onzebuurt/resources/gebruikers/";
    var request = new XMLHttpRequest();
    request.open("GET", url + uid);
    request.onload = function() {
        if (request.status === 200) {
            
        }
        else
        {
            console.log("404");
        }
    };
    request.send(null);

}