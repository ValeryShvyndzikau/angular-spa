module.exports = function ($injector) {

    return {
        getData: function (configName, keysPath) {

            var config = this.getConfig(configName);
            var keysPathArray = keysPath.split('.');
            var lastKeyIndex = keysPathArray.length - 1;
            
            if (!keysPathArray.length && !_.isEmpty(config)) {
                return false;
            }

            var obj = config;
            _.each(keysPathArray, function(key, index,array){
                if (!_.has(obj, key)) {
                    console.warn('Element \'' + keysPath + '\' not found in ' + configName);
                    obj = false;

                    return false;
                }
                obj = obj[key];

                if (index == lastKeyIndex) {
                    return angular.copy(obj);
                }
            })

            return angular.copy(obj);
        },
        getConfig: function (configName) {

            try {
                return angular.copy($injector.get(configName));
            } catch (err) {
                throw Error('Can not get config ' + configName);
            }

        }
    }
};
