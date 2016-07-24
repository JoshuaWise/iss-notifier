'use strict';

// Generic, all-purpose rendering function.
module.exports = function () {
	this.$el.html(this.template(this.model.attributes));
	return this;
};
