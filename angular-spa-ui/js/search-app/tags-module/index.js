"use strict";

module.exports = function(angular) {

    // Dependency
    var configCb = require('./tags-cfg');
    var tagModule = angular.module('app.tags', []);
    var tagCtrl = require('./tags-ctrl');
    var tagSrv = require('./tags-srv');
    var tagDir = require('./tags-dir');
    var createTagDir = require('./create-tag-dir');

    // Implementation dependency of module Tags
    tagModule
        .controller('tagController', tagCtrl)
        .service('tagService', tagSrv)
        .directive('tagsList', tagDir)
        .directive('createTag', createTagDir);

    configCb(tagModule);

};
