"use strict";

module.exports = function(searchApp){
    require('angular-ui-router');
    require('./search-module');
    require('./cart-module');
    require('./tags-module');

// Promises requests responce
var responsePromises = new Array(),
    GET_METHOD = 'GET',
    POST_METHOD = 'POST',
    PUT_METHOD = 'PUT',
    DELETE_METHOD = 'DELETE',
    GET_USER = '/user/' + GLOBAL_USER_ID,
    GET_ROLE = '/role/',
    GET_TOKEN = '/user-token/',
    GET_VALIDATE = '/user-validate/',
    USER_ID = '',
    USER_TOKEN = '',
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
                    var host = $location.host();
                    $location.path(host+port+'/error');
                }
            }
    )

})

//// Request function
//var request = function ( url, callback ) {
//    var request = new XMLHttpRequest();
//    request.open('GET', url);
//    request.responseType = 'json';
//    request.onload = function() {
//        if (request.status === 200) {
//            callback(request.response);
//        } else {
//            callback(Error('Error code:' + request.statusText));
//        }
//    };
//    request.onerror = function() {
//        callback(Error('There was a network error.'));
//    };
//
//    request.send();
//};
//
//// Check requests response
//var checkResult = function ( data ) {
//    if (data instanceof Error){
//        return false;
//    } else {
//        if (data.error) {
//            return false;
//        } else {
//            return true;
//        }
//    }
//};
//
//// Get user promice
//var getUser = new Promise(
//
//    function(resolve, reject) {
//        var url = '/user/' + GLOBAL_USER_ID;
//        request( url, function( result ){
//            if (checkResult(result)) {
//                responsePromises.push(result);
//                resolve(result);
//            } else {
//                reject(new Error('Error on ' + url + 'request. Result is ' + result));
//                // Do some redirect
//            }
//        });
//    });
//
//getUser.then(
//    function(responce){
//        // Init parallel promises
//        var promises = [
//
//            new Promise(
//                function( resolve, reject ) {
//                    var url = '/role/' + responsePromises[0].data._id;
//                    request( url, function( result ){
//                        if (checkResult(result)) {
//                            result.do = 'getRole';
//                            responsePromises.push(result);
//                            resolve(result);
//                        } else {
//                            reject(new Error('Error on ' + url + 'request. Result is ' + result));
//                            // Do some redirect
//                        }
//                    })
//                }
//            ),
//
//
//            new Promise(
//                function( resolve, reject ) {
//                    var url = '/user-token/' + responsePromises[0].data._id;
//                    request( url, function( result ){
//                       if (checkResult(result)) {
//                           responsePromises.push(result);
//                           result.do = 'getToken';
//                           resolve(result);
//                        } else {
//                            reject(new Error('Error on ' + url + 'request. Result is ' + result));
//                            // Do some redirect
//                        }
//                    })
//                }
//            )
//        ];
//
//        if (responce){
//            Promise.all( promises ).then(
//                function( values ) {
//                    if (checkResult(values[0]) && checkResult(values[1])) {
//
//                        // Validate data promise
//                        var checkData = new Promise(
//                            function( resolve, reject){
//                                var userId = responsePromises[0].data._id;
//                                var userToken = (function() {
//                                    for ( var i = 0; i < responsePromises.length; i++){
//                                        if (responsePromises[i].do && responsePromises[i].do === 'getToken') {
//                                            return responsePromises[i].data.token;
//                                        }
//                                    }
//                                })();
//                                var url = '/user-validate/' + userId + '/' + userToken;
//
//                                request( url, function(responce){
//                                    if (responce instanceof Error){
//                                        reject(new Error('Error data validate! Url is ' + url ));
//                                        // Do some redirect
//                                    } else {
//                                        responsePromises.push(responce);
//                                        resolve(responce);
//                                    }
//                                })
//                            }
//                       );
//
//                        checkData.then(
//                            function(responce){
//                            if (responce.data.result){
//                                // Validation is ok
//                                initApp();
//                            } else {
//                                reject(new Error('Error data validation request'));
//                                // Do some redirect
//                            }
//                        })
//                    } else {
//                        reject(new Error('Error data validation of getToken or getRole request'));
//                    }
//
//                });
//        }
//    });

function initApp(){
    
        angular.element(document).ready(function () {

             searchApp.
                config(function ($stateProvider, $urlRouterProvider) {
                    //$urlRouterProvider.otherwise('search');
                }).
                run(function () {
                });

            angular.bootstrap(document, ['searchApp']);

        });
    return searchApp;
}
    
}
