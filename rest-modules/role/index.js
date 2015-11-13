module.exports = function (app, mongoose) {

    var model = require('./Role.js')(app, mongoose);

    // Get user permissions
    app.get('/role/:userId', function (request, response) {
        var operationName = 'get user permissions';
        var userId = request.params.userId;

        return model.findOne({userId: userId}, function (error, data) {
            if (error) {
                return response.send({
                    operation: operationName,
                    status: 'error',
                    error: error,
                    data: {}
                });
            }

            return response.send({
                operation: operationName,
                status: 'ok',
                error: null,
                data: data.permissions
            });
        });
    });

    // Set user permissions
    app.post('/role/set/:userId', function (request, response) {
        var operationName = 'set user permissions';
        var userId = request.params.userId;

        return model.findOne({userId: userId}, function (error, data) {
            var requestPermissions = request.body.permissions != undefined ? request.body.permissions : [];
            var roleName = request.body.name != undefined ? request.body.name : null;
            var randomRoleName = 'Unnamed role ' + Math.floor(Math.random() * 1000000);

            if (data == null) {
                // Create permission
                var role = new model({
                    name: roleName != null ? roleName : randomRoleName,
                    permissions: requestPermissions,
                    userId: userId
                });

                role.save(function (error) {
                    if (!error) {
                        return response.send({
                            operation: operationName,
                            status: 'ok',
                            error: null,
                            data: role
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
            else {
                // Update permission
                if (request.body.permissions == undefined) {
                    return response.send({
                        operation: operationName,
                        status: 'error',
                        error: 'You did not specify permissions',
                        data: data
                    })
                }

                if (roleName != null) {
                    data.name = roleName;
                }

                data.permissions = requestPermissions;

                data.save(function (error) {
                    if (!error) {
                        return response.send({
                            operation: operationName,
                            status: 'ok',
                            error: null,
                            data: data
                        });
                    }

                    return response.send({
                        operation: operationName,
                        status: 'error',
                        error: error,
                        data: {}
                    });
                })
            }
        });
    });
}
