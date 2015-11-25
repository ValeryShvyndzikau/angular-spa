"use strict";

module.exports = function (search) {
    
    search.controller('searchCtrl', function ($scope, $http, appConfig, $uibModal) {
        $scope.greeting = 'Hello world from search simple!';
        var config = appConfig.config;
        var data = 
            $http({ method : config.methods.GET, url : '/service/search/?query=1&offset=0&limit=15&sortBy=DESC'})
                .success(function (data) {
                    console.log(data);
                });
        
        $scope.open = function (size) {

            var modalInstance = $uibModal.open({

                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(
                function (selectedItem) {
                    $scope.selected = selectedItem;
                    console.log($scope.selected);
                },
                function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
        };
        
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.animationsEnabled = true;

    });
    
};
