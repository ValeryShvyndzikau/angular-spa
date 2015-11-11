"use strict";

 module.exports = function () {
	//routes?
	this.greeting = 'Hello! this is search controller!';
	//alert(this.greeting);

/*
	var searchRouter = angular.module('searchRouter', ['ui.router']);
	searchRouter.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('/', {
        url: '/search',
        templateUrl:'search-module/search.jade',
        controller: 'searchMainPage'
    })
    .state('search', {
        url: '/search/:query/:cnxt',
        templateUrl:'search-module/search.jade',
        controller: 'searchQuery'
    })
    .state('search.advanced', {
        url: '.advanced',
        templateUrl:'search-module/advanced-search/advanced-search.jade',
        controller: 'advancedSearch'
    })
});
*/
}


/*


search.controller('SearchCtrl', 
	[ '$scope', '$http' , '$location' , function( $scope , $http , $location ) {

    $scope.greeting = 'Hello! this is search controller!';
   
}]);

search.controller('AdvancedSearchCtrl', 
	['$scope', '$http' , '$location' , function( $scope , $http , $location ) {

    $scope.greeting = 'Hello! this is Advanced Search controller!';
   
}]);

 */