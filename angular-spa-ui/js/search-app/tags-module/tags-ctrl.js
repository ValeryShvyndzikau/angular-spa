'use strict';

module.exports = function($scope, $state) {

    var vm = this;

    /**
     * Initializing functions
     */
    var init = function() {
        vm.model = model;
    };

    /**
     * Creating model as object and installing default setting.
     */
    var model = {
        pageTitle: $state.current.data.pageTitle,
    };

    /**
     * Starts controller
     */
    init();
};
