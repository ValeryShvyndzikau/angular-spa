"use strict";

module.exports =  function apiTagCtrl($scope, resultTagPageSrv) {

    $scope.tags = {};
    $scope.isEmpty = 'empty';
    $scope.form = {
        name: ""
    };

    // Visibility (show/hide) list tags
    function isEmpty(tagsList) {
        if (tagsList.length === 0) {
            return $scope.isEmpty = 'empty';
        } else {
            return $scope.isEmpty = '';
        }
    };

    // Get list tags
    $scope.loadRemoteData = function () {
        resultTagPageSrv.getTags()
            .then(
                function(tagsList) {
                    applyRemoteData(tagsList);
                }
            );
    };

    // Remove tag
    $scope.removeTagItem = function(tag) {
        resultTagPageSrv.removeTagItem(tag._id)
            .then(
                $scope.loadRemoteData(),
                function(errorMessage) {
                    console.warn(errorMessage);
                }
            );

        $scope.loadRemoteData();
    };

    // Create new tag
    $scope.createTag = function() {
        var tagName = $scope.form.tagName;
        resultTagPageSrv.createTag(tagName)
            .then(
                $scope.loadRemoteData(),
                function( errorMessage ) {
                    console.warn(errorMessage);
                }
            );

        $scope.loadRemoteData();
        $scope.form.tagName = "";
    };

    // Update list tag of scope
    function applyRemoteData(tagsList) {
        $scope.tags = tagsList.data;
        isEmpty($scope.tags);
    };

    // Start module tag
    $scope.loadRemoteData();


};
