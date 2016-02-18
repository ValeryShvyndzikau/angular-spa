"use strict";

module.exports = function ($rootScope, promises, configService, appLocalStorage, commonService, getTemplate, $q) {

    var config = configService.getConfig('appConfig');
    var paths = config.paths;
    var userData = appLocalStorage.getItem('userData') || {};
    var isUserValid = false;

    var hasUserData = function () {
        return (_.has(userData, 'userId') && _.has(userData, 'userToken'));
    }

    var parseUserData = function (data) {
        var deferred = $q.defer();
        if (data.status === 'error') {
            var errObject = {
                code: data.error.name,
                data: data.error.message
            };
            deferred.reject(errObject);
        } else {
            userData = commonService.initUserData(data, userData);
            paths.rolePath += userData.userId;
            paths.tokenPath += userData.userId;
            deferred.resolve();
        }
        return deferred.promise;
    };

    var hasLoggedAction = function () {
        var deferred = $q.defer();

        validateUser()
            .then(function () {
                isUserValid = true;
                deferred.resolve();
            }, function () {
                isUserValid = false;
                return notLoggedAction()

            })
            .then(function () {
                    deferred.resolve();
                },
                function (error) {
                    deferred.reject(error);
                })

        return deferred.promise;
    }

    var notLoggedAction = function () {
        var deferred = $q.defer();
        userData = {};
        config = configService.getConfig('appConfig');
        paths = config.paths;
        paths.userPath += GLOBAL_USER_ID;
        promises.getAsyncData('GET', paths.userPath)
            .then(parseUserData)
            .then(function () {
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            })

        return deferred.promise;
    }

    var isLoggedIn = function () {
        var deferred = $q.defer();
        if (hasUserData()) {
            paths.validatePath += userData.userId + '/' + userData.userToken;
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
    }

    var getUserData = function () {
        var deferred = $q.defer();
        isLoggedIn()
            .then(hasLoggedAction, notLoggedAction)
            .then(function () {
                deferred.resolve()
            })
            .catch(function (err) {
                deferred.reject(err);
            })

        return deferred.promise;
    }
    
    var getRoleAndToken = function () {
        if (isUserValid) return;

        var deferred = $q.defer();

        promises.getAll('GET', [paths.rolePath, paths.tokenPath])
            .then(function (response) {
                userData = commonService.getToken(response, userData, paths.tokenPath);
                userData = commonService.getUserPermissions(response, userData);
                paths.validatePath += userData.userId + '/' + userData.userToken;
                deferred.resolve();
            })
            .catch(function (error) {
                deferred.reject(error)
            })
        return deferred.promise;
    }
    
    var validateUser = function () {
        var deferred = $q.defer();

        promises.getAsyncData('GET', paths.validatePath)
            .then(function (data) {
                if (data.status === 'ok' && data.data.result) {
                    deferred.resolve();
                } else {
                    var errorObj = {
                        code: 'Validation Error',
                        data: 'Validation of user data failed!'
                    };
                    deferred.reject(errorObj);
                }
            })
            .catch(function (error) {
                deferred.reject();
            })

        return deferred.promise;
    }
    
    var checkRegistration = function () {
        var deferred = $q.defer();
        getUserData()
            .then(getRoleAndToken)
            .then(validateUser)
            .then(function () {
                deferred.resolve(userData)
            })
            .catch(function (error) {
                deferred.reject(error)
            });

        return deferred.promise;
    }

    return {
        checkRegistration: checkRegistration
    }

};
