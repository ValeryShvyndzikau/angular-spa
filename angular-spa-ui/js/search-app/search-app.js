"use strict";

var angular = require('angular');
var uiRouter = require('angular-ui-router');
var cartModule = require('./cart-module')(angular);
var searchModule = require('./search-module')(angular);
var tagsModule = require('./tags-module')(angular);

var application = angular.module('searchApp', [uiRouter, 'searchApp.searchModule', 'searchApp.cartModule', 'searchApp.tagsModule']);

application
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('search.simple');
    })
    .run(function () {

    });

angular.bootstrap(document, ['searchApp']);
