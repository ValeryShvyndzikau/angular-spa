"use strict";

module.exports = function () {
	var searchCtrl = require(__dirname + '/search-ctrl.js');

	console.log('Search-module');
	angular.module('searchApp', []).controller(searchCtrl);

}
