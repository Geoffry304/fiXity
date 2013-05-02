

window.onload = init;
var uid;
var latitude;
var longitude;
var gebruikerid;


function init() {
        initialiseListMeldingen();
        initialiseListEvenementen();
        
}

//listview fix als je pagina refresht

//zet een event in de database
function createEventFromInput() {                 
    var url = "http://localhost:8080/onzebuurt/resources/gebruikers/fbid/";
    var request = new XMLHttpRequest();
    request.open("GET", url + uid);
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

    alert("GEBRUIKERID " + gebruikerid);
    var event = {};
    
    //getGebruikerByUID();
    event.titel = jQuery.trim($("#selectmenuTitelEvent").val());
    
    event.details = jQuery.trim($("#textareaOmschrijvingEvent").val());
    event.locatie = {latitude : latitude, longitude : longitude};
    //event.gebruiker = {gebruikerId :gebruikerid};
    //event.gebruiker = {gebruikerId : 5};
    event.gebruiker = {gebruikerId : gebruikerid};
    // Send the new group to the back-end.
    var request = new XMLHttpRequest();
    var url = "http://localhost:8080/onzebuurt/resources/evenements";
    request.open("POST", url);
    request.onload = function() {
        if (request.status === 201) {
            event.evenementid = request.getResponseHeader("Location").split("/").pop();
        } else {
            console.log("Error creating event: " + request.status + " " + request.responseText);
        }
    };
    
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(event));  
    //window.location.reload('#page');
     //window.location.reload('#pageEvent');
}

//zet een melding in de database
function createMeldingFromInput() {
    var melding = {};
    //getGebruikerByUID();
    melding.titel = jQuery.trim($("#selectmenuTitelMeldingen").val());
    melding.details = jQuery.trim($("#textareaOmschrijvingMeldingen").val());
    melding.locatie = {latitude : latitude, longitude : longitude};
    melding.gebruiker = {gebruikerId : 1};
    //getGebruikerByUID();

    // Send the new group to the back-end.
    var request = new XMLHttpRequest();
    var url = "http://localhost:8080/onzebuurt/resources/meldingen";
    request.open("POST", url);
    request.onload = function() {
        if (request.status === 201) {
            melding.MeldingId = request.getResponseHeader("Location").split("/").pop();            
        } else {
            console.log("Error creating event: " + request.status + " " + request.responseText);   
        }
    };
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(melding));
    //window.location.reload('#page');  
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

