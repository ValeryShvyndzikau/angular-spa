"use strict";

module.exports = function(ngModule) {
    
    var advancedSearchModule = require('./advanced-search')(ngModule);
    var searchModule = ngModule.module('searchApp.searchModule', ['ui.router', 'searchApp.searchModule.advancedSearch']);

    searchModule.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('search', {
                abstract: true,
                url: '/search',
                template: '<ui-view/>'
            })
            .state('search.simple', {
                url: '.simple',
                template: 'Hello world simple search'
            })
        });

    return searchModule;
}
