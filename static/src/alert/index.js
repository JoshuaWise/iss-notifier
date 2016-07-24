'use strict';
var $ = require('jquery');
$('<div id="alert-area"></div>').appendTo('body');

/**
 * A lightweight utility for creating visual alerts for the user.
 */
module.exports = function (text) {
	var $alert = $('<div class="alert"></div>')
		.text(text)
		.appendTo('#alert-area')
		.slideDown(400);
	var timer = setTimeout(function () {
		$alert.slideUp(400).promise().done(function () {
			$alert.off('click');
			$alert.remove();
		});
	}, 3000);
	$alert.on('click', function () {
		clearTimeout(timer);
		$alert.remove();
	});
};
