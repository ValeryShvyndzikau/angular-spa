'use strict';

module.exports = function($stateProvider) {

    // Configuration API
    $stateProvider
        .state('tags', {
            url: '/tags',
            views: {
                'module-content': {
                    templateUrl: '/tagModulePageTemplate.html',
                    controller: 'tagController',
                    controllerAs: 'tagCtrl'
                }
            },
            data: {
                pageTitle: 'Manage tags'
            }
        });

};
