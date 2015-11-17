"use strict";

require('angular-ui-router');

var tags = angular.module('tags', ['ui.router']);

tags.config(function ($stateProvider) {
    $stateProvider
        .state('tags', {
            url: '/tags',
            template: 'Hello world from tags module',
            //controller: 'tagsMainCtrl'
        })
  });

module.exports = tags;
