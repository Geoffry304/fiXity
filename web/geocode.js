    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var coords = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
            zoom: 16,
            center: coords,
            mapTypeControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(
                document.getElementById("google_map"), mapOptions
                );
            var marker = new google.maps.Marker({
                    position: coords,
                    map: map,
					animation: google.maps.Animation.DROP,
					draggable: true,
                    title: "Your current location!"
        });
            });
    }else {
        alert("Geolocation API is not supported in your browser.");
    }
	