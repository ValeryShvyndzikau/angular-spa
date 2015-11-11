"use strict";

function app() {
    console.log('App start');
    var searchApp = angular.module('searchApp', ['ui.router']);
    angular.element(document).ready(function() {
        angular.bootstrap(document.getElementById("app"), ["searchApp"]);
    });
    searchApp.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    .state('/', {
        url: '/',
        views:{
            "main": {
                template: 'This is main page'
            }
        }
        
    })
    .state('search', {
        url: '/search',
        views:{
            "main": {
                template:'Hello!'
            }
        }
        // templateUrl:'/js/search-app/search-module/search.jade',
        // controller: function(){
        //     var search = require(__dirname + '/search-module');
        //     search();
        // }
    });
    $urlRouterProvider.otherwise('/#');   
}); 

};

module.exports = app();

/*
searchApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/#');
    $stateProvider
    .state('search', {
        url: '#search',
        templateUrl:'/js/search-app/search-module/search.jade',
        controller: 'searchMainPage'
    })
    .state('search.cart', {
        url: '.cart',
        templateUrl:'cart-module/cart.jade',
        controller: 'cartMain'
    })
    .state('search.tags', {
        url: '.tags',
        templateUrl:'tags-module/tags.jade',
        controller: 'tagsMain'
    })
});
*/
