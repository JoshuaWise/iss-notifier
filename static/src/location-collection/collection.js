'use strict';
var Backbone = require('backbone');
var LocationCollectionView = require('./view');

module.exports = Backbone.Collection.extend({
	model: require('../location/model'),
	
	// Creates an associated view (if one does not already exist), and appends
	// it to the specified element or jQuery selector.
	appendTo: function (elementOrSelector) {
		if (!this.view) {
			this.view = new LocationCollectionView({model: this});
			this.view.render();
			
			// Location objects within this collection will be updated every
			// second, as long as this collection is represented in the DOM.
			this.timer = setInterval(function () {
				this.models.forEach(function (location) {
					location.updateMessage();
				});
			}.bind(this), 1000);
		}
		this.view.$el.appendTo(elementOrSelector);
		return this;
	},
	
	// Removes the associated view from the DOM.
	remove: function () {
		if (this.view) {
			this.view.remove();
			this.view = undefined;
			clearInterval(this.timer);
		}
		return this;
	}
});
