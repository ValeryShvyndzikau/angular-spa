"use strict";

module.exports = function(searchApp){

    require('angular-ui-router');
    require('./search-module');
    require('./cart-module');
    require('./tags-module');

// Promises requests responce
var responsePromises    = new Array(),
    GET_METHOD          = 'GET',
    POST_METHOD         = 'POST',
    PUT_METHOD          = 'PUT',
    DELETE_METHOD       = 'DELETE',
    GET_USER            = '/user/' + GLOBAL_USER_ID,
    GET_ROLE            = '/role/',
    GET_TOKEN           = '/user-token/',
    GET_VALIDATE        = '/user-validate/',
    USER_ID,
    USER_TOKEN,
    USER_VALIDATE;

    initApp();

    searchApp.factory('Promises', function($q, $http){

        function getAsyncData( method, url){
            var deferred = $q.defer();

            $http({method: method, url: url})
                .success(function(data){
                    data.url = url;
                    deferred.resolve(data);
                })
                .error(function(data,status){
                    deferred.reject(data,status)
                });

            return deferred.promise;
        }

        function getALL(method){
            var promiseList = new Array();
            for (var i=1; i<arguments.length; i++){
                promiseList.push(getAsyncData(method, arguments[i]))
            };

            var deferred = $q.defer();
            $q.all(promiseList).then(
                function(values){
                    deferred.resolve(values)
                },
                function(err){
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        return {
            getAsyncData: getAsyncData,
            getAll : getALL
        }
    })
    
    searchApp.controller('mainCtrl', function($location, Promises){

    function initUserData(data){
        console.log(data);
        responsePromises.push(data);
        USER_ID = data.data._id;
        console.log(USER_ID);
        GET_ROLE = GET_ROLE + USER_ID;
        GET_TOKEN = GET_TOKEN + USER_ID;
    };

    function initRTData(data){
        for (var i=0; i< data.length; i++){
            responsePromises.push(data[i]);
        }
        getToken(data);
        function getToken(data){
            for (var i=0; i<data.length; i++){
                if (data[i].url && (data[i].url === GET_TOKEN)){
                    USER_TOKEN = data[i].data.token;
                }
            }
        }
        GET_VALIDATE = GET_VALIDATE + USER_ID + '/' + USER_TOKEN;
        console.log(data);
        console.log(USER_TOKEN);
    };

    Promises.getAsyncData(GET_METHOD, GET_USER)
        .then(
            function(data){
                initUserData(data);
                return Promises.getAll(GET_METHOD, GET_ROLE, GET_TOKEN )
            })
        .then(
            function(data){
                initRTData(data);
                return Promises.getAsyncData(GET_METHOD, GET_VALIDATE);
            })
        .then(
            function(data){
                console.log(data);
                USER_VALIDATE = data.data.result;
                console.log(USER_VALIDATE);
                if (USER_VALIDATE){

                } else {

                }
            }
    )

})
    
    function initApp(){
    
        angular.element(document).ready(function () {

            searchApp
                .config(function ($stateProvider, $urlRouterProvider) {
                    $urlRouterProvider.otherwise('search');
                })
                .run();

            angular.bootstrap(document, ['searchApp']);

        });
    return searchApp;
}
    
}