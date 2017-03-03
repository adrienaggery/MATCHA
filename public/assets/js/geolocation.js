

var loc = document.getElementsByClassName('position')

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition);
}
else {
	// find another way

}

function showPosition(position) {

	var locs = JSON.stringify(
		{
			"lat": position.coords.latitude,
			"long": position.coords.longitude
		}
	);

	loc[0].value = locs;
	loc[1].value = locs;
}
