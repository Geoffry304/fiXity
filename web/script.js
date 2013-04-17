/* mightygumball.js */
/*
 * get the content of a JSON file using Ajax 
 *
 */

window.onload = init;

function init() {
	getSales();
}


//
// With XMLHttpRequest Level 2 (implemented in new versions of Firefox, Safari
// and Chrome) you can check progress and check for the "load" event with the
// onload event handler instead of checking the onreadystatechange
//
function getSales() {
	// change the URL to match the location where you
	// put the sales.json file
	var url = "http://localhost:8080/onzebuurt/resources/evenements";
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onload = function() {
		if (request.status === 200) {
			updateSales(request.responseText);
		}
	};
	request.send(null);
        
}

function updateSales(responseText) {
	var salesDiv = document.getElementById("meldingTonen");
	var sales = JSON.parse(responseText);
	for (var i = 0; i < sales.length; i++) {
		var sale = sales[i];
		var div = document.createElement("div");
		div.setAttribute("class", "saleItem");
                div.innerHTML = sale.titel + " " + sale.gebruiker.voornaam+ " " + sale.gebruiker.naam;
		salesDiv.appendChild(div);
                
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