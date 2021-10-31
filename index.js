var map;
const defaultPos = {
	lat: 34.98584790244196,
	lng: 135.75876588937692
};

var totalTime = 0;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: defaultPos,
		zoom: 13
	});
	totalTime = 0;

	var geocoder = new google.maps.Geocoder();
	var directionsService = new google.maps.DirectionsService();
	var directionsRenderer = new google.maps.DirectionsRenderer({
		map: map
	});
	var placesService = new google.maps.places.PlacesService(map);

	var directions = {
		origin: "京都駅",
		destination: "妙心寺",
		waypoints: [],
		travelMode: google.maps.DirectionsTravelMode.WALKING
	};

	setDirectionsList();

	function setDirectionsList() {
		for (var i = 0; i < 8; i++) {
			if (document.getElementById("place" + i).value != "") {
				directions.waypoints.push({
					location: document.getElementById("place" + i).value
				});
			};
		};
	};

	for (var i = 0; i < 8; i++) {
		if (document.getElementById("travel-mode" + i).value == "train") {
			searchTrain(document.getElementById("place" + (i - 1)).value, document.getElementById("place" + i).value);
		} else if (document.getElementById("travel-mode" + i).value == "bus") {
			searchBus(document.getElementById("place" + (i - 1)).value, document.getElementById("place" + i).value);
		};
	};

	directionsService.route(directions, function(result, status) {
		if (status == "OK") {
			directionsRenderer.setDirections(result);

			for (var i = 0; i < result.routes[0].legs.length; i++) {
				if (document.getElementById("travel-mode" + i).value == "train") {
					totalTime += result.routes[0].legs[i].duration.value / 10;
				} else {
					totalTime += result.routes[0].legs[i].duration.value;
				}

			};

			getTime();
			displayTravelTime();
			displayInfo();

			function getTime() {
				for (var i = 0; i < 8; i++) {
					if (document.getElementById("time" + i).value != "") {
						totalTime += document.getElementById("time" + i).value * 60;
					};
				};
			};

			function displayTravelTime() {
				for (var i = 0; i < result.routes[0].legs.length; i++) {
					document.getElementById("travel" + i).textContent = result.routes[0].legs[i].duration.text;
				};
			};
		};
	});

	function searchTrain(start, end) {
		var startPos;
		var endPos;
		var startPlace;
		var endPlace;

		if (start == "") {
			start = "京都駅";
		};

		if (end == "") {
			end = "妙心寺";
		};

		geocoder.geocode({
			address: start
		}, (result, status) => {
			if (status == "OK") {
				startPos = result[0].geometry.location;
			};
		});

		geocoder.geocode({
			address: end
		}, (result, status) => {
			if (status == "OK") {
				endPos = result[0].geometry.location;
				search();
			};
		});

		function search() {
			placesService.nearbySearch({
				location: startPos,
				radius: 500,
				type: ["train_station"]
			}, (result, status) => {
				if (status == "OK") {
					startPlace = result[0].geometry.location;
					var marker = new google.maps.Marker({
						map: map,
						position: startPlace
					});
				};
			});

			placesService.nearbySearch({
				location: endPos,
				radius: 500,
				type: ["train_station"]
			}, (result, status) => {
				if (status == "OK") {
					endPlace = result[0].geometry.location;
					var marker = new google.maps.Marker({
						map: map,
						position: endPlace
					});
				};
			});
		};
	};

	function searchBus(start, end) {
		var startPos;
		var endPos;
		var startPlace;
		var endPlace;

		if (start == "") {
			start = "京都駅";
		};

		if (end == "") {
			end = "妙心寺";
		};

		geocoder.geocode({
			address: start
		}, (result, status) => {
			if (status == "OK") {
				startPos = result[0].geometry.location;
			};
		});

		geocoder.geocode({
			address: end
		}, (result, status) => {
			if (status == "OK") {
				endPos = result[0].geometry.location;
				search();
			};
		});

		function search() {
			placesService.nearbySearch({
				location: startPos,
				radius: 1000,
				type: ["bus_station"]
			}, (result, status) => {
				if (status == "OK") {
					startPlace = result[0].geometry.location;
					var marker = new google.maps.Marker({
						map: map,
						position: startPlace
					});
				};
			});

			placesService.nearbySearch({
				location: endPos,
				radius: 1000,
				type: ["bus_station"]
			}, (result, status) => {
				if (status == "OK") {
					endPlace = result[0].geometry.location;
					var marker = new google.maps.Marker({
						map: map,
						position: endPlace
					});
				};
			});
		};
	}

};

function displayInfo() {
	var timer = document.getElementById("time").value;
	var text = document.getElementById("alltime");

	t = totalTime;
	h = "" + (t / 36000 | 0) + (t / 3600 % 10 | 0);
	m = "" + (t % 3600 / 600 | 0) + (t % 3600 / 60 % 10 | 0);
	T = h + "時間" + m + "分";
	text.textContent = T;

	if (totalTime >= 20700 - timer * 60) {
		text.style.color = "#ff0000";
	} else {
		text.style.color = "#222222";
	};
};

document.getElementById('push-button').addEventListener("click", function() {
	initMap();
}, false);

document.onkeypress = (e) => {
	var key = e.keyCode;

	if (key == 13) {
		initMap();
	};
};