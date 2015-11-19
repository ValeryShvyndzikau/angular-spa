"use strict";

module.exports = function(ngModule) {
    var advencedSearchModule = require('./advanced-search')(ngModule);

    ngModule.config(function ($stateProvider, $urlRouterProvider) {
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

}
