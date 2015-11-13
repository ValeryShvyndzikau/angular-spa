"use strict";

var searchApp = angular.module('searchApp', ['ui.router', 'search', 'cart', 'tags']);

searchApp = require('./bootstrap')(searchApp);

module.exports = searchApp;
