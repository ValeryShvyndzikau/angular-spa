"use strict";

module.exports = function(tagModule) {

    // Configuration API
    function configCb($stateProvider) {
        $stateProvider
            .state('tags', {
                url: '/tags',
                views:{
                    "module-content": {
                        templateUrl: '/tagModuleTemplate.html',
                        controller : 'mainTagCtrl'
                    }
                }
            });
    };

    // Implement
    tagModule.config(configCb);

}
