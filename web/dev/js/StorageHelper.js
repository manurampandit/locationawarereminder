//specifying the key
var key = "myReminders";
var that=$.jStorage;
/*
 * To get local reminders
 */
function getLocalReminders() {
	return JSON.parse(that.get(key));
}

/*
 * Append local distance to show the reminders
 */
function appendLocalRemindersDistance(currentObject) {
	that.set('reminderDistance', JSON.stringify(currentObject));
}

/*
 * append a local storage
 */
function appendLocalReminders(reminderObject) {
	var currObject = getLocalReminders();
	reminderObject.id = currObject.length;
	currObject.push(reminderObject);
	that.set(key, JSON.stringify(currObject));
}

/*
 * replace current key with json object
 */

function replaceLocalReminder(currentObject) {
	that.set(key, JSON.stringify(currentObject));
}

/*
 * initialize local storage if
 */
function initLocalStorage() {
	//
	value = that.get(key);
	if (value == null) {
		that.set(key, JSON.stringify([]));
	}
}

/*
 * clears local storage
 */
function clearLocalStorage() {
	that.flush();
}

//clearLocalStorage();
initLocalStorage();

