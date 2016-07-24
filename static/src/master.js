'use strict';
require('./settings');
var savedLocations = require('./util/saved-locations');
var LocationCollection = require('./location-collection/collection');

var locationList = new LocationCollection;
locationList.appendTo('.left-side');

savedLocations.get().forEach(function (location) {
	locationList.push(location);
});
