"use strict";

module.exports = function(ngModule) {

    var cartModule = ngModule.module('searchApp.cartModule', ['ui.router']);

    cartModule.config(function ($stateProvider) {
        $stateProvider
            .state('cart', {
              url: '/cart',
              template: 'Hello world from cart module',
            })
      });

    return cartModule;
}
