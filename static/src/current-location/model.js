'use strict';
var LocationModel = require('../location/model');
var geolocation = window.navigator.geolocation;

/**
 * This model represents a special case for the Location model, where the
 * coordinates of location are always the user's location.
 */
module.exports = LocationModel.extend({
	initialize: function () {
		var self = this;
		self.set('title', 'Current Location');
		
		if (!geolocation) {
			self.set('message', 'I cannot see your current location, because your browser does not support geolocation.');
			return;
		}
		
		geolocation.getCurrentPosition(function (position) {
			self.set({
				lat: position.coords.latitude,
				lon: position.coords.longitude
			});
			self.load().updateMessage().startTimer();
		}, function (err) {
			self.set('message', 'There was an error while trying to retrieve your location: ' + (err && err.message));
		});
	},
	startTimer: function () {
		this.timer = setInterval(this.updateMessage.bind(this), 1000);
		return this;
	},
	clearTimer: function () {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
		return this;
	}
});
