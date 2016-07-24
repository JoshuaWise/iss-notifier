'use strict';
require('./settings');
var SavedLocations = require('./util/saved-locations');
var LocationCollection = require('./location-collection/collection');
var CurrentLocation = require('./current-location/model');

var locations = new LocationCollection;
locations.appendTo('.left-side');
locations.set(SavedLocations.get());

var currentLocation = new CurrentLocation;
currentLocation.appendTo('.right-side');
