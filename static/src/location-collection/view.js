'use strict';
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var findPlace = require('../util/find-place');
var alert = require('../alert');

module.exports = Backbone.View.extend({
	className: 'location-collection',
	template: _.template(require('./template')),
	events: {
		'submit .new-location-form': 'submitNewLocation',
		'click .delete-location': 'clickDeleteLocation'
	},
	render: function () {
		var ul = document.createElement('ul');
		this.model.models.forEach(function (location) {
			var li = document.createElement('li');
			$('<div class="delete-location" aria-label="delete">X</div>').appendTo(li);
			location.appendTo(li);
			ul.appendChild(li);
		});
		this.$el.html(this.template({})).prepend(ul);
		return this;
	},
	initialize: function () {
		this.listenTo(this.model, 'update', this.render);
	},
	
	// Attempts to create a new Location object, and appends it to the
	// associated LocationCollection.
	submitNewLocation: function (ev) {
		var address = (ev.target.address && ev.target.address.value || '').trim();
		ev.preventDefault();
		ev.target.reset();
		
		if (!address) {
			return;
		}
		
		$(ev.target).addClass('loading');
		findPlace(address, function (err, coords) {
			if (err) {
				console.log(err);
				alert('Oops! I couldn\'t find the coordinates for that location.');
				$(ev.target).removeClass('loading');
				return;
			}
			coords.title = address;
			this.model.push(coords);
		}.bind(this));
	},
	
	// Removes the adjacent Location object from the collection.
	clickDeleteLocation: function (ev) {
		this.model.removeItem($(ev.target).closest('li').index());
	}
});
