'use strict';
require('./settings');
var LocationCollection = require('./location-collection/collection');

var locationList = new LocationCollection;
locationList.appendTo('.left-side');
