var Googlemap = {
	'currentMarker' : {}, //stores current marker
	'init' : function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(Googlemap.success,
					Googlemap.error);
		} else {
			alert('geolocation not supported');
		}
	},

	'initialize' : function() {
		var mapOptions = {
			center : new google.maps.LatLng(28.612805775849598, 77.2305114271876),
			zoom : 13,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		Googlemap.currentMarker = mapOptions.center;
		//load actual map
		map = new google.maps.Map(document.getElementById("map_canvas"),
				mapOptions);
		var remainderData = getLocalReminders();
		for ( var i in remainderData) {
			position = remainderData[i]['placeInfo'];
			var myLatlng = new google.maps.LatLng(position.jb,position.kb);
			var latLng = position;
			var marker = new google.maps.Marker( {
				position : myLatlng,
				map : map
			});
		}
		google.maps.event.addListener(map, 'click', function(event) {
			if (App.clickable) {
				var marker = new google.maps.Marker( {
					position : event.latLng,
					map : map
				});
				$('#addReminderModal').modal({
					backdrop : "static"
				}).modal('show');
				$('#enterReminder').data('marker', marker).val('').focus();
				var overlay = new google.maps.OverlayView();
				overlay.draw = function() {
				};
				overlay.setMap(map);
			}
		});
	},
	
	'rad' : function(x) {
		return x*Math.PI/180;
	},

	'distHaversine' : function(p1, p2) {
	  var R = 6371; // earth's mean radius in km
	  var dLat  = Googlemap.rad(p2.jb - p1.jb);
	  var dLong = Googlemap.rad(p2.kb - p1.kb);

	  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	          Math.cos(Googlemap.rad(p1.jb)) * Math.cos(Googlemap.rad(p2.jb)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	  var d = R * c;

	  return d.toFixed(3);
	},
	
	'success' : function(position) {
		mylati = new google.maps.LatLng(position.coords.latitude,
				position.coords.longitude);
		Googlemap.currentMarker = mylati;
		map.setCenter(mylati);
	},

	'error' : function(msg) {
		alert('error: ' + msg);
	}
};

google.maps.event.addDomListener(window, 'load', Googlemap.initialize);
Googlemap.init();