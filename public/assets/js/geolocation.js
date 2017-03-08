

var loc = document.getElementsByClassName('position')


if (navigator.geolocation) {

	$.getJSON('http://ipinfo.io', function(data){
		// console.log(data);
		var city = JSON.stringify(
			{
				"city": data.city,
				"postal": data.postal
			}
		);
		loc[0].value = city
		loc[1].value = city

		navigator.geolocation.getCurrentPosition(showPosition);
	});

}

else {
	// find another way
	$.getJSON('http://ipinfo.io', function(data){
		// console.log(data.city);
		loc[0].value = data.city;
		loc[1].value = data.city;
	});
}

function showPosition(position) {

	// console.log(position);
	// var locs = JSON.stringify(
	// 	{
	// 		"lat": position.coords.latitude,
	// 		"long": position.coords.longitude
	// 	}
	// );
	// var api = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&result_type=street_address|postal_code&key=AIzaSyCFnD_J7ekZ8F739HiH8wRLoRlrq2bUjAQ";

	// console.log(api);

	$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&result_type=postal_code&key=AIzaSyCFnD_J7ekZ8F739HiH8wRLoRlrq2bUjAQ", function(data) {
		// console.log(data.results[0].formatted_address);
		var splittedLocation = data.results[0].formatted_address.split(',')[0].split(' ');

		var city = JSON.stringify(
			{
				"city": splittedLocation[1],
				"postal": splittedLocation[0]
			}
		);

		// console.log(splittedLocation);
		loc[0].value = city;
		loc[1].value = city;

	});

}
