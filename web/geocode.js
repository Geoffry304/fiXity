$('#pageMelding').live('pageshow',function(event){
    navigator.geolocation.getCurrentPosition(function (location) {
          // Use location.coords.latitude and location.coords.longitude
          loadMap(location.coords.latitude, location.coords.longitude);
    }); 

});
function loadMap(Lat, Long){
 var myLatlng = new google.maps.LatLng(Lat, Long);
 var myOptions = {
            zoom: 16,
            center: myLatlng,
            mapTypeControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(
                document.getElementById("map_canvas"), myOptions
                );

            var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
					animation: google.maps.Animation.DROP,
					draggable: true,
                    title: "Your current location!"
        });
 
}