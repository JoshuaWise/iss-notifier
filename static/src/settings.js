'use strict';
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};
Backbone.$ = $;
