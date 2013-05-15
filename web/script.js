window.onload = init;

var uid;
var latitude;
var longitude;
var gebruikerid;
var BASE_URL = "http://localhost:8080/onzebuurt/resources/";
var fileName;

function init() {
console.log(uid);
if (uid === undefined) {
    login();
    //window.location = "#pageAanmelden";
} else {
    window.location = "#pageMelding";
}

initialiseListMeldingen();
initialiseListEvenementen();
initialiseListMeldingenAdmin();
initialiseListEvenementenAdmin();
initialiseListGebruikersAdmin();

}

//zet een event in de database
function createEventFromInput() {
sendFile();
var request = new XMLHttpRequest();

request.open("GET", BASE_URL + "gebruikers/fbid/" + uid);
request.onload = function() {
    if (request.status === 200) {
        var gebruiker = JSON.parse(request.responseText);
        gebruikerid = gebruiker.gebruikerId;
        console.log(gebruikerid);
        var event = {};
        var details = jQuery.trim($("#textareaOmschrijvingEvent").val());
        var datum = jQuery.trim($("#datepickerEvent").val());

        event.titel = jQuery.trim($("#selectmenuTitelEvent").val());
        
        event.locatie = {latitude: latitude, longitude: longitude};
        event.gebruiker = {gebruikerId: gebruikerid};
        
        console.log(fileName);
        event.afbeelding = fileName;
        
        if(details === ""){
            event.details = "Geen beschrijving";
        }
        else
            {
             event.details = details;   
            }
         
                 if(datum === ""){
            event.datum = "Geen datum";
        }
        else
            {
             event.datum = details;   
            }

        // Send the new group to the back-end.
        request.open("POST", BASE_URL + "evenements");
        request.onload = function() {
            if (request.status === 201) {
                event.evenementid = request.getResponseHeader("Location").split("/").pop();
            } else {
                console.log("Error creating event: " + request.status + " " + request.responseText);
            }
        };

        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(event));
    }
    else
    {
        console.log("404");
    }
};
request.send(null);

//sendFile();
//        window.reload('#page');
//    window.reload('#pageEvent');
}

//zet een melding in de database
function createMeldingFromInput() {
sendFileMelding();
var request = new XMLHttpRequest();
request.open("GET", BASE_URL + "gebruikers/fbid/" + uid);
request.onload = function() {
    if (request.status === 200) {
        var gebruiker = JSON.parse(request.responseText);
        gebruikerid = gebruiker.gebruikerId;
        console.log(gebruikerid);
        var melding = {};
        var details = jQuery.trim($("#textareaOmschrijvingMeldingen").val());


        melding.titel = jQuery.trim($("#selectmenuTitelMeldingen").val());
        
        melding.locatie = {latitude: latitude, longitude: longitude};
        melding.gebruiker = {gebruikerId: gebruikerid};
        melding.afbeelding = fileName;
        
        if (details === ""){
             melding.details = "Geen beschrijving"
        }
        else{
            melding.details = details;
             } 

        if (jQuery.trim($("#flipswitchFBMeldingen").val()) === "on")
        {
            alert("Facebook schakelaar aan");
            //postToFeed();
        }

        // Send the new group to the back-end.
        request.open("POST", BASE_URL + "meldingen");
        request.onload = function() {
            if (request.status === 201) {
                melding.MeldingId = request.getResponseHeader("Location").split("/").pop();
            } else {
                console.log("Error creating event: " + request.status + " " + request.responseText);
            }
        };

        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(melding));
    }
    else
    {
        console.log("404");
    }
};
request.send(null);
}

//listview op homepage automatisch laden met meldingen
function initialiseListMeldingen() {

// Load the groups from the back-end.
var request = new XMLHttpRequest();
$("#meldingList").empty();
$("#meldingListAdmin").empty();

request.open("GET", BASE_URL + "meldingen");
request.onload = function() {
    if (request.status === 200) {
        meldingen = JSON.parse(request.responseText);
        for (var i = 0; i < meldingen.length; i++) {
            $("#meldingList").append(createListElementForMelding(i));
            //$("#meldingListAdmin").append(createListElementForMeldingAdmin(i));

        }
        if (meldingen.length > 0) {
            console.log("Gelukt");
            $("#meldingList").listview('refresh');
            //$("#meldingListAdmin").listview('refresh');

        } else {
            console.log("Error");

        }
    } else {
        console.log("Error loading groups: " + request.status + " - " + request.statusText);

    }
};
request.send(null);
}

function initialiseListMeldingenAdmin() {

// Load the groups from the back-end.
var request = new XMLHttpRequest();
$("#meldingListAdmin").empty();

request.open("GET", BASE_URL + "meldingen");
request.onload = function() {
    if (request.status === 200) {
        meldingen = JSON.parse(request.responseText);
        for (var i = 0; i < meldingen.length; i++) {
            var mid = meldingen[i].meldingId;
            $("#meldingListAdmin").append(createListElementForMeldingAdmin(i, mid));

        }
        if (meldingen.length > 0) {
            console.log("Gelukt");
            $("#meldingListAdmin").listview('refresh');

        } else {
            console.log("Error");

        }
    } else {
        console.log("Error loading groups: " + request.status + " - " + request.statusText);

    }
};
request.send(null);
}

