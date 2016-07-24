'use strict';
require('./settings');

var list = new (require('./location-collection/collection'))();
list.appendTo('body');

require('./util/find-place')('408 130th St, New York, NY', function (err, result) {
	result.title = 'foo';
	list.push(result);
});

require('./util/find-place')('57 Elm Street, Somerville, MA', function (err, result) {
	result.title = 'bar';
	list.push(result);
});
