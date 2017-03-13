

var city = document.getElementsByClassName('city')
var postal = document.getElementsByClassName('postal')


if (navigator.geolocation) {

	$.getJSON('http://ipinfo.io', function(data){

		city[0].value = data.city
		city[1].value = data.city

		postal[0].value = data.postal
		postal[1].value = data.postal

		navigator.geolocation.getCurrentPosition(showPosition);
	});

}

else {
	$.getJSON('http://ipinfo.io', function(data){
		
		city[0].value = data.city
		city[1].value = data.city

		postal[0].value = data.postal
		postal[1].value = data.postal

		navigator.geolocation.getCurrentPosition(showPosition);
	});
}

function showPosition(position) {


	$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&result_type=postal_code&key=AIzaSyCFnD_J7ekZ8F739HiH8wRLoRlrq2bUjAQ", function(data) {
		// console.log(data.results[0].formatted_address);
		var splittedLocation = data.results[0].formatted_address.split(',')[0].split(' ');

		// var city = JSON.stringify(
		// 	{
		// 		"city": splittedLocation[1],
		// 		"postal": splittedLocation[0]
		// 	}
		// );

		city[0].value = splittedLocation[1]
		city[1].value = splittedLocation[1]

		postal[0].value = splittedLocation[0]
		postal[1].value = splittedLocation[0]

	});

}
