'use strict';
var localStorage = window.localStorage;
var KEY = 'savedLocations';

/**
 * This module uses the LocalStorage API to persist your saved locations within
 * the webapp.
 */


// Init the local store.
(function () {
	try {
		if (!localStorage.getItem(KEY)) {
			throw 0
		}
		JSON.parse(localStorage.getItem(KEY));
	} catch (err) {
		localStorage.setItem(KEY, '[]');
	}
}());


// Returns an array of all persistent location objects. If an index is passed,
// the object at that index is returned instead.
exports.get = function (index) {
	var array = JSON.parse(localStorage.getItem(KEY));
	return index == null ? array.slice() : array[index];
};

// Adds or updates a location object into localStorage.
exports.save = function (location) {
	var array = exports.get();
	var lsid = location.get('lsid');
	for (var i=0, len=array.length; i<len; i++) {
		if (array[i].lsid === lsid) {
			break;
		}
	}
	array[i] = location;
	localStorage.setItem(KEY, JSON.stringify(array));
	return exports;
};

// If the given location object already exists in localStorage, it is updated.
// If not, nothing happens.
exports.update = function (location) {
	var array = exports.get();
	var lsid = location.get('lsid');
	for (var i=0, len=array.length; i<len; i++) {
		if (array[i].lsid === lsid) {
			array[i] = location;
			localStorage.setItem(KEY, JSON.stringify(array));
			break;
		}
	}
	return exports;
};

// Removes a location object from localStorage.
exports.delete = function (location) {
	var array = exports.get();
	var lsid = location.get('lsid');
	for (var i=0, len=array.length; i<len; i++) {
		if (array[i].lsid === lsid) {
			array.splice(i, 1);
			localStorage.setItem(KEY, JSON.stringify(array));
			break;
		}
	}
	return exports;
};
