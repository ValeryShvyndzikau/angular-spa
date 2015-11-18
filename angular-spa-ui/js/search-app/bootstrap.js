"use strict";

module.exports = function(application, angular){


var cartModule = require('./cart-module')(angular);
var searchModule = require('./search-module')(angular);
var tagsModule = require('./tags-module')(angular);
    
    application.factory('Promises', function($q, $http){

        function getAsyncData(method, url) {
            var deferred = $q.defer();
            
            $http({ method: method, url: url })
                .success(function(data){
                    data.url = url;
                    deferred.resolve(data);
                })
                .error(function(data,status){
                    deferred.reject(data,status)
                });

            return deferred.promise;
        };

        function getALL(method) {
            var promiseList = new Array();
            for ( var i=1; i<arguments.length; i++ ) {
                promiseList.push(getAsyncData(method, arguments[i]))
            };

            var deferred = $q.defer();
            $q.all(promiseList)
                .then(
                    function(values) {
                        deferred.resolve(values)
                    },
                    function(data, status) {
                        deferred.reject(data, status);
                    }
                );
            
            return deferred.promise;
        };

        return {
            getAsyncData: getAsyncData,
            getAll : getALL
        };
    });
    
    application.controller('mainCtrl', ['$scope', 'Promises',  function($scope, Promises) {                              
        // Promises requests responce
    var responsePromises    = new Array(),
        getMethod           = 'GET',
        postMethod          = 'POST',
        putMethod           = 'PUT',
        putMethod           = 'DELETE',
        getUserPath         = '/user/' + GLOBAL_USER_ID,
        getRolePath         = '/role/',
        getTokenPath        = '/user-token/',
        getValidatePath     = '/user-validate/',
        userId,
        userToken,
        userValidate,
        inited              = false,
        initDone            = false;
    
    function initUserData(data) {
        console.log(data);
        responsePromises.push(data);
        userId = data.data._id;
        console.log(userId);
        getRolePath = getRolePath + userId;
        getTokenPath = getTokenPath + userId;
    };
        
    function initRTData(data) {
        for (var i=0; i< data.length; i++){
            responsePromises.push(data[i]);
        }
        getToken(data);
        
        function getToken(data) {
            for (var i=0; i<data.length; i++){
                if (data[i].url && (data[i].url === getTokenPath)){
                    userToken = data[i].data.token;
                }
            }
        }
        
        getValidatePath = getValidatePath + userId + '/' + userToken;
        console.log(data);
        console.log(userToken);
    };

    Promises.getAsyncData(getMethod, getUserPath)
        .then(
            function(data) {
                initUserData(data);
                return Promises.getAll(getMethod, getRolePath, getTokenPath )
            },
            function(data, status) {
                //error function
            })
        .then(
            function(data) {
                initRTData(data);
                return Promises.getAsyncData(getMethod, getValidatePath);
            },
            function(data, status) {
                //error function
            })
        .then(
            function(data) {
                console.log(data);
                userValidate = data.data.result;
                console.log(userValidate);                
                
                // all good                
            },
            function(data, status) {
                //error function
            }
        );

}]);
    
    return application;
    
};