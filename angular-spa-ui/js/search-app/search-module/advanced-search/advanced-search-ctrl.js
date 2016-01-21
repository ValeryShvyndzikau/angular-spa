"use strict";

module.exports = function (advancedSearch) {

    advancedSearch.controller('advancedSearchCtrl', function ($state, configService, searchService, $stateParams, $scope, $uibModalInstance, $controller, searchStorage, advancedSearchConfig, searchObserver) {

        var config = configService.getConfig('searchConfig');

        $controller('searchCtrl', {
            $scope: $scope
        });

        var vm = this;

        vm.model = {
            config: advancedSearchConfig.config,
            prevId: 1,
            queryParams: $stateParams,
            data: '',
            rows: [],
            query: []
        };
        searchStorage.objQuery = vm.model.config.tplQuery;


        vm.viewApi = {
            setSearchIn: function (val) {
                vm.model.searchIn = vm.model.searchInList[searchService.findValueId(val, vm.model.searchInList)];
                vm.model.queryParams.searchIn = vm.model.searchIn.value;
                vm.model.queryParams.offset = 0;
            },
            setTypeData: function (val) {
                vm.model.searchIn = vm.model.searchInList[
                    searchService.findValueId(val, vm.model.searchInList)
                    ];
                $stateParams.searchIn = vm.model.searchIn.value;
            },
            find: function () {
                searchStorage.searchState = 'search.advancedQuery';

                angular.extend(
                    searchStorage.objQuery,
                    privateApi.buildRequest(vm.model.searchIn.value)
                );

                if (vm.viewApi.hasQuery()) {
                    vm.model.showResults = false;
                    $uibModalInstance.close();
                    $state.go(
                        searchStorage.searchState,
                        vm.model.queryParams, {
                            inherit: false,
                            reload: true
                        }
                    );
                }
            },
            hasQuery: function () {
                if (vm.model.query || !_.isEmpty(searchStorage.objQuery)) {
                    return true;
                }
                return false;
            },
            cancel: function () {
                $uibModalInstance.close(
                    $state.go(
                        searchStorage.searchState,
                        vm.model.queryParams, {
                            inherit: false,
                            reload: true
                        }
                    )
                );
            },
            addNewRow: function (index) {
                var rowObj = angular.copy(config.tplRow),
                    rowObjResult = angular.copy(config.baseQuery);
                rowObj.id = prevId;
                vm.model.rows.push(rowObj);
                vm.model.query.push(rowObjResult);
                prevId++;
            },
            changeAdvanced: function (ids, val, param) {
                param == 'query' ? vm.model.query[ids][param] = val : vm.model.query[ids][param] = val.value;
            },
            deleteRow: function (index) {
                vm.model.rows.splice(index, 1);
                vm.model.query.splice(index, 1);
            }
        };

        var privateApi = {
            getCurrentRequestContext: function () {
                var obj = {
                    conditions: vm.model.query,
                    sortingOrder: "ASC",
                    sortingField: "title"
                };

                return obj;
            },

            buildRequest: function (dest) {
                var obj = {};
                obj[dest] = privateApi.getCurrentRequestContext();

                return {
                    context: obj
                }
            }
        };

        vm.model.data = vm.model.config.tplRow;
        vm.model.rows.push(angular.copy(vm.model.config.tplRow));
        vm.model.rows[0].selectFields.splice(0, 1);
        vm.model.query.push(angular.copy(vm.model.config.baseQuery));
        vm.model.query[0].condition_op = 'NONE';

    });

}
