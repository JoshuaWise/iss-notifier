'use strict';
require('./settings');
var SavedLocations = require('./util/saved-locations');
var LocationCollection = require('./location-collection/collection');

var locationList = new LocationCollection;
locationList.appendTo('.left-side');

SavedLocations.get().forEach(function (location) {
	locationList.push(location);
});
