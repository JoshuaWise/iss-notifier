'use strict';
/**
 * This module uses the Google Maps API to transform street addresses into
 * latitude/longitude coordinates.
 */
var $ = require('jquery');
var GOOGLE_GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json';

module.exports = function (queryString, callback) {
	if (typeof callback !== 'function') {
		throw new TypeError('Expected second argument to be a function.');
	}
	$.getJSON(GOOGLE_GEOCODING_API, {
		address: '' + queryString
	})
	.done(function (response) {
		if (response
		&& response.results
		&& response.results[0]
		&& response.results[0].geometry
		&& response.results[0].geometry.location) {
			callback(null, {
				lat: response.results[0].geometry.location.lat,
				lon: response.results[0].geometry.location.lng
			});
		} else {
			callback(new Error('Unexpected response.'));
		}
	})
	.fail(function (jqXHR, textStatus, err) {
		callback(new Error(err.message || err));
	});
};
