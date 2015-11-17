"use strict";

require('angular-ui-router');
require('./search-module');
require('./cart-module');
require('./tags-module');

var searchApp = angular.module('searchApp', ['ui.router', 'search', 'cart', 'tags']);

angular.element(document).ready(function () {

    searchApp.
        config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('search');
            console.log('SearchApp module: init config');
        }).
        run(function () {
            console.log('SearchApp module: run module');
        });
    angular.bootstrap(document, ['searchApp']);
})

module.exports = searchApp;
