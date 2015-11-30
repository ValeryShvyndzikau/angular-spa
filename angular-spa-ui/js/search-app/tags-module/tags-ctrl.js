"use strict";

module.exports =  function mainTagCtrl($scope, resultTagPageSrv) {

    // Property of object (get static params)
    $scope.titlePage = resultTagPageSrv.titlePage;
    $scope.titleCreateTag = resultTagPageSrv.titleCreateTag;
    $scope.titleResultTagList = resultTagPageSrv.titleResultTagList;

};