//vult de nieuwe pagina als je op de listview van meldingen klikt
function createPageMeldingInformation(meldingIndex) {
var titel = meldingen[meldingIndex].titel;
var gebruiker = meldingen[meldingIndex].gebruiker.voornaam + " " + meldingen[meldingIndex].gebruiker.naam;
var details = meldingen[meldingIndex].details;
var locatie = meldingen[meldingIndex].locatie.latitude + " , " + meldingen[meldingIndex].locatie.longitude;



var pageMeldingInformation = $("<div data-role=page data-url=meldingInformation><div data-theme=b data-role=header ><a href=#page data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + titel + " </h1></div><div data-role=content><p>" + "Geplaatst door: " + gebruiker + "</p><p>" + "\n\Omschrijving: " + details +"</p><p>" + "Locatie: " + locatie +"</p></div></div"); 
//append it to the page container
pageMeldingInformation.appendTo( $.mobile.pageContainer );
 
//go to it
$.mobile.changePage( pageMeldingInformation );
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



var newPage = $("<div data-role=page data-url=eventInformation><div data-theme=b data-role=header ><a href=#pageEvent data-role=button data-icon=arrow-l data-iconpos=left>Back</a><h1>" + titel + " </h1></div><div data-role=content>" + "Geplaatst door: " + gebruiker + "<p>" + "\n\Omschrijving: " + details +"</p><p>" + "Locatie: " + locatie +"</p></div></div");

//append it to the page container
newPage.appendTo( $.mobile.pageContainer );
 
//go to it
$.mobile.changePage( newPage );
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

                    var url = "http://localhost:8080/onzebuurt/resources/gebruikers/fbid/";
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
                   
    var url = "http://localhost:8080/onzebuurt/resources/gebruikers/fbid/";
    var request = new XMLHttpRequest();
    request.open("GET", url + uid);
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
	

//*GOOGLE MAPS

 function laadMap() {
 if(navigator.geolocation) {
        
        function hasPosition(position) {
            var point = new google.maps.LatLng(latitude = position.coords.latitude, longitude = position.coords.longitude),
            
            myOptions = {
                zoom: 16,
                center: point,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            
            mapDiv = document.getElementById("map_canvas"),
            map = new google.maps.Map(mapDiv, myOptions),
			            marker = new google.maps.Marker({
                position: point,
                map: map,
                animation: google.maps.Animation.DROP,
		draggable: true,
                title: "You are here"
            });
            
        google.maps.event.addListener(marker, 'dragend', function(evt){
           
        latitude = evt.latLng.lat();
        longitude = evt.latLng.lng();
});
			
        }
        navigator.geolocation.getCurrentPosition(hasPosition);
        
    }
    
 }
 $(document).on("pageshow", "#pageMelding", function() {
   
        laadMap();
    
});

 function laadMap1() {
 if(navigator.geolocation) {
        
        function hasPosition(position) {
            var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            
            myOptions = {
                zoom: 16,
                center: point,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            
            mapDiv = document.getElementById("map_canvas2");
            map = new google.maps.Map(mapDiv, myOptions);
			
        }
        navigator.geolocation.getCurrentPosition(hasPosition);
        
    }
    
 }


 $(document).on("pageshow", "#page2", function() {
   
        laadMap1();
    
});


///* UPLOAD */
//
//var BASE_URL = "http://localhost:8080/onzebuurt/resources/";
//
//onload = function() {
//    document.getElementById("btnPlaatsEvent").onclick = sendFile;
//};
//
//function sendFile() {
//    //document.getElementById("status").innerHTML = "";
//    
//    var file = document.getElementById("btnFotoEvent").files[0];
//    var extension = file.name.split(".").pop();
//    
//    var type;
//    if (extension === "jpg" || extension === "jpeg" ||
//        extension === "JPG" || extension === "JPEG") {
//        type = "image/jpeg";
//    } else if (extension === "png" || extension === "PNG") {
//        type = "image/png";
//    } else {
//        //document.getElementById("status").innerHTML = "Invalid file type";
//        return;
//    }
//    
//    var request = new XMLHttpRequest();
//    request.open("POST", BASE_URL + "images");
//    request.onload = function() {
//        if (request.status === 201) {
//            var fileName = request.getResponseHeader("Location").split("/").pop();
//            document.getElementById("status").innerHTML = "File created with name " + fileName;
//        } else {
//            document.getElementById("status").innerHTML = "Error creating file: (" + request.status + ") " + request.responseText;
//        }
//    };
//    request.setRequestHeader("Content-Type", type);
//    request.send(file);
//}
//
///* DOWNLOAD */
//
//var BASE_URL = "http://localhost:8080/fileserver/resources/";
//
//onload = function() {
//    loadImageSelect();
//    $("#download").click(downloadSelectedImage);
//};
//
//function loadImageSelect() {
//    $("#images").empty();
//    
//    var request = new XMLHttpRequest();
//    request.open("GET", BASE_URL + "images");
//    request.onload = function() {
//        if (request.status === 200) {
//            var results = JSON.parse(request.responseText);
//            for (var i = 0; i < results.length; i++) {
//                var option = $("<option>").attr("value", results[i]).text(results[i]);
//                $("#images").append(option);
//            }
//        } else {
//            console.log("Cannot load images: " + request.status + " - " + request.responseText);
//        }
//    };
//    request.send(null);
//}
//
//function downloadSelectedImage() {
//    $("img").remove();
//    var file = $("#images").val();  
//    var img = $("<img>").attr("src", BASE_URL + "images/" + file).attr("alt", "Your downloaded images");
//    $("body").append(img);
//}

