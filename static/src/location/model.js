'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
var LocationView = require('./view');
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
	
	// When an instance is created, it must retrieve the `nextPass` data from
	// the API endpoint. If something goes wrong, an error will be logged.
	initialize: function () {
		var self = this;
		
		if (self.get('loaded')) {
			return;
		}
		
		$.ajax(ISS_PASS_API, {
			dataType: 'jsonp', // Allows CORS
			data: {
				lat: +self.get('lat'),
				lon: +self.get('lon'),
				n: 1 // Retreive only 1 predicted pass
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
		});
	},
	
	// This is used to update what is shown to the user.
	updateMessage: function () {
		var timeLeft = (this.get('nextPass') - Date.now()) / 1000;
		if (isNaN(timeLeft)) {
			this.set('message', this.get('loaded') ? '[Error]' : 'Loading...');
		} else {
			var daysLeft = Math.floor(timeLeft / 86400);
			var hoursLeft = Math.floor(timeLeft / 3600 - daysLeft * 24);
			var minutesLeft = Math.floor(timeLeft / 60 - daysLeft * 1440 - hoursLeft * 60);
			var secondsLeft = Math.floor(timeLeft - daysLeft * 86400 - hoursLeft * 3600 - minutesLeft * 60);
			var message = [];
			daysLeft >= 1 && message.push(daysLeft + ' days');
			hoursLeft >= 1 && message.push(hoursLeft + ' hours');
			minutesLeft >= 1 && message.push(minutesLeft + ' minutes');
			message.push(secondsLeft + ' seconds');
			this.set('message', message.join(', '));
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
