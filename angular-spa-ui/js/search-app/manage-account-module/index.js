'use strict';

module.exports = function(angular) {

    // Dependency module Manage Account
    var configCb = require('./manage-account-cfg');
    var accountModule = angular.module('app.account', []);
    var accountCtrl = require('./manage-account-ctrl');
    var accountSrv = require('./manage-account-srv');

    // Implementation dependency of module Manage Account
    accountModule
        .controller('accountController', accountCtrl)
        .service('accountService', accountSrv)
        .config(configCb);

};
