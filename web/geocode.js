 function initialize() {
 if(navigator.geolocation) {
        
        function hasPosition(position) {
            var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            
            myOptions = {
                zoom: 16,
                center: point,
                mapTypeId: google.maps.MapTypeId.ROADMAP  //google.maps.MapTypeId.ROADMAP
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
            
            mapDiv2 = document.getElementById("map_canvas2"),
            map = new google.maps.Map(mapDiv2, myOptions),
            
            marker = new google.maps.Marker({
                position: point,
                map: map,
                title: "You are here"
            });

			
        }
        navigator.geolocation.getCurrentPosition(hasPosition);
    }
    
 }
 $(document).on("pageshow", "#pageMelding", function() {
   
        initialize();
    
});