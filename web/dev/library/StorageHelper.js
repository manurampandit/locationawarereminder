//specifying the key
var key = "myReminders";

//check if local storage exist
function is_localStorage_Supported() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (err) {
		return false;
	}
}

/*
 * To get local reminders
 */
function getLocalReminders() {
	return JSON.parse(localStorage.getItem(key));
}

/*
 * This method can be used to update/save in local storage
 */
function saveLocalReminder() {
	var reminderObject=[];
	localStorage.setItem(key,JSON.stringify(reminderObject));
}

/*
 * append a local storage
 */
function appendLocalReminders(reminderObject) {
	var currObject = getLocalReminders();
	console.log('myCurrentObject', currObject);
	//localStorage.setItem(key, localStorage.getItem(key).push(reminderObject));
}

/*
 * initialize local storage if
 */
function initLocalStorage() {
	if (is_localStorage_Supported) {
		if (getLocalReminders == null ) {
			saveLocalReminder();
		}
	} else {
		console.log('local storage not supported');
	}
}

initLocalStorage();

