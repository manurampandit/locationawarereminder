/*
 * File Description: Used for-
 * 1. Event handlers viz.
 * 2. Sorting functionality of reminders
 * 3.
 */
var App = {
	'clickable' : true, //map property to add reminders -- view
	//Page load
	'init' : function() {
		//Drop Down event handlers
		$(document).on('change', '.reminderSelect', function() {
			App.clickable = false;
			if ($(this).val() == "Add") {
				App.clickable = true;
			} else if ($(this).val() == "Add Distance to get reminders") {
				$('#addReminderDistanceModal').modal('show');
			}
		});
		//Add Reminder handler
		$(document).on('click', '#addReminderModal .modal-footer .btn', function() {
			// save into JSON and show
			var latlng = $('#enterReminder').data('marker');
			var currentObj = {
				reminder : $('#enterReminder').val(),
				placeInfo : latlng.getPosition(),
				id : 1
			};
			//add this reminder
			appendLocalReminders(currentObj);
			//Display reminders / update curreent list
			App.displayTexts();
			$('#addReminderModal').modal('hide');
		});
		//Method calls every 10 sec to track location
		var moveMent = setInterval(function() {
			/*
			 * //TODO: watch position: Replace line no. 40 with 41 
			 */
			var latLng = navigator.geolocation.getCurrentPosition(Googlemap.success, Googlemap.error);
			//var latLng = navigator.geolocation.watchPosition(App.success);
			//This gets all local storage reminders for process
			var myJsonObject = getLocalReminders();
			//Distance from current location
			for (var i = 0; i < myJsonObject.length; i++) {
				console.log('Json object place info', myJsonObject[i].placeInfo);
				var distance = Googlemap.distHaversine(Googlemap.currentMarker, myJsonObject[i].placeInfo);
				console.log('distance',distance);
				myJsonObject[i].relativeDistance = distance;
				//TODO: determine unit from here
			}
			//Sorting based on distance
			var changedData = App.sortResults('relativeDistance', myJsonObject);
			for (var i in changedData) {
				changedData[i].id = i;
			}
			//set new data according to sorted data --Replace simply
			replaceLocalReminder(changedData);
			//Get page number corresponding to grid
			startFrom = $('.dt-pager .msg').data("start");
			//Based on pagination number, displays the reminders
			App.displayTexts(startFrom);
			//TODO: change current loc
			Googlemap.initialize();
		}, 100000);

		//methods for right hand side display
		//Change edit/save functionality
		$(document).on('click', '.buttonClass', function() {
			if ($(this).text() == "Save") {
				$(this).text('Edit');
				var editedValue = $(this).prev().val();
				$(this).prev().replaceWith('<span>' + $(this).prev().val() + '</span>');
				var myJsonObject = getLocalReminders();
				for (var i = 0; i < myJsonObject.length; i++) {

					if (myJsonObject[i].id == $(this)["0"].id) {
						myJsonObject[i].reminder = editedValue;
						break;
					}

				};
				//update in jstorage
				replaceLocalReminder(myJsonObject);
				return false;
			}
			var inputBox = $("<textarea/>").val($(this).prev().text()).addClass("editor-input").attr('rows', 1).attr('wrap', 'off');
			$(this).prev().replaceWith(inputBox);
			$(this).text('Save');
		});
		//Add Reminder pop up
		$(document).on('shown', '#addReminderModal', function() {
			$(document).on('keyup', function(event) {
				if (event.keyCode == 27) { //ESC key
					Googlemap.initialize();
				}
			});
		});
			//Close button event handler
		$(document).on('click', '#addReminderModal .close', function() {
			Googlemap.initialize();
		});
		//Add distance
		$(document).on('click', '#addReminderDistanceModal .modal-footer .btn', function() {
			var number = $('#enterReminderDistance').val();
			appendLocalRemindersDistance([{
				distance : number
			}]);
			App.displayTexts();
			$('#addReminderDistanceModal').modal('hide');
		});
		//Delete reminder functionality
		$(document).on('click', '.crossButton', function() {
			var myJsonObject = getLocalReminders();
			myJsonObject.splice($(this).prev()["0"].id, 1);
			replaceLocalReminder(myJsonObject);
			App.displayTexts();
			Googlemap.initialize();
			$(this).parents('.mainComponentDiv').remove();
		});
		//For pagination
		$(document).on("click", ".dt-show-page", function() {
			if ($(this).parent().hasClass('disabled')) {
				return;
			}
			startFrom = $(this).data("start");
			App.displayTexts(startFrom);
		});
		//This is on page load - init
		App.displayTexts();
	},
		//Sorting based on parameter
	'sortResults' : function(prop, myJsonObject) {
		var sort_alpha = function(a, b) {
			if (a[0] == b[0]) {
				return 0;
			}
			if (a[0] > b[0]) {
				return -1;
			} else {
				return 1;
			}
		}, sort_numeric = function(a, b) {
			aa = parseFloat(a[0].replace(/[^0-9.-]/g, ''));
			if (isNaN(aa)) {
				aa = 0;
			}
			bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''));
			if (isNaN(bb)) {
				bb = 0;
			}
			return aa - bb;
		};
		var desc = true;
		var rows = [];
		for (var row_id in myJsonObject) {
			var name = myJsonObject[row_id][prop].toString();
			rows.push([name, prop]);
		}
		rows.sort(sort_alpha);
		rows.reverse();
		var sortedData = [];
		for (var j = 0; j < rows.length; j++) {
			for (var k = 0; k < rows.length; k++) {
				if (myJsonObject[k].relativeDistance == rows[j][0]) {
					sortedData.push(myJsonObject[k]);
					break;
				}
			}
		}
		delete rows;
		return sortedData;
	},
	//TODO: this might not have been used
	'success' : function(position) {
		return position;
	},
	//Display reminder- A method of pagination
	'displayTexts' : function(startValue) {
		var container = $('#additionDiv');
		var myJsonObject = getLocalReminders();
		$('.noReminder').remove();
		$('.mainComponentDiv').remove();
		if (myJsonObject != undefined) {
			var startFrom = 1;
			var total = Object.keys(myJsonObject).length;
			if (total <= 5) {
				startFrom = 1;
			}
			if (startValue) {
				startFrom = startValue;
			}
			data = App.paginateData(myJsonObject, startFrom, 5);
			for (var i in data) {
				var distanceToRemind = JSON.parse($.jStorage.get('reminderDistance'));
				/*
				 * fixing distance to remind as 2 when it is not configured.
				 */
				console.log(distanceToRemind);
				if (distanceToRemind == null) {
					distanceToRemind = [{
						distance : 2
					}];
				}

				if (data[i].relativeDistance < distanceToRemind[0].distance) {
					container.append('<div class="mainComponentDiv alertDiv"><p><span>' + data[i].reminder + '</span><button class="buttonClass" id="' + i + '">edit</button><button class="crossButton"><i class="icon-remove"></i></button></p></div>');
				} else {
					container.append('<div class="mainComponentDiv"><p><span>' + data[i].reminder + '</span><button class="buttonClass" id="' + i + '">edit</button><button class="crossButton"><i class="icon-remove"></i></button></p></div>');
				}
			}
			App.showPager(total, startFrom, 5);
		} else {
			container.append('<div class="noReminders"> No reminders are set currently.</div>');
		}
	},

	'paginateData' : function(data, start, limit) {
		var pageData = [];
		start = parseInt(start);
		limit = parseInt(limit);
		for (var row_id in data) {
			if (row_id < start - 1) {
				continue;
			}
			if (row_id >= limit + start - 1) {
				continue;
			}
			pageData[row_id] = data[row_id];
		}
		return pageData;
	},
	//Used for pagination
	'showPager' : function(total, start, limit) {
		total = parseInt(total);
		start = parseInt(start);
		limit = parseInt(limit);
		$(".dt-pager").remove();
		var prev = start - limit;
		if (prev < 1) {
			prev = 1;
		}
		var end = start + limit - 1;
		var next = end + 1;
		if (end >= total) {
			end = total;
			next = total - limit + 1;
		}
		if (next < prev) {
			next = prev;
		}
		var startDisabled = '';
		var endDisabled = '';
		if (start == 1) {
			startDisabled = 'disabled';
		}
		if (!total || total == end) {
			endDisabled = 'disabled';
		}
		var pager = '<div class="pager  pull-right"><ul>'
		pager += '<li class="' + startDisabled + '"><a href="#" class="dt-show-page" data-start="' + prev + '">Prev</a></li>';
		pager += '<li class="' + endDisabled + '"><a href="#" class="dt-show-page" data-start="' + next + '">Next</a></li>';
		pager += '</ul></div>';
		var $pager = $(pager).css("margin", 0);
		var $container = $('<div class="dt-pager pull-right"></div>').appendTo('#additionDiv');
		$pager.appendTo($container);
		msg = start + "-" + end + " of " + total;
		if (total == 0) {
			msg = "No Records Found";
		}
		$('<div class="msg pull-right" data-start="' + start + '">' + msg + '</div>').appendTo($container);
	}
};

App.init();
