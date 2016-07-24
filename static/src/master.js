'use strict';
require('./settings');
var LocationCollection = require('./location-collection/collection');

var locationList = new LocationCollection;
locationList.appendTo('.left-side');


require('./util/find-place')('408 130th St, New York, NY', function (err, result) {
	result.title = 'foo';
	locationList.push(result);
});

require('./util/find-place')('57 Elm Street, Somerville, MA', function (err, result) {
	result.title = 'bar';
	locationList.push(result);
});