//maakt de listview in de front end aan (HTML)
function createListElementForMelding(meldingIndex) {

var link = $("<a>")
        .text(meldingen[meldingIndex].titel + ": " + meldingen[meldingIndex].details);

var gebruiker = $("<p>")
        .text("Geplaatst door " + meldingen[meldingIndex].gebruiker.voornaam + " " + meldingen[meldingIndex].gebruiker.naam);

return $("<li>")
        .append(link)
        .append(gebruiker)
        .click(function() {
    createPageMeldingInformation(meldingIndex);
});
}

//maakt de listview in de front end aan (HTML) voor admin pagina
function createListElementForMeldingAdmin(meldingIndex, mid) {

var link = $("<a>")
        .text(meldingen[meldingIndex].titel + ": " + meldingen[meldingIndex].details)
        .click(function() {
    createPageMeldingInformationAdmin(meldingIndex);
});

var gebruiker = $("<p>")
        .text("Geplaatst door " + meldingen[meldingIndex].gebruiker.voornaam + " " + meldingen[meldingIndex].gebruiker.naam)
        .click(function() {
    createPageMeldingInformationAdmin(meldingIndex);
});

var icon = $("<a>")
        .text("wijzigen/verwijderen")
        .click(function() {
    deleteMelding(mid);
});

return $("<li>")
        .append(link)
        .append(gebruiker)
        .append(icon)

}

function mapMeldingInformatie() {
var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
    mapTypeId: google.maps.MapTypeId.ROADMAP
};
map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}
$(document).on("pageshow", "#pageAdminOpties", function() {

mapMeldingInformatie();

});

