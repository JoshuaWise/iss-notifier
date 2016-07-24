'use strict';
var $ = require('jquery');
var GOOGLE_GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * This function uses the Google Maps API to transform street addresses into
 * latitude/longitude coordinates. The callback argument should be a
 * Node.js-style (error-first) callback.
 */
module.exports = function (queryString, callback) {
	if (typeof callback !== 'function') {
		throw new TypeError('Expected second argument to be a function.');
	}
	
	$.getJSON(GOOGLE_GEOCODING_API, {address: '' + queryString})
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
			callback(new Error('Unexpected response:\n' + JSON.stringify(response, null, 4)));
		}
	})
	.fail(function (jqXHR, textStatus, err) {
		callback(new Error(err.message || err));
	});
};
