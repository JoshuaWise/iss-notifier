'use strict';
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var LocationView = require('./view');
var savedLocations = require('../util/saved-locations');
var ISS_PASS_API = 'http://api.open-notify.org/iss-pass.json';

/**
 * Instances of Location should be constructed with the following attributes:
 * - lat	... latitude of the location
 * - lon 	... longitude of the location
 * - title 	... the user-defined name of the location
 */
module.exports = Backbone.Model.extend({
	defaults: {
		message: '',
		loaded: false,
		nextPass: NaN, // Epoch timestamp
		nextPassDuration: NaN, // Milliseconds
	},
	
	initialize: function () {
		if (!this.has('lsid')) {
			this.set('lsid', _.uniqueId(Date.now().toString()));
		}
		if (!this.get('loaded')) {
			this.load();
		}
	},
	
	load: function () {
		var self = this;
		self.set(self.defaults);
		savedLocations.update(self);
		
		$.ajax(ISS_PASS_API, {
			dataType: 'jsonp', // Allows CORS
			data: {
				lat: +self.get('lat'),
				lon: +self.get('lon'),
				n: 2 // For some odd reason, the API is returning a number of passes equal to this number minus 1.
			}
		})
		.done(function (result) {
			if (result && result.response && result.response[0]) {
				self.set({
					nextPass: result.response[0].risetime * 1000,
					nextPassDuration: result.response[0].duration * 1000
				});
			} else {
				console.error('Unexpected API result:', result);
			}
		})
		.fail(function (jqXHR, textStatus, err) {
			console.error('Failed to access API:', err);
		})
		.always(function () {
			self.set('loaded', true);
			savedLocations.update(self);
		});
	},
	
	// This is used to update what is shown to the user.
	updateMessage: function () {
		var timeLeft = (this.get('nextPass') - Date.now()) / 1000;
		var duration = this.get('nextPassDuration');
		if (isNaN(timeLeft)) {
			this.set('message', this.get('loaded') ? '[Error]' : 'Loading...');
		} else if (timeLeft >= 0) {
			this.set('message', 'ETA: ' + formatDuration(timeLeft));
		} else if (duration > -timeLeft) {
			this.set('message', 'Currently overhead for: ' + formatDuration(duration + timeLeft));
		} else {
			this.load(); // Retreive a new `nextPass` time.
		}
		return this;
	},
	
	// Creates an associated view (if one does not already exist), and appends
	// it to the specified element or jQuery selector.
	appendTo: function (elementOrSelector) {
		if (!this.view) {
			this.view = new LocationView({model: this});
			this.updateMessage();
			this.view.render();
		}
		this.view.$el.appendTo(elementOrSelector);
		return this;
	},
	
	// Removes the associated view from the DOM.
	remove: function () {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
		}
		return this;
	}
});

function formatDuration(totalSeconds) {
	var days = Math.floor(totalSeconds / 86400);
	var hours = Math.floor(totalSeconds / 3600 - days * 24);
	var minutes = Math.floor(totalSeconds / 60 - days * 1440 - hours * 60);
	var seconds = Math.floor(totalSeconds - days * 86400 - hours * 3600 - minutes * 60);
	var message = [];
	days >= 1 && message.push(days + ' days');
	hours >= 1 && message.push(hours + ' hours');
	minutes >= 1 && message.push(minutes + ' minutes');
	message.push(seconds + ' seconds');
	return message.join(', ');
}
