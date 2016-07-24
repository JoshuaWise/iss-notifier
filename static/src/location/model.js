'use strict';
var $ = require('jquery');
var Backbone = require('backbone');
var LocationView = require('./view');
var ISS_PASS_API = 'http://api.open-notify.org/iss-pass.json';

module.exports = Backbone.Model.extend({
	defaults: {
		lat: 0,
		lon: 0,
		title: 'Untitled',
		message: 'Loading...',
		nextPass: NaN, // Epoch timestamp
		nextPassDuration: NaN // Milliseconds
	},
	initialize: function () {
		var self = this;
		
		if (self.get('nextPass')) {
			self.updateMessage();
			return;
		}
		
		// Load the nextPass data from the API endpoint
		$.get(ISS_PASS_API, {
			lat: +self.get('lat'),
			lon: +self.get('lon'),
			n: 1 // Retreive only 1 predicted pass
		})
		.done(function (result) {
			if (result
			&& result.response
			&& result.response[0]
			&& result.response[0].risetime
			&& result.response[0].duration) {
				self.set({
					nextPass: result.response[0].risetime,
					nextPassDuration: result.response[0].duration
				});
			} else {
				console.error('Unexpected API result:', result);
			}
		})
		.fail(function (jqXHR, textStatus, err) {
			console.error(String(err));
		})
		.always(function () {
			self.updateMessage();
		});
	},
	updateMessage: function () {
		var timeLeft = this.get('nextPass') - Date.now();
		if (isNaN(timeLeft)) {
			this.set('message', '[Error]');
		} else {
			var daysLeft = Math.floor(timeLeft / 86400000);
			var hoursLeft = Math.floor(timeLeft / 3600000 - daysLeft * 24);
			var minutesLeft = Math.floor(timeLeft / 60000 - daysLeft * 24 - hoursLeft * 60);
			var secondsLeft = Math.floor(timeLeft / 1000 - daysLeft * 24 - hoursLeft * 60 - minutesLeft * 60);
			var message = [];
			daysLeft >= 1 && message.push(daysLeft + ' days');
			hoursLeft >= 1 && message.push(hoursLeft + ' hours');
			minutesLeft >= 1 && message.push(minutesLeft + ' minutes');
			message.push(secondsLeft + ' seconds');
			this.set('message', message.join(', '));
		}
		return this;
	},
	appendTo: function (elementOrSelector) {
		var view = this.view;
		if (!view) {
			view = this.view = new LocationView({model: this});
		}
		view.render();
		view.$el.appendTo(elementOrSelector);
		return this;
	},
	remove: function () {
		this.view && this.view.remove();
		return this;
	}
});
