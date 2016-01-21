'use strict';

module.exports = function($stateProvider) {

    // Configuration API
    $stateProvider
        .state('account', {
            url: '/account',
            views: {
                'module-content': {
                    templateUrl: '/accountModulePageTemplate.html',
                    controller: 'accountController',
                    controllerAs: 'accountCtrl'
                }
            },
            data: {
                pageTitle: 'Manage account'
            }
        });

};
