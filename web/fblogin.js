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


function login() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            window.location = "#page";
            console.log("Gelukt");


        }
        else if
            (response.status === 'not_authorized')
        {
            // not_authorized
            //login();
//            FB.login(function(response) {
//
//                var naam;
//                var voornaam;
//                var uid;
//
//                if (response.authResponse) {
//                    // connected
//                    window.location.href = "#pageTut1";
//                    uid = response.authResponse.userID;
//                    FB.api('/me', function(response) {
//
//                        naam = response.last_name;
//                        voornaam = response.first_name;
//
//                        createGebruikerFromInput(uid, naam, voornaam);
//
//                    });
//
//                } else {
//                    // cancelled
//                }
//
//            });
        }
        else {
            FB.login(function(response) {

                var naam;
                var voornaam;
                var uid;

                if (response.authResponse) {
                    // connected
                    window.location.href = "#pageTut1";
                    uid = response.authResponse.userID;
                    FB.api('/me', function(response) {

                        naam = response.last_name;
                        voornaam = response.first_name;

                        createGebruikerFromInput(uid, naam, voornaam);

                    });

                } else {
                    // cancelled
                }

            });
        }
        
    });
}