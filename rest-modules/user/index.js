/**
 * @param app
 * @param mongoose
 * @returns {{getModel: getModel}}
 */

module.exports = function (app, mongoose) {

    var model = require('./User.js')(app, mongoose);

    // Returns user by unique identifier
    app.get('/user/:id', getUserRequest);

    // Returns a list of users
    app.get('/users', getUsersRequest);

    // Creates a new user
    app.put('/user/create', createUserRequest);

    // Updating existing user
    app.put('/user/:id/update', updateUserRequest);

    // Deleting existing user
    app.delete('/user/:id/delete', deleteUserRequest);

    // That is a JUNK function for training JS Promices
    app.get('/user-token/:id', getUserTokenRequest);

    // That is a JUNK function for training JS Promices
    app.get('/user-validate/:id/:token', validateUserTokenRequest);

    function getUsersRequest(request, response) {
        var operationName = 'list users';

        return model.find(function (error, data) {
            if (!error) {
                // User found
                return response.send({
                    operation: operationName,
                    status: 'ok',
                    error: null,
                    data: data
                });
            }

            // Error on searching
            return response.send({
                operation: operationName,
                status: 'error',
                error: error,
                data: {}
            });
        });
    }

    function getUserRequest(request, response) {
        var id = request.params.id;
        var operationName = 'get user';

        return model.findById(id, function (error, data) {
            if (!error) {
                // Users found
                return response.send({
                    operation: operationName,
                    status: 'ok',
                    error: null,
                    data: data
                });
            }

            // Error on searching
            return response.send({
                operation: operationName,
                status: 'error',
                error: error,
                data: {}
            });
        });
    }

    function createUserRequest(request, response) {
        var operationName = 'create user';
        var fields = {};

        // Look first schema fields instead request fields for guarantee filling all mandatory
        for (var treeItemName in model.schema.tree) {
            // Skip fields
            if (treeItemName == 'id' || treeItemName == '_id' || treeItemName == '__v') {
                continue;
            }
            var currentTreeNode = model.schema.tree[treeItemName];

            // Check if current schema field presents in request
            if (request.body.hasOwnProperty(treeItemName)) {

                // Check if it is mandatory field
                if (currentTreeNode.hasOwnProperty('mandatory') && currentTreeNode.mandatory == true) {

                    // If mandatory field is empty return error
                    if (request.body[treeItemName].length == 0) {
                        return response.send({
                            operation: operationName,
                            status: 'error',
                            error: 'Field ' + treeItemName + ' is mandatory',
                            data: {}
                        });
                    }
                }

                fields[treeItemName] = request.body[treeItemName];
            }
        }

        var user = new model(fields);

        user.save(function (error) {
            if (!error) {
                // User saved
                return response.send({
                    operation: operationName,
                    status: 'ok',
                    error: null,
                    data: user
                });
            }

            // Error on saving
            return response.send({
                operation: operationName,
                status: 'error',
                error: error,
                data: {}
            });
        });
    }

    function updateUserRequest(request, response) {
        var operationName = 'update user';
        var id = request.params.id;

        // Find item by id
        return model.findById(id, function (error, data) {
            if (!error) {

                // Fill fields according returned
                for (var originalFieldName in data) {

                    // Skip fields
                    if (originalFieldName == 'id' || originalFieldName == '_id' || originalFieldName == '__v') {
                        continue;
                    }

                    if (request.body.hasOwnProperty(originalFieldName)) {
                        data[originalFieldName] = request.body[originalFieldName];
                    }
                }

                data.updated = Date.now();

                // Request saving
                return data.save(function (error) {
                    if (!error) {
                        // Response when the entity has been saved
                        return response.send({
                            operation: operationName,
                            status: 'ok',
                            error: null,
                            data: data
                        })
                    }

                    // Response when saving has been fault
                    return response.send({
                        operation: operationName,
                        status: 'error',
                        error: error,
                        data: {}
                    });
                })
            }

            // Undefined error
            return response.send({
                operation: operationName,
                status: 'error',
                error: error,
                data: {}
            });
        });
    }

    function deleteUserRequest(request, response) {
        var operationName = 'delete user';
        var id = request.params.id;

        // Find item by id
        return model.findById(id, function (error, data) {
            return data.remove(function (error) {
                if (!error) {
                    // User removed
                    return response.send({
                        operation: operationName,
                        status: 'ok',
                        error: null,
                        data: null
                    });
                }

                // Error on removinfg
                return response.send({
                    operation: operationName,
                    status: 'error',
                    error: error,
                    data: null
                });
            });
        });
    }

    function getUserTokenRequest(request, response) {
        var id = request.params.id;
        var operationName = '[JUNK] get user token';

        var user = model.findById(id, function (error, data) {
            if (!error) {
                return response.send({
                    operation: operationName,
                    status: 'ok',
                    error: null,
                    data: {
                        baseId: id,
                        token: generateJunkMask(id)
                    }
                });
            }

            return response.send({
                operation: operationName,
                status: 'error',
                error: error,
                data: {}
            });
        });
    }

    function validateUserTokenRequest(request, response) {
        var operationName = '[JUNK] validate user';
        var id = request.params.id;
        var token = request.params.token

        var user = model.findById(id, function (error, data) {
            if (!error && token == generateJunkMask(id)) {
                return response.send({
                    operation: operationName,
                    status: 'ok',
                    error: null,
                    data: {
                        result: true
                    }
                });
            }

            return response.send({
                operation: operationName,
                status: 'error',
                error: error,
                data: {}
            });
        });
    }

    function getModel() {
        return model;
    }

    function generateJunkMask(data) {
        if (data.length >= 6) {
            return data[4] + data[2] + data[1] + data[0] + data[3] + data[5]
        }
    }

    return {
        getModel: getModel,
    };
}
