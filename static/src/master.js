'use strict';
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};
Backbone.$ = $;

var location = new (require('./location/model'))({title: 'foo', lat: 51.5032510, lon: -0.1278950});
location.appendTo('body');