//vult de nieuwe pagina als je op de listview van meldingen klikt
function createPageMeldingInformation(meldingIndex) {
var titel = meldingen[meldingIndex].titel;
var gebruiker = meldingen[meldingIndex].gebruiker.voornaam + " " + meldingen[meldingIndex].gebruiker.naam;
var details = meldingen[meldingIndex].details;
var locatie = meldingen[meldingIndex].locatie.latitude + " , " + meldingen[meldingIndex].locatie.longitude;
var afbeelding = meldingen[meldingIndex].afbeelding;
var lat = meldingen[meldingIndex].locatie.latitude;
var long = meldingen[meldingIndex].locatie.longitude;
var meldingId = meldingen[meldingIndex].meldingId;


var img = BASE_URL + "images/" + afbeelding;
console.log(afbeelding);
initialiseListFeedbackMelding(meldingId);
function initialize4()
{

  var mapProp = {
      center: new google.maps.LatLng(lat, long),
      zoom: 16,
      mapTypeControl: false,
      draggable: false,
      scaleControl: false,
      scrollwheel: false,
      navigationControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

            
var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
  marker = new google.maps.Marker({
                 position: new google.maps.LatLng(lat, long),
                 animation: google.maps.Animation.DROP,
                 map: map,
                 title: titel + ": " + details,
                 
            });
}

  $(document).on("pageshow", "#meldingInfo", function() {
   
        initialize4();
    
});

var pageMeldingInformation = $("<div id=meldingInfo data-role=page data-url=meldingInformation ><div data-theme=b data-role=header ><a onclick=refreshPage(); href=#page data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + titel + " </h1></div><div id=googleMap style=width:100%;height:380px;></div><div data-role=collapsible data-inset=false data-theme=c data-content-theme=d data-collapsed=false style=margin: 10px 10px 10px 10px><h2>" + "Informatie" + "</h2><div id=first>" + "Titel: " + "</div><div id=second>" + titel + "</div></p><div id=first>" + "Omschrijving: " + "</div><div id=second>" + details + "</div></p><div id=first>" + "Locatie: " + "</div><div id=second>" + locatie +"</div></p><div id=first>" + "Geplaatst door: " + "</div><div id=second>" +gebruiker + "</div></p></div><div data-role=collapsible data-inset=false data-theme=c data-content-theme=d><h2>" + "Foto" + "</h2><img src="+ img +" style=width:350px;height:350px></div><div data-role=collapsible data-inset=false data-theme=c data-content-theme=d><h2>" + "Reacties</h2><div id=first>" + "Tim Van de Velde: " + "</div><div id=second>" + "Dit is een reactie." + "</div></p><ul data-role=listview id=FeedbackMeldingList><p>" + "<textarea cols=40 rows=8 name=textarea id=plaatsReactieMelding placeholder=Reageer></textarea><a onclick='createFeedbackEvent("+ meldingId  +");'href=# id=btnEventAanpassen data-role=button data-icon=check>Plaats</a></div></div>");

//var pageMeldingInformation = $("<div data-role=page data-url=meldingInformation><div data-theme=b data-role=header ><a onclick=refreshPage(); href=#page data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + titel + " </h1></div><div id=map-canvas style=width:500px;height:580px;></div><div data-role=content><img src=" + img + " style=width:350px;height:350px><p>" + "Geplaatst door: " + gebruiker + "</p><p>" + "\n\Omschrijving: " + details + "</p><p>" + "Locatie: " + locatie + "</p></div></div");
//append it to the page container
pageMeldingInformation.appendTo($.mobile.pageContainer);

//go to it
$.mobile.changePage(pageMeldingInformation);
}

//vult de nieuwe pagina als je op de listview van meldingen klikt
function createPageMeldingInformationAdmin(meldingIndex) {
var titel = meldingen[meldingIndex].titel;
var gebruiker = meldingen[meldingIndex].gebruiker.voornaam + " " + meldingen[meldingIndex].gebruiker.naam;
var details = meldingen[meldingIndex].details;
var locatie = meldingen[meldingIndex].locatie.latitude + " , " + meldingen[meldingIndex].locatie.longitude;
var mid = meldingen[meldingIndex].meldingId;
var gid = meldingen[meldingIndex].gebruiker.gebruikerId;
var lat = meldingen[meldingIndex].locatie.latitude;
var long = meldingen[meldingIndex].locatie.longitude;

console.log(titel);
console.log(gid);

var pageMeldingInformation = $("<div data-role=page data-url=meldingInformation><div data-theme=b data-role=header ><a href=#pageAdminMeldingen data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + titel + " </h1></div><div data-role=content><p>" + "\n\Titel: <textarea cols=40 rows=8 name=textarea id=textareaTitelMeldingenAdmin>" + titel + "</textarea></p><p>" + "Geplaatst door: " + gebruiker + "</p><p>" + "Locatie: " + locatie + "</p><p>" + "\n\Omschrijving: <textarea cols=40 rows=8 name=textarea id=textareaOmschrijvingMeldingenAdmin>" + details + "</textarea></p><a onclick='updateMelding(" + mid + "," + gid + "," + lat + "," + long + "," + mid + ")' href=#pageAdminMeldingen id=btnMeldingAanpassen data-role=button data-icon=check>Aanpassen</a></div></div");
//append it to the page container
pageMeldingInformation.appendTo($.mobile.pageContainer);

//go to it
$.mobile.changePage(pageMeldingInformation);
}

//delete melding via het adminpaneel
function deleteMelding(meldingIndex) {

// Send a delete request to the back-end.

var request = new XMLHttpRequest();
request.open("DELETE", BASE_URL + "meldingen/" + meldingIndex);
request.onload = function() {
    if (request.status === 204) {
        console.log("gelukt");
    } else {
        console.log("Error deleting group: " + request.status + " - " + request.statusText);
    }
};
request.send(null);
}

//past een melding aan via het updatepaneel
function updateMelding(meldingIndex, gid, lat, long, mid) {
var melding = jQuery.extend(true, {}, meldingen[meldingIndex]);
//var tit = "Andere";

console.log("titel bij functie: ");

var request = new XMLHttpRequest();
request.open("GET", BASE_URL + "gebruikers/gebruikerid/" + gid);
request.onload = function() {
    if (request.status === 200) {
        var gid2;
        var gebruiker = JSON.parse(request.responseText);
        gid2 = gebruiker.gebruikerId;
        console.log(gid2);
        melding.titel = jQuery.trim($("#textareaTitelMeldingenAdmin").val());
        melding.gebruiker = {gebruikerId: gid2};
        melding.locatie = {latitude: lat, longitude: long};
        melding.meldingId = mid;
        melding.details = jQuery.trim($("#textareaOmschrijvingMeldingenAdmin").val());

        // Send the new group to the back-end.

        request.open("PUT", BASE_URL + "meldingen/" + meldingIndex);
        request.onload = function() {
            if (request.status === 204) {

            } else {
                console.log("Error creating event: " + request.status + " " + request.responseText);
            }
        };
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(melding));

    }
    else
    {
        console.log("404");
    }
};
request.send(null);

}

// listview op homepage laden met Events
function initialiseListEvenementen() {
// Load the groups from the back-end.
var request = new XMLHttpRequest();
$("#eventList").empty();

request.open("GET", BASE_URL + "evenements");
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
        console.log("Error loading groups: " + request.status + " - " + request.statusText);
    }
};
request.send(null);
}

//maakt de listview in de front end aan (HTML) voor admin pagina
function createListElementForEventAdmin(eventIndex, mid) {

var link = $("<a>")
        .text(events[eventIndex].titel + ": " + events[eventIndex].details)
        .click(function() {
    createPageEventInformationAdmin(eventIndex);
});

var gebruiker = $("<p>")
        .text("Geplaatst door " + events[eventIndex].gebruiker.voornaam + " " + events[eventIndex].gebruiker.naam)
        .click(function() {
    createPageEventInformationAdmin(eventIndex);
});

var icon = $("<a>")
        .text("verwijderen")
        .click(function() {
    deleteEvent(mid);
});

return $("<li>")
        .append(link)
        .append(gebruiker)
        .append(icon)

}

// listview op homepage laden met Events voor admin
function initialiseListEvenementenAdmin() {
// Load the groups from the back-end.
var request = new XMLHttpRequest();
$("#evenementenListAdmin").empty();

request.open("GET", BASE_URL + "evenements");
request.onload = function() {
    if (request.status === 200) {
        events = JSON.parse(request.responseText);
        for (var i = 0; i < events.length; i++) {
            var mid = events[i].evenementId;
            $("#evenementenListAdmin").append(createListElementForEventAdmin(i, mid));
        }
        if (events.length > 0) {

            $("#evenementenListAdmin").listview('refresh');
            //console.log("EvenementenookGelukt");
        } else {
            console.log("Error");
        }
    } else {
        console.log("Error loading groups: " + request.status + " - " + request.statusText);
    }
};
request.send(null);
}

