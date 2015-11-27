"use strict";

module.exports = function (app) {
    
    app.service('promises', function ($q, $http) {

        function getAsyncData(method, url) {
            
            var deferred = $q.defer();
            
            $http(
                {
                    method: method,
                    url: url
                })
                .success(function (data) {
                    data.url = url;
                    deferred.resolve(data);
                })
                .error(function (data, status) {
                    deferred.reject(
                        {
                            data: data,
                            status: status
                        });
                });

            return deferred.promise;
        };

        function getALL(method, urlList) {
            var promiseList = [];
            for (var url in urlList) {
                promiseList.push(getAsyncData(method, urlList[url]))
            }

            var deferred = $q.defer();
            $q.all(promiseList)
                .then(
                    function (values) {
                        deferred.resolve(values)
                    },
                    function (values) {
                        deferred.reject(values);
                    }
                );
            
            return deferred.promise;
        };

        return {
            getAsyncData: getAsyncData,
            getAll : getALL
        };
    });

    //app config service - can be used with all changes anywhere
    app.service('appConfig', function () {
        
        var config = require('./search-app-config');
        
        return {
            config : config
        }
    });
    
    // app service for templates
    app.service('getTemplate', function ($sce, $compile, $templateRequest, $q) {

        function getByTrustedUrl(url, element, scope) {
            var deferred = $q.defer();
            var templateUrl = $sce.getTrustedResourceUrl(url);
            $templateRequest(templateUrl)
                .then(
                    function (template) {
                        $compile(element.html(template).contents())(scope);
                        deferred.resolve()
                    },
                    function () {
                        deferred.reject('Can not get template!');
                    }
                );
            return deferred.promise;
        };

        return {
            getByTrustedUrl : getByTrustedUrl
        }

    });
    
    app.service('searchStorage', function () {
        var data = {};
        
        var params = {};
        
        return {
            data : data,
            params : params
        }
    });
    
}
