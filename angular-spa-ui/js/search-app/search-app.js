"use strict";

var angular = require('angular');
var uiRouter = require('angular-ui-router');
var app = angular.module('searchApp', [uiRouter]);

var cartModule = require('./cart-module')(app);
var searchModule = require('./search-module')(app);

app
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('search.simple');
    })
    .run(function () {

    });

angular.bootstrap(document, ['searchApp']);
