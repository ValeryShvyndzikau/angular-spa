"use strict";

module.exports = function(searchApp){

var GET_METHOD          = 'GET',
    POST_METHOD         = 'POST',
    PUT_METHOD          = 'PUT',
    DELETE_METHOD       = 'DELETE',
    GET_USER            = '/user/' + GLOBAL_USER_ID,
    GET_ROLE            = '/role/',
    GET_TOKEN           = '/user-token/',
    GET_VALIDATION      = '/user-validate/',
    USER_ID             = '',
    USER_TOKEN          = '',
    USER_ROLE           = '',
    USER_VALIDATE       = '',
    responsePromises    = new Array();
    
function initApp() {
        
        angular.element(document).ready(function () { 
            angular.bootstrap(document, ['searchApp']);
                searchApp.
                config(function ($stateProvider, $urlRouterProvider) {                    
                    $urlRouterProvider.otherwise('search');                    
                }).
                run();
        });
    return searchApp;
}
    
searchApp.factory('PreloadRequest', function($http, $q) {
    
    function getData(method , url){
//        console.log(url);
//        return $q(function(resolve, reject) {
//            $http({method: method, url:url})
//            .success(function(data){
//                dataParse(dataType, data);
//                console.log(data);
//                resolve(data);
//    
//            })
//            .error(function(data, status, headers, config){
//            console.log('Error');
//                reject(status);
//            });
//            return deferred.promise;
//        });
        console.log(url);        
        var deferred = $q.defer();

        $http({method: method, url:url})
            .success(function(data){     
                console.log(data);
                deferred.resolve(data);
            })
            .error(function(data, status, headers, config){
            console.log('Error');
                deferred.reject(status);
            });
        
        return deferred.promise;
    }
 
    function dataParse(dataType, data){
        console.log(dataType);
        switch (dataType){
            case 'userData': {
                console.log(data);
                responsePromises.push(data);
                USER_ID = data.data._id;
                GET_TOKEN = GET_TOKEN + USER_ID;
                GET_ROLE = GET_ROLE + USER_ID;
                break;
            }
            case 'userRole': {
               //console.log('Get role response');
                responsePromises.push(data);
                console.log(data);
                break;
            }   
            case 'userToken': {
                //console.log('Get token responce');
                responsePromises.push(data);
                console.log(data);
                USER_TOKEN = data.data.token;
                GET_VALIDATION = GET_VALIDATION + USER_ID + '/' + USER_TOKEN;
                break;
            }
            case 'userValidate': {
                USER_VALIDATE = data.data.result;
                console.log(data);
                break;
            }
                
        }
    }
    
    function getRTList () {
        var rPromise = getRole();//getData(GET_METHOD,GET_ROLE, 'userRole');
        var tPromise = getToken();//getData(GET_METHOD,GET_TOKEN, 'userToken');
        return new Array(rPromise,tPromise);        
    };
        
    return {
        getRTList : getRTList,
        getData : getData,
        dataParse : dataParse
    }
});    
    
searchApp.controller('searchAppCtrl', function searchAppCtrl($scope, PreloadRequest, $location, $q, $http){   
    console.log('searchApp controller');
    
    var getUser = $http({method: GET_METHOD, url:GET_USER})    //PreloadRequest.getData(GET_METHOD, GET_USER);
    //var getRole = PreloadRequest.getData(GET_METHOD, GET_ROLE, 'userRole');
    //var getToken = PreloadRequest.getData(GET_METHOD, GET_TOKEN, 'userToken');
    //var getValidation = PreloadRequest.getData(GET_METHOD, GET_VALIDATION, 'userValidation');
    console.log('Start promises');
    getUser
        .then( function(data) {
            PreloadRequest.dataParse('userData', data);
             $http({method: GET_METHOD, url:GET_ROLE})    
             //PreloadRequest.getData(GET_METHOD, GET_ROLE)
            })
        .then(
            function(data){
                PreloadRequest.dataParse('userRole', data);
                $http({method: GET_METHOD, url:GET_TOKEN})    
                //PreloadRequest.getData(GET_METHOD, GET_TOKEN);
            })
        .then(
            function(data){
                PreloadRequest.dataParse('userToken', data);
                $http({method: GET_METHOD, url:GET_VALIDATION})    
                //PreloadRequest.getData(GET_METHOD, GET_VALIDATION);    
            })
        .then(function(data){
            console.log(data);
            PreloadRequest.dataParse('userValidate', data);
    })
     
     
                    
    

});   
    
    
require('angular-ui-router');
require('./search-module');
require('./cart-module');
require('./tags-module');
initApp();
//// Promises requests responce

//
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
//                                initApp(false);
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
    
}
