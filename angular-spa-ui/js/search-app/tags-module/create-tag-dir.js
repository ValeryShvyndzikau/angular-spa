"use strict";

module.exports = function tagControllPanel() {

    var tagControllPanel = {
        restrict: 'E',
        transclude: true,
        scope: {
            tags: '&',
        },
        controller: 'apiTagCtrl',
        templateUrl: '/tagControllPanelTemplate.html',
        replace: true
    };

    return tagControllPanel;

};
