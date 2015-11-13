module.exports = function (app) {
    // Defining routes
    var routes = require('./routes.js');

    app.get('/admin', routes.getAdminHome);
}
