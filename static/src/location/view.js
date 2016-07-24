'use strict';
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.View.extend({
	className: 'location',
	template: _.template(require('./template')),
	render: require('../util/render'),
	initialize: function () {
		this.listenTo(this.model, 'change', this.render);
	}
});
