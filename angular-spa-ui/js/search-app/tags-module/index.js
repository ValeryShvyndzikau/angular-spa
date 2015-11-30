"use strict";

module.exports = function (angular) {

    // Dependency
    var configCb = require('./tags-cfg');
    var tagModule = angular.module('app.tags', []);
    var tCtrl = require('./tags-ctrl');
    var tAPICtrl = require('./tags-api-ctrl');
    var tSrv = require('./tags-srv');
    var tDir = require('./tags-dir');
    var tCreateDir = require('./create-tag-dir');

    // Implement
    tagModule
        .controller('mainTagCtrl', tCtrl)
        .controller('apiTagCtrl', tAPICtrl)
        .service('resultTagPageSrv', tSrv)
        .directive('tagItem', tDir)
        .directive('tagControllPanel', tCreateDir);

    configCb(tagModule);

};
