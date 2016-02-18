'use strict';

module.exports = function(tagModule) {

    // Dependency of directive tags-list
    var tagsListDir = require('./tags-list-dir');
    var tagsListCtrl = require('./tags-list-ctrl');

    // Implementation dependency of module Tags
    tagModule
        .controller('tagsListController', tagsListCtrl)
        .directive('tagsList', tagsListDir); // <tags-list/>

};
