"use strict";

// Dependency
var angular = require('angular');
var uiRouter = require('angular-ui-router');
var uiBootsrap = require('angular-ui-bootstrap');

var adminApp = angular.module('app', [
    uiRouter,
    uiBootsrap,
    'app.contentManager'
]);

require('../common')(adminApp);
require('./admin-app-srv')(adminApp);
require('./content-manager-module')(angular);

adminApp
    .config(configCb)
    .run(bootstrap);

angular.bootstrap(document, [adminApp.name]);

function configCb($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .otherwise('content/publication/');
};

function bootstrap(bootstrap, commonService) {
    bootstrap.checkRegistration()
        .then(function (response) {
            commonService.successValidationAction(response);
        })
        .catch(function (error) {
            var errorObj = {
                code: error.code,
                data: error.data
            };
            commonService.userDataCheckError(errorObj);
        });
}
