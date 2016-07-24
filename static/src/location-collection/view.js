'use strict';
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
	className: 'location-collection',
	render: function () {
		var ul = document.createElement('ul');
		this.model.models.forEach(function (location) {
			location.appendTo(ul);
		});
		this.$el.html('').append(ul);
		return this;
	},
	initialize: function () {
		this.listenTo(this.model, 'update', this.render);
	}
});
