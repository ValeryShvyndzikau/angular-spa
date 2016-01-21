"use strict";

module.exports = function (angular) {

    var contentManager = angular.module('app.contentManager', []);

    var contentManagerCtrl = require('./contentManager-ctrl');
    var contentStorageSrv = require('./contentStorage-srv');
    var contentManagerSrv = require('./contentManager-srv');
    var contentManagerConfig =require('./contentManager-config');

    contentManager
        .config(configCb)
        .constant('contentManagerConfig', contentManagerConfig)
        .controller('contentManager-ctrl', contentManagerCtrl)
        .service('contentStorage', contentStorageSrv)
        .service('cmService', contentManagerSrv);

    function configCb($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('content', {
                url: '/content/:searchIn/?limit&sortBy&offset',
                params: {
                    limit: {
                        squash: true,
                        value: '15'
                    },
                    sortBy: {
                        squash: true,
                        value: 'ASC'
                    },
                    offset: {
                        squash: true,
                        value: '0'
                    }
                },
                views: {
                    "module-content": {
                        templateUrl: '/admin.html',
                        controller: 'contentManager-ctrl',
                        controllerAs: 'contentManager'
                    }
                }
            });
    };

};
