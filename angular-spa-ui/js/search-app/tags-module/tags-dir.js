"use strict";

module.exports = function tagItem() {

    var tagItem = {
        restrict: 'E',
        transclude: true,
        scope: {
            tags: "=",
            tag: "@"
        },
        controller: 'apiTagCtrl',
        templateUrl: '/tagItemTemplate.html',
        replace: true
    };

    return tagItem;

};
