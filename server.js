'use strict';
var express = require('express');
var app = express();
var PORT = 7000;

// A rudimentary static file server.
app.use(express.static('./static'));
app.listen(PORT, function () {
	console.log('Server listening at http://localhost:' + PORT);
});
