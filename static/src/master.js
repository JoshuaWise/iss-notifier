'use strict';
require('./settings');

var location = new (require('./location/model'))({title: 'foo', lat: 51.5032510, lon: -0.1278950});
location.appendTo('body');

require('./find-location')('408 130th St, New York, NY', function (err, result) {
	console.log(err || result);
});
