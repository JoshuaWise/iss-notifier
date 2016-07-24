'use strict';
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({
	className: 'location',
	template: _.template(require('./template')),
	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	initialize: function () {
		this.listenTo(this.model, 'change', this.render);
	}
});
