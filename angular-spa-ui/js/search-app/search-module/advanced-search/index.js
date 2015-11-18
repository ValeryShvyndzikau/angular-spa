"use strict";

module.exports = function(ngModule) {
    
    var advancedSearch = ngModule.module('searchApp.searchModule.advancedSearch', ['ui.router']);

    advancedSearch
        .config(function ($stateProvider) {
            $stateProvider
                .state('search.advanced', {
                    url: '.advanced',
                    template: "Hello world advanced search"
            });
        });

    return advancedSearch;
}
