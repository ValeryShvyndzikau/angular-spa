"use strict";

module.exports = function resultTagPageSrv($http, $q) {

    function getTags() {
        var request = $http({
            method: 'GET',
            url: '/service/tags'
        });
        return request.then(handleSuccess, handleError);
    }

    function removeTagItem(tagId) {
        var request = $http({
            method: "DELETE",
            url: "/service/tag/delete/" + tagId
        });
        return request.then(handleSuccess, handleError);
    }

    function createTag(tagName) {
        var request = $http({
            method: "POST",
            url: '/service/tag/create',
            data: {
                name: tagName
            }
        });
        return request.then(handleSuccess, handleError);
    }

    function editTag(tagId, tagName) {
        var request = $http({
            method: "PUT",
            url: '/service/tag/update/' + tagId,
            data: {
                name: tagName
            }
        });
        return request.then(handleSuccess, handleError);
    }

    function handleError(response) {
        if ( !angular.isObject(response.data) || !response.data.message ) {
            return $q.reject("An unknown error occurred.");
        }
        return $q.reject(response.data.message);
    }

    function handleSuccess(response) {
        return response.data;
    }

    return {
        titlePage: 'Manage tags',
        titleCreateTag: 'Create tag',
        titleResultTagList: 'Tag list result',
        getTags: getTags,
        removeTagItem: removeTagItem,
        createTag: createTag,
        editTag: editTag
    }


};
