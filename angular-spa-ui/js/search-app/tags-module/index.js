"use strict";

module.exports = function(ngModule) {

    var tagsModule = ngModule.module('searchApp.tagsModule', ['ui.router']);

    tagsModule.config(function ($stateProvider) {
        $stateProvider
            .state('tags', {
                url: '/tags',
                template: 'Hello world from tags module',
            })
      });

    return tagsModule;
}
