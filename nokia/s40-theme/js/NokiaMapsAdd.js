var myObject = {};
var currentCoordinate = {};
nokia.Settings.set("appId", "TqCHUPFiI02JIF435ByB");
nokia.Settings.set("authenticationToken", "uR8Ck0alVaJ-z1WQh2C1XA");
Storage.prototype.setBlob = function(blob) {
	for (i in blob) {
		// example of storageObjet: {'item-3': {'href': 'google.com', 'icon':
		// 'google.png'}}
		var struct = {};
		for (key in blob[i]) {
			if (key != 'id') {
				struct[key] = blob[i][key];
			}
		}
		;
		this.setObject(blob[i].id, struct);
	}
}

Storage.prototype.setObject = function(key, obj) {
	this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getObject = function(key) {
	return JSON.parse(this.getItem(key));
};
function clearLocalStorage() {
	myObject.clear();
}

// clearLocalStorage();

function initStorage() {
	// if (!localStorage.myReminders) {
	// myReminders = {};
	// myReminders.localArray = [];
	// localStorage.myReminders = JSON.stringify(myReminders);
	// }
	// document.widget={};
	// console.log(document.myObject);
	if (!myObject.myReminders) {
		console.log('inside');
		myReminders = {};
		myReminders.localArray = [];
		myObject.myReminders = JSON.stringify(myReminders);
	}
	console.log(myObject);
	console.log('success');

}
// function RedirectToAnotherPage(){
// console.log('Redirecting');
// console.log('current hre:', document.location.href);
// document.location.href="file:///C:/Users/manurampandit/AppData/Local/Nokia/WebSDKSimulator/webAppUnZipPath/ViewReminders.html";
// mwl.loadURL("file:///C:/Users/manurampandit/AppData/Local/Nokia/WebSDKSimulator/webAppUnZipPath/ViewReminders.html");
// console.log('sdfas');
// }

function changeView(activeViewId, hiddenViewId) {
	var activeView = document.getElementById(activeViewId);
	var hiddenView = document.getElementById(hiddenViewId);
	activeView.style.display = "block";
	hiddenView.style.display = "none";

	// onMyAddition();

}
var initmapContainer;
var initMap;
function onMyInit() {
	var initmapContainer = document.getElementById("mapContainer2");
	// Create a map inside the map container DOM node

	initMap = new nokia.maps.map.Display(initmapContainer, {
		// Initial center and zoom level of the map
		center : [ 28.5170877, 77.2949087 ],
		zoomLevel : 12,
		// We add the behavior component to allow panning / zooming of the map
		components : [ new nokia.maps.map.component.Behavior() ]
	});
	var standardMarker = new nokia.maps.map.StandardMarker(initMap.center);
	// Next we need to add it to the map's object collection so it will be
	// rendered onto the map.
	initMap.objects.add(standardMarker);

}

initStorage();

function myLoadingFunction() {
	// var mapContainer = document.getElementById("mapContainer2");
	// Create a map inside the map container DOM node
	myObjElement = JSON.parse(myObject.myReminders).localArray;
	console.log('asgd');
	var length = myObjElement.length;
	while (length > 0) {
		var first = myObjElement[length - 1].key;
		console.log(first);
//		var standardMarker = new nokia.maps.map.StandardMarker(first);
		var myObjHighlight={
			text: "Hi",
			textPen: {
				strokeColor: "#333"
			},
			brush: {
				color: "#FFF"
			},
			/* - pen: the color which is used to draw the outline of the shape.
			 * 		When you use very bright fill colors for your brush color we 
			 * 		recommed changing it or else your markers may not be recognizable on the map.
			 * 		It can be either an instance of nokia.maps.map.Pen or an object literal.
			 */
			pen: {
				strokeColor: "#333"
			}
		};
		myObjHighlight.text=myObjElement[length - 1].reminder;
		var standardMarker = new nokia.maps.map.StandardMarker(first,myObjHighlight);
		
		initMap.objects.add(standardMarker);
		length--;
	}

	checkCurrentPosition();

	// if (myObjElement.length>0) {
	//		
	//		
	// console.log(myObjElement);
	// console.log('asfgadf');
	// console.log(myObjElement.localArray[0]);
	// console.log('adfert');
	// var first = myObjElement.localArray[0].key;
	// console.log(first);
	// var standardMarker = new nokia.maps.map.StandardMarker(first);
	// console.log('asdgainfg nw');
	// initMap.objects.add(standardMarker);
	// }

	// var standardMarker = new nokia.maps.map.StandardMarker(initMap.center);
	// Next we need to add it to the map's object collection so it will be
	// rendered onto the map.

}

function roundNumber(number, digits) {
	var multiple = Math.pow(10, digits);
	var rndedNum = Math.round(number * multiple) / multiple;
	return rndedNum;
}
function checkCurrentPosition() {
	console.log('inside pos');
	nokia.places.search.manager.reverseGeoCode({
		latitude : position.coords.latitude,
		longitude : position.coords.longitude,
		onComplete : processResults
	})

	// The Reverse geocoder call returns providing the following two statuses
	// 1. 'OK' - recieved the address
	// 2. 'ERROR' - geocoder failed
	function processResults(data, requestStatus, requestId) {
		console.log('data:', data);
	}
	/*
	 * navigator.geolocation.getCurrentPosition(function(position){
	 * console.log('position:', position);
	 * 
	 * myObjElement = JSON.parse(myObject.myReminders).localArray;
	 * console.log('myObj',myObjElement); var length=myObjElement.length;
	 * while(length>0){ var first = myObjElement[length-1].key;
	 * console.log('inside for len',length);
	 * console.log('remind:',myObjElement[length-1].reminder);
	 * console.log(roundNumber(first.latitude,2));
	 * console.log(roundNumber(position.coords.latitude,2));
	 * console.log(roundNumber(first.longitude,2));
	 * console.log(position.coords.longitude);
	 * console.log(roundNumber(position.coords.longitude, 2));
	 * if(roundNumber(first.latitude,2) == roundNumber(position.coords.latitude,
	 * 2) && roundNumber(first.longitude,2) ==
	 * roundNumber(position.coords.longitude, 2)){ console.log('inside');
	 * document.getElementById('RemindAlert').innerHTML="You have reminder:" +
	 * myObjElement[length-1].reminder; } length--; }
	 * 
	 * });
	 */
}

var map;
function onMyAddition() {
	document.getElementById('successNote').style.display="none";
	var mapContainer = document.getElementById("mapContainer");
	// Create a map inside the map container DOM node
	if (!map) {
		map = new nokia.maps.map.Display(mapContainer, {
			// Initial center and zoom level of the map
			center : [ 28.5170877, 77.2949087 ],
			zoomLevel : 12,
			// We add the behavior component to allow panning / zooming of the
			// map
			components : [ new nokia.maps.map.component.Behavior() ]
		});
		var standardMarker = new nokia.maps.map.StandardMarker(map.center);
		// Next we need to add it to the map's object collection so it will be
		// rendered onto the map.
		map.objects.add(standardMarker);
	}
	var TOUCH = nokia.maps.dom.Page.browser.touch, CLICK = TOUCH ? "tap"
			: "click";

	map.addListener(CLICK, function(evt) {
		var coord = map.pixelToGeo(evt.displayX, evt.displayY);
		console.log('coords', coord);
		// console.log(map.center);

		map.objects.add(new nokia.maps.map.StandardMarker(coord));
		document.getElementById('successNote').style.display = "none";
		document.getElementById('myAdditionWindow').style.display = "block";
		document.getElementById('txtReminderInfo').value = "";
		document.getElementById('txtReminderInfo').focus();
		console.log('lati', coord.latitude);
		console.log('longi', coord.longitude);
		// document.getElementById('hiddenLatitude').innerHTML = coord.latitude
		// + ":" + coord.longitude;
		// document.getElementById('hiddenLatitude').innerText = coord.latitude
		// + ":" + coord.longitude;
		currentCoordinate = coord;

	});

}

function SaveReminder() {
	console.log(myObject.myReminders);

	var localObj = JSON.parse(myObject.myReminders);
	var key = currentCoordinate;
	console.log(document.getElementById('hiddenLatitude').value);
	console.log(document.getElementById('hiddenLatitude').innerText);
	var reminder = document.getElementById('txtReminderInfo').value;
	var currentObj = {
		"key" : key,
		"reminder" : reminder
	};
	var localArray = localObj.localArray;
	console.log(localArray);
	localObj.localArray.push(currentObj);
	myObject.myReminders = JSON.stringify(localObj);
	console.log(myObject.myReminders);
	document.getElementById('successNote').style.display = "block";
	document.getElementById('myAdditionWindow').style.display = "none";
}

function onPositionUpdate(position) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;
	alert("Current position: " + lat + " " + lng);

}

function getCurrentLatitudeLongitude() {
	if (navigator.geolocation)
		navigator.geolocation.getCurrentPosition(onPositionUpdate);
	else
		alert("navigator.geolocation is not available");
}