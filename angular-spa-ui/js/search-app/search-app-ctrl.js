"use strict";

module.exports = function (app) {

    app.controller('mainCtrl', function ($scope, promises, getTemplate, appConfig) {

        var config = appConfig.config;
        var paths = config.paths;
        var methods = config.methods;
        var userData = config.userData;
        
        paths.userPath += GLOBAL_USER_ID;
        
        function initUserData(data) {
            userData.responsePromises.push(data);
            userData.userId = data.data._id;
            paths.rolePath += userData.userId;
            paths.tokenPath += userData.userId;
        };

        function initRTData(data) {
            for (var x in data){
                userData.responsePromises.push(data[x]);
            }
            
            getToken(data);

            function getToken(data) {
                for (var x in data){
                    if (data[x].url && (data[x].url === paths.tokenPath)){
                        userData.userToken = data[x].data.token;
                    }
                }
            }

            paths.validatePath += userData.userId + '/' + userData.userToken;
        };

        promises.getAsyncData(methods.GET, paths.userPath)
            .then(
                function (data) {
                    initUserData(data);
                    return promises.getAll(methods.GET, [paths.rolePath, paths.tokenPath] )
                })
            .then(
                function (data) {
                    initRTData(data);
                    return promises.getAsyncData(methods.GET, paths.validatePath);
                })
            .then(
                function (data) {
                    userData.userValidateResult = data.data.result;
                    var element = angular.element(document.getElementsByTagName('header'));
                    getTemplate.getByTrustedUrl('/header.html', element, $scope)
                    .then(
                        function () {
                        element = angular.element(document.getElementsByTagName('footer'));
                        return getTemplate.getByTrustedUrl('/footer.html', element, $scope);
                    })
                    .catch(
                        function (err) {
                        console.log(err);
                    });
                })
            .catch(
                function (error) {
                    $scope.inited = false;
                    $scope.err = { code : error.status, data : error.data};
                    var element = angular.element(document.querySelector('#app'));
                    getTemplate.getByTrustedUrl('/error.html', element, $scope);
                    console.log('Error '+ error.status);
                });
    });

}
