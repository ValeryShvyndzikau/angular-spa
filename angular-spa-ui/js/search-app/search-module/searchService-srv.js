"use strict";
// to delete ...all
module.exports = function () {

    //Find value in objects list (for limits and sortBy) and returns its id
    var findValueId = function (val, object) {
        for (var x in object) {
            if (object[x].value === val) {
                return x;
            }
        }
    };

    //if object has no keys return true, else false
    var isEmptyObject = function (obj) {
        if (angular.equals({}, obj)) {
            return true;
        }
        return false;
    }

    var generateQueryParams = function (path, stateParams) {
        var url = path;

        _.each(stateParams, function(param, index){
            url += index + '=' + param;
            if (param != _.last(stateParams)) {
                url += '&';
            }
        })

        return url;
    }

    return {
        findValueId: findValueId,
        isEmptyObject: isEmptyObject,
        generateQueryParams: generateQueryParams
    }


};
