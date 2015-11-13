"use strict";

module.exports = function(searchApp){
    require('angular-ui-router');
require('./search-module');
require('./cart-module');
require('./tags-module');

// Promises requests responce
var responsePromises = new Array();

// Request function
var request = function ( url, callback ) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.onload = function() {
        if (request.status === 200) {
            callback(request.response);
        } else {
            callback(Error('Error code:' + request.statusText));
        }
    };
    request.onerror = function() {
        callback(Error('There was a network error.'));
    };
      
    request.send();
};

// Check requests response
var checkResult = function ( data ) {
    if (data instanceof Error){
        return false;
    } else {
        if (data.error) {
            return false;
        } else {
            return true;
        }
    }
};

// Get user promice
var getUser = new Promise(
    
    function(resolve, reject) {  
        var url = '/user/' + GLOBAL_USER_ID;
        request( url, function( result ){
            if (checkResult(result)) {
                responsePromises.push(result);
                resolve(result);
            } else {
                reject(new Error('Error on ' + url + 'request. Result is ' + result));
                // Do some redirect 
            }                        
        });        
    });

getUser.then( 
    function(responce){
        // Init parallel promises
        var promises = [
    
            new Promise(
                function( resolve, reject ) {
                    var url = '/role/' + responsePromises[0].data._id;
                    request( url, function( result ){
                        if (checkResult(result)) {
                            result.do = 'getRole';
                            responsePromises.push(result);
                            resolve(result);
                        } else {
                            reject(new Error('Error on ' + url + 'request. Result is ' + result));
                            // Do some redirect 
                        } 
                    })
                }
            ),


            new Promise(
                function( resolve, reject ) {            
                    var url = '/user-token/' + responsePromises[0].data._id;
                    request( url, function( result ){
                       if (checkResult(result)) {
                           responsePromises.push(result);
                           result.do = 'getToken';
                           resolve(result);
                        } else {
                            reject(new Error('Error on ' + url + 'request. Result is ' + result));
                            // Do some redirect 
                        } 
                    })
                }
            )
        ];
        
        if (responce){
            Promise.all( promises ).then(
                function( values ) {
                    if (checkResult(values[0]) && checkResult(values[1])) {
                       
                        // Validate data promise
                        var checkData = new Promise(                            
                            function( resolve, reject){
                                var userId = responsePromises[0].data._id;
                                var userToken = (function() {
                                    for ( var i = 0; i < responsePromises.length; i++){
                                        if (responsePromises[i].do && responsePromises[i].do === 'getToken') {     
                                            return responsePromises[i].data.token;
                                        }
                                    }
                                })();
                                var url = '/user-validate/' + userId + '/' + userToken;
                                
                                request( url, function(responce){
                                    if (responce instanceof Error){
                                        reject(new Error('Error data validate! Url is ' + url ));
                                        // Do some redirect 
                                    } else {
                                        responsePromises.push(responce);
                                        resolve(responce);
                                    }
                                })
                            }
                       );
                        
                        checkData.then( 
                            function(responce){
                            if (responce.data.result){
                                // Validation is ok
                                initApp();
                            } else {
                                reject(new Error('Error data validation request'));
                                // Do some redirect 
                            }
                        })
                    } else {
                        reject(new Error('Error data validation of getToken or getRole request'));
                    } 
                    
                });      
        }
    });

function initApp(){
    
        angular.element(document).ready(function () {

             searchApp.
                config(function ($stateProvider, $urlRouterProvider) {
                    $urlRouterProvider.otherwise('search');
                }).
                run(function () {
                });

            angular.bootstrap(document, ['searchApp']);

        });
    return searchApp;
}
    
}