//maakt de listview in de front end aan (HTML)
function createListElementForEvent(eventIndex) {

var link = $("<a>")
        .text(events[eventIndex].titel + ": " + events[eventIndex].details);

var gebruiker = $("<p>")
        .text("Geplaatst door " + events[eventIndex].gebruiker.voornaam + " " + events[eventIndex].gebruiker.naam);

return $("<li>")
        .append(link)
        .append(gebruiker)
        .click(function() {
    createPageEventInformation(eventIndex);
});
}

//vult de pagina op als je op listview klikt
function createPageEventInformation(eventIndex) {
var titel = events[eventIndex].titel;
var gebruiker = events[eventIndex].gebruiker.voornaam + " " + events[eventIndex].gebruiker.naam;
var details = events[eventIndex].details;
var locatie = events[eventIndex].locatie.latitude + " , " + events[eventIndex].locatie.longitude;
var datum = events[eventIndex].datum;
var afbeelding = events[eventIndex].afbeelding;
var lat = events[eventIndex].locatie.latitude;
var long = events[eventIndex].locatie.longitude;

function initialize3()
{

  var mapProp = {
      center: new google.maps.LatLng(lat, long),
      zoom: 16,
      mapTypeControl: false,
      draggable: false,
      scaleControl: false,
      scrollwheel: false,
      navigationControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

            
var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
  marker = new google.maps.Marker({
                 position: new google.maps.LatLng(lat, long),
                 animation: google.maps.Animation.DROP,
                 map: map,
                 title: titel + ": " + details,
                 
            });
}

  $(document).on("pageshow", "#eventInfo", function() {
   
        initialize3();
    
});



//var img = $("<img>").attr("src", BASE_URL + "images/" + afbeelding)
    var img = BASE_URL + "images/" + afbeelding;
console.log(afbeelding);

//initialize3(lat, long);
var newPage = $("<div id=eventInfo data-role=page data-url=eventInformation ><div data-theme=b data-role=header ><a onclick= refreshPage(); href=#pageEvent data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + titel + " </h1></div><div id=googleMap style=width:100%;height:380px;></div><div data-role=collapsible data-inset=false data-theme=c data-content-theme=d data-collapsed=false style=margin: 10px 10px 10px 10px><h2>" + "Informatie" + "</h2><div id=first>" + "Titel: " +"</div><div id=second>" + titel + "</div></p><div id=first>" + "Omschrijving: " + "</div><div id=second>" + details +"</div></p><div id=first>" + "Locatie:" + "</div><div id=second>" + locatie +" </div></p><div id=first>" + "Datum: " + "</div><div id=second>" + datum + "</div></p><div id=first>" + "Geplaatst door:"  + "</div><div id=second>" + gebruiker + "</div></p></div><div data-role=collapsible data-inset=false data-theme=c data-content-theme=d><h2>" + "Foto" + "</h2><img src="+ img +" style=width:350px;height:350px></div><div data-role=collapsible data-inset=false data-theme=c data-content-theme=d><h2>" + "Reacties</h2><p>" + "<div id=first>" + "Tim Van de Velde: " + "</div><div id=second>" + "Dit is een reactie." + "</div></p><p>" + "<textarea cols=40 rows=8 name=textarea id=plaatsReactie placeholder=Reageer></textarea><a href=# id=btnEventAanpassen data-role=button data-icon=check>Plaats</a></div></div>");

//append it to the page container
newPage.appendTo( $.mobile.pageContainer );
 
//go to it
$.mobile.changePage( newPage );
}

//vult de pagina op als je op listview klikt
function createPageEventInformationAdmin(eventIndex) {
var titel = events[eventIndex].titel;
var gebruiker = events[eventIndex].gebruiker.voornaam + " " + events[eventIndex].gebruiker.naam;
var details = events[eventIndex].details;
var datum = events[eventIndex].datum;
var locatie = events[eventIndex].locatie.latitude + " , " + events[eventIndex].locatie.longitude;
var mid = events[eventIndex].evenementId;
var gid = events[eventIndex].gebruiker.gebruikerId;
var lat = events[eventIndex].locatie.latitude;
var long = events[eventIndex].locatie.longitude;

var afbeelding = events[eventIndex].afbeelding;

//var img = $("<img>").attr("src", BASE_URL + "images/" + afbeelding)
var img = BASE_URL + "images/" + afbeelding;

var newPage = $("<div data-role=page data-url=eventAdminInformation><div data-theme=b data-role=header ><a href=#pageAdminEvenementen data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + titel + " </h1></div><div data-role=content><img src=" + img + " style=width:350px;height:350px><p>" + "\n\Titel: <textarea cols=40 rows=8 name=textarea id=textareaTitelEvenementenAdmin>" + titel + "</textarea></p><p>" + "Geplaatst door: " + gebruiker + "</p><p>" + "Locatie: " + locatie + "</p><p>" + "\n\Omschrijving: <textarea cols=40 rows=8 name=textarea id=textareaOmschrijvingEvenementenAdmin>" + details + "</textarea></p><p>" + "\n\Datum: <textarea cols=40 rows=8 name=textarea id=textareaDatumEvenementenAdmin>" + datum + "</textarea></p><a onclick='updateEvent(" + mid + "," + gid + "," + lat + "," + long + "," + mid + ")' href=#pageAdminEvenementen id=btnMeldingAanpassen data-role=button data-icon=check>Aanpassen</a></div></div");
//append it to the page container

newPage.appendTo($.mobile.pageContainer);

//go to it
$.mobile.changePage(newPage);
}

function initialiseListGebruikersAdmin() {

// Load the groups from the back-end.
var request = new XMLHttpRequest();
$("#gebruikersListAdmin").empty();

request.open("GET", BASE_URL + "gebruikers");
request.onload = function() {
    if (request.status === 200) {
        gebruikers = JSON.parse(request.responseText);
        for (var i = 0; i < gebruikers.length; i++) {
            var gid = gebruikers[i].gebruikerId;
            $("#gebruikersListAdmin").append(createListElementForGebruikerAdmin(i, gid));

        }
        if (gebruikers.length > 0) {
            console.log("Gelukt");
            $("#gebruikersListAdmin").listview('refresh');

        } else {
            console.log("Error");

        }
    } else {
        console.log("Error loading groups: " + request.status + " - " + request.statusText);

    }
};
request.send(null);
}

function createListElementForGebruikerAdmin(gebruikerIndex, gid) {

var link = $("<a>")
        .text(gebruikers[gebruikerIndex].naam + " " + gebruikers[gebruikerIndex].voornaam)
        .click(function() {
    createPageGebruikerInformationAdmin(gebruikerIndex);
});

//    var gebruiker = $("<p>") 
//        .text("Geplaatst door " + gebruikers[gebruikerIndex].gebruiker.voornaam + " " + gebruikers[gebruikerIndex].gebruiker.naam)
//                .click(function() {
//            createPageGebruikerInformationAdmin(gebruikerIndex);     
//        });

var icon = $("<a>")
        .text("verwijderen")
        .click(function() {
    deleteGebruiker(gid);
});

return $("<li>")
        .append(link)
//        .append(gebruiker)
        .append(icon)

}

function createPageGebruikerInformationAdmin(gebruikerIndex) {
var naam = gebruikers[gebruikerIndex].naam;
var voornaam = gebruikers[gebruikerIndex].voornaam;
var uid = gebruikers[gebruikerIndex].uid;
var email = gebruikers[gebruikerIndex].email;
var gebruikerid = gebruikers[gebruikerIndex].gebruikerId;



//past een melding aan via het updatepaneel

console.log(gebruikerid);
var newPage = $("<div data-role=page data-url=eventAdminInformation><div data-theme=b data-role=header ><a href=#pageAdminGebruikers data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + naam + " </h1></div><div data-role=content><p>" + "\n\Voornaam: <textarea cols=40 rows=8 name=textarea id=textareaVoornaamGebruikerAdmin>" + voornaam + "</textarea></p>" +
        "<p>" + "\n\Achternaam: <textarea cols=40 rows=8 name=textarea id=textareaAchternaamGebruikerAdmin>" + naam + "</textarea></p>" +
        "<p>" + "\n\Uid: <textarea cols=40 rows=8 name=textarea id=textareaUidGebruikerAdmin>" + uid + "</textarea></p>" +
        "<p>" + "\n\E-Mail: <textarea cols=40 rows=8 name=textarea id=textareaEmailGebruikerAdmin>" + email + "</textarea></p>" +
        "<a onclick='updateGebruiker("+ gebruikerIndex + "," + gebruikerid + ")' href=#pageAdminGebruikers id=btnGebruikerAanpassen data-role=button data-icon=check>Aanpassen</a></div></div");
//append it to the page container
newPage.appendTo($.mobile.pageContainer);

//go to it
$.mobile.changePage(newPage);
}

function deleteGebruiker(gebruikerIndex) {

// Send a delete request to the back-end.

var request = new XMLHttpRequest();
request.open("DELETE", BASE_URL + "gebruikers/gebruikerid/" + gebruikerIndex);
request.onload = function() {
    if (request.status === 204) {
        console.log("gelukt");
    } else {
        console.log("Error deleting group: " + request.status + " - " + request.statusText);
    }
};
request.send(null);
}

//past een melding aan via het updatepaneel
function updateGebruiker(gebruikerIndex, gebruikerid) {
var gebruiker = jQuery.extend(true, {}, gebruikers[gebruikerIndex]);


gebruiker.naam = jQuery.trim($("#textareaAchternaamGebruikerAdmin").val());
gebruiker.voornaam = jQuery.trim($("#textareaVoornaamGebruikerAdmin").val());
gebruiker.uid = jQuery.trim($("#textareaUidGebruikerAdmin").val());
gebruiker.email = jQuery.trim($("#textareaEmailGebruikerAdmin").val());
// Send the new group to the back-end.
var request = new XMLHttpRequest();
request.open("PUT", BASE_URL + "gebruikers/gebruikerid/" + gebruikerid);
request.onload = function() {
    if (request.status === 204) {

    } else {
        console.log("Error creating event: " + request.status + " " + request.responseText);
    }
};
request.setRequestHeader("Content-Type", "application/json");
request.send(JSON.stringify(gebruiker));

}

//delete melding via het adminpaneel
function deleteEvent(eventIndex) {

// Send a delete request to the back-end.

var request = new XMLHttpRequest();
request.open("DELETE", BASE_URL + "evenements/" + eventIndex);
request.onload = function() {
    if (request.status === 204) {
        console.log("gelukt");
    } else {
        console.log("Error deleting group: " + request.status + " - " + request.statusText);
    }
};
request.send(null);
}

//past een melding aan via het updatepaneel
function updateEvent(eventIndex, gid, lat2, long2, mid2) {
var event = jQuery.extend(true, {}, events[eventIndex]);
//var tit = "Andere";

console.log("titel bij functie: ");

var request = new XMLHttpRequest();
request.open("GET", BASE_URL + "gebruikers/gebruikerid/" + gid);
request.onload = function() {
    if (request.status === 200) {
        var gid2;
        var gebruiker = JSON.parse(request.responseText);
        gid2 = gebruiker.gebruikerId;
        console.log(gid2);
        event.titel = jQuery.trim($("#textareaTitelEvenementenAdmin").val());
        event.gebruiker = {gebruikerId: gid2};
        event.locatie = {latitude: lat2, longitude: long2};
        event.evenementId = mid2;
        event.details = jQuery.trim($("#textareaOmschrijvingEvenementenAdmin").val());
        event.datum = jQuery.trim($("#textareaDatumEvenementenAdmin").val());
        // Send the new group to the back-end.

        request.open("PUT", BASE_URL + "evenements/" + eventIndex);
        request.onload = function() {
            if (request.status === 204) {

            } else {
                console.log("Error creating event: " + request.status + " " + request.responseText);
            }
        };
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(event));

    }
    else
    {
        console.log("404");
    }
};
request.send(null);

}


/*FEEDBACK*/

function initialiseListFeedbackMelding(meldingId) {

// Load the groups from the back-end.
var request = new XMLHttpRequest();


request.open("GET", BASE_URL + "meldingen/feedback/" + meldingId);
request.onload = function() {
    if (request.status === 200) {
        feedbackMelding = JSON.parse(request.responseText);
        console.log(feedbackMelding);
        for (var i = 0; i < feedbackMelding.length; i++) {
            $("#FeedbackMeldingList").append(createListElementForFeedbackMelding(i));
            //$("#meldingListAdmin").append(createListElementForMeldingAdmin(i));
            
        }

    } else {
        console.log("Error loading Feedback: " + request.status + " - " + request.statusText);

    }
};
request.send(null);
}

function createListElementForFeedbackMelding(FeedbackIndex) {

var link = $("<a>")
        .text(feedbackMelding[FeedbackIndex].gebruiker.voornaam + " " + feedbackMelding[FeedbackIndex].gebruiker.naam + " : " + feedbackMelding[FeedbackIndex].feedback);

//var gebruiker = $("<p>")
//        .text(feedbackMelding[FeedbackIndex].feedback);

return $("<li>")
        .append(link)
        //.append(gebruiker)
}

function createFeedbackEvent(mid) {

var request = new XMLHttpRequest();

request.open("GET", BASE_URL + "gebruikers/fbid/" + uid);
request.onload = function() {
    if (request.status === 200) {
        var gebruiker = JSON.parse(request.responseText);
        gebruikerid = gebruiker.gebruikerId;
        console.log(gebruikerid);
        var feedbackMelding = {};

        feedbackMelding.feedback = jQuery.trim($("#plaatsReactieMelding").val());
        feedbackMelding.gebruiker = {gebruikerId: gebruikerid};
        feedbackMelding.melding = {meldingId : mid};

        // Send the new group to the back-end.
        request.open("POST", BASE_URL + "meldingen/feedback/" + mid);
        request.onload = function() {
            if (request.status === 201) {
                feedbackMelding.FeedbackMeldingid = request.getResponseHeader("Location").split("/").pop();
            } else {
                console.log("Error creating event: " + request.status + " " + request.responseText);
            }
        };

        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(feedbackMelding));
        
        
        
        
    }
    else
    {
        console.log("404");
    }
};
request.send(null);

//sendFile();
//        window.reload('#page');
//    window.reload('#pageEvent');
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

//logt gebruiker uit (enkel via facebook)
function logout() {



FB.logout(function(response) {
    window.location = "#pageAanmelden";
    console.log("Uitgelogd");

});


}

//maakt gebruiker aan via het aanmeldingsscherm
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
request.open("POST", BASE_URL + "gebruikers");
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

//login enkel via facebook
function login() {
FB.getLoginStatus(function(response) {
    console.log("roept ze aan")
    if (response.status === 'connected') {
        window.location = "#page";
        console.log("Gelukt");
        if (response.authResponse) {
            uid = response.authResponse.userID;
            console.log("Dit is bij login " + uid)
        }

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

                var request = new XMLHttpRequest();
                request.open("GET", BASE_URL + "gebruikers/fbid/" + uid);
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

//vind de gebruiker via facebookid
function getGebruikerByUID() {


var request = new XMLHttpRequest();
request.open("GET", BASE_URL + "gebruikers/fbid/" + uid);
request.onload = function() {
    if (request.status === 200) {
        var gebruiker = JSON.parse(request.responseText);


        gebruikerid = gebruiker.gebruikerId;
        console.log(gebruikerid);
    }
    else
    {
        console.log("404");
    }
};
request.send(null);

}

//*FB POST
FB.init({appId: "118529111674998", status: true, cookie: true});

//Post op facebook timeline
function postToFeed() {

// calling the API ...
var obj = {
    method: 'feed',
    redirect_uri: '//www.webs.hogent.be/timvdv/index.html',
    link: 'http://webs.hogent.be/timvdv/',
    picture: 'http://www.webs.hogent.be/timvdv/fixicon.png',
    name: 'FiXity',
    caption: 'Together we fix our city!',
    description: 'Using Dialogs to interact with users.'
};

function callback(response) {
    document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
}

FB.ui(obj, callback);
}

$(document).on("pageshow", "#pageMelding", function() {

initialize2();

});

function initialize2() {
if (navigator.geolocation) {

    function hasPosition(position) {
        var latlng = new google.maps.LatLng(latitude = position.coords.latitude, longitude = position.coords.longitude);
        console.log(latitude + " , " + longitude);

        var myOptions = {
            zoom: 17,
            streetViewControl: false,
            mapTypeControl: false,
            navigationControl: true,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP,
            draggable: true,
            title: "Druk op volgende als je deze locatie kiest"
        });

        google.maps.event.addListener(marker, 'dragend', function(evt) {

            latitude = evt.latLng.lat();
            longitude = evt.latLng.lng();
            console.log(latitude + " , " + longitude);
        });


        var input = document.getElementById('searchTextField');
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker1 = new google.maps.Marker({
            map: map,
            draggable: true
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            marker1.setMap(null);
            infowindow.close();
            var place = autocomplete.getPlace();
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);  // Why 17? Because it looks good.
            }

            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();

            console.log(latitude + " , " + longitude);

            marker.setPosition(place.geometry.location);

        });
    }
    //google.maps.event.addDomListener(window, 'load', initialize);
}
navigator.geolocation.getCurrentPosition(hasPosition);
}


/* UPLOAD */


function sendFile() {
   //document.getElementById("status").innerHTML = "";
   var file = document.getElementById("filechooser").files[0];
if (file === undefined)
{
    fileName = "NoImage.jpg";
}
else
{
    console.log(file);
       var extension = file.name.split(".").pop();
   
       var type;
       if (extension === "jpg" || extension === "jpeg" ||
                   extension === "JPG" || extension === "JPEG") {
               type = "image/jpeg";
       } else if (extension === "png" || extension === "PNG") {
               type = "image/png";
       } else {
               //document.getElementById("status").innerHTML = "Invalid file type";
               return;
       }  
       var request = new XMLHttpRequest();
       request.open("POST", BASE_URL + "images");
       request.onload = function() {
               if (request.status === 201) {
                       fileName = request.getResponseHeader("Location").split("/").pop();
            console.log(fileName);
               } else { 
               }
       };
       request.setRequestHeader("Content-Type", type);
       request.send(file);
}
}

function sendFileMelding() {
   //document.getElementById("status").innerHTML = "";
   var file = document.getElementById("filechooserMelding").files[0];
if (file === undefined)
{
    fileName = "NoImage.jpg";
}
else
{
    console.log(file);
       var extension = file.name.split(".").pop();
   
       var type;
       if (extension === "jpg" || extension === "jpeg" ||
                   extension === "JPG" || extension === "JPEG") {
               type = "image/jpeg";
       } else if (extension === "png" || extension === "PNG") {
               type = "image/png";
       } else {
               //document.getElementById("status").innerHTML = "Invalid file type";
               return;
       }  
       var request = new XMLHttpRequest();
       request.open("POST", BASE_URL + "images");
       request.onload = function() {
               if (request.status === 201) {
                       fileName = request.getResponseHeader("Location").split("/").pop();
            console.log(fileName);
               } else { 
               }
       };
       request.setRequestHeader("Content-Type", type);
       request.send(file);
}
}

////Registreer + admin
function createRegistreerGebruikerFromInput() {

var gebruiker = {};
//getGebruikerByUID();
gebruiker.naam = jQuery.trim($("#textinputRegistreerNaam").val());
gebruiker.voornaam = jQuery.trim($("#textinputRegistreerVoornaam").val());
gebruiker.email = jQuery.trim($("#textinputRegistreeremail").val());
gebruiker.password = jQuery.trim($("#passwordinputRegistreerWachtwoord").val());
gebruiker.uid = ("GEBRUIKER" + gebruiker.email);


// Send the new group to the back-end.
var url = "http://localhost:8080/onzebuurt/resources/gebruikers";
var request = new XMLHttpRequest();
request.open("POST", url);
request.onload = function() {
    if (request.status === 201) {
        gebruiker.gebruikerId = request.getResponseHeader("Location").split("/").pop();
        alert("Dag " + gebruiker.voornaam + ", uw account is aangemaakt! U kan nu zich nu aanmelden door op de knop << fiXity-account >> te klikken");
    } else {
        alert("E-mail bestaat al.");
        console.log("Error creating event: " + request.status + " " + request.responseText);
    }
     
};
   
request.setRequestHeader("Content-Type", "application/json");
request.send(JSON.stringify(gebruiker));
    

}

//gewone login, niet via facebook (ook voor admin)
function LoginDatabank() {

var email = jQuery.trim($("#emailinput").val());
var pass = jQuery.trim($("#passwordinput").val());


var url = "http://localhost:8080/onzebuurt/resources/gebruikers/gebruiker/";
var request = new XMLHttpRequest();
request.open("GET", url + email + "/" + pass);
request.onload = function() {
    if (request.status === 200) {
        var gebruiker = JSON.parse(request.responseText);
        var uidgebruiker = gebruiker.uid;
        console.log(uidgebruiker);
        if (uidgebruiker === "admin") {
            window.location.href = "#pageAdminMeldingen";
        }
        else
        {
            uid = uidgebruiker;
            window.location.href = "#page";
        }
    }
    else
    {
        console.log("404");
    }
};
request.send(null);


}

//Overzichtmap van meldingen en evenementen in het Mappanneel
function initializeMaps() {
if (navigator.geolocation) {

    function hasPosition(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var myOptions = {
            streetViewControl: false,
            mapTypeControl: false,
            navigationControl: true,
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        var map = new google.maps.Map(document.getElementById("map_canvas3"), myOptions);

        setMarkersMeldingen(map);
        infowindow = new google.maps.InfoWindow({
            content: "loading..."
        });
        setMarkersEvents(map),
                infowindow = new google.maps.InfoWindow({
            content: "loading..."
        });

        function setMarkersMeldingen(map) {

            var request = new XMLHttpRequest();
            var url = "http://localhost:8080/onzebuurt/resources/meldingen";
            request.open("GET", url);
            request.onload = function() {
                if (request.status === 200) {
                    meldingen = JSON.parse(request.responseText);
                    var contentString;
                    for (var i = 0; i < meldingen.length; i++) {

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(meldingen[i].locatie.latitude, meldingen[i].locatie.longitude),
                            map: map,
                            icon: 'repairIcons.png',
                            title: contentString = (meldingen[i].titel + ": " + meldingen[i].details)

                        });

                        var popupContent = '<h3>' + meldingen[i].titel + ": " + meldingen[i].details + '</h3>' + '<p>' + "Geplaatst door: " + meldingen[i].gebruiker.voornaam + " " + meldingen[i].gebruiker.naam + '</p>';

                        createInfoWindow(marker, popupContent);

                        var infoWindow = new google.maps.InfoWindow();
                        function createInfoWindow(marker, popupContent) {
                            google.maps.event.addListener(marker, 'click', function() {
                                infoWindow.setContent(popupContent);
                                infoWindow.open(map, this);
                            });
                        }


//            google.maps.event.addListener(marker, "click", function (i) {
//                //infowindow.setContent(contentString);
//                console.log(i);
//                infowindow.open(this);
//            });

                    }
                    if (meldingen.length > 0) {

                    } else {

                    }
                } else {

                }


            };
            request.send(null);


        }

        function setMarkersEvents(map) {

            var request = new XMLHttpRequest();
            var url = "http://localhost:8080/onzebuurt/resources/evenements";
            request.open("GET", url);
            request.onload = function() {
                if (request.status === 200) {
                    events = JSON.parse(request.responseText);
                    for (var i = 0; i < events.length; i++) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(events[i].locatie.latitude, events[i].locatie.longitude),
                            map: map,
                            icon: 'familyIcon.png',
                            title: events[i].titel + ": " + events[i].details

                        });

                        var popupContent = '<h3>' + events[i].titel + ": " + events[i].details + '</h3>' + '<p>' + "Geplaatst door: " + events[i].gebruiker.voornaam + " " + events[i].gebruiker.naam + '</p>';

                        createInfoWindow(marker, popupContent);

                        var infoWindow = new google.maps.InfoWindow();
                        function createInfoWindow(marker, popupContent) {
                            google.maps.event.addListener(marker, 'click', function() {
                                infoWindow.setContent(popupContent);
                                infoWindow.open(map, this);
                            });
                        }
                    }
                    if (events.length > 0) {

                    } else {
                        
                    }
                } else {

                }


            };
            request.send(null);



        }

    }
    navigator.geolocation.getCurrentPosition(hasPosition);
}
}

$(document).on("pageshow", "#page2", function() {

initializeMaps();

});

//bewegende vlag
$(document).ready(function() {
$(".logo").hover(
        function() {
            $(this).attr("src", "flag2.png");
        },
        function() {
            $(this).attr("src", "flag1.png");
        });
});


function noAlpha(obj) {
reg = /[^0-9/]/g;
obj.value = obj.value.replace(reg, "");
}

function refreshPage()
{
    jQuery.mobile.changePage(window.location.href, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}

$( '#page' ).live( 'pageshow',function(){
  alert( 'This page was just enhanced by jQuery Mobile!' );
});