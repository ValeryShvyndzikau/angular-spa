"use strict";

var angular = require('angular');
var uiRouter = require('angular-ui-router');

var application = angular.module('searchApp', [uiRouter, 'searchApp.searchModule', 'searchApp.cartModule', 'searchApp.tagsModule']);

application = require('./bootstrap')(application, angular);

application
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('search.simple');
    })
    .run(function () {

    });

angular.bootstrap(document, ['searchApp']);