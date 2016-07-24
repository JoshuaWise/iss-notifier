'use strict';
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
	className: 'location-collection',
	render: function () {
		var ul = document.createElement('ul');
		this.model.models.forEach(function (location) {
			var li = document.createElement('li');
			location.appendTo(li);
			ul.appendChild(li);
		});
		this.$el.html('').append(ul);
		return this;
	},
	initialize: function () {
		this.listenTo(this.model, 'update', this.render);
	}
});
