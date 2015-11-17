module.exports = function (app) {
    app.get('/admin', function (request, response) {
        response.redirect('/admin-app');
    });

    app.get('/admin-app', function (request, response) {
        response.render(__dirname + '/views/index.jade', {
            title: 'Express',
            content: 'That is a GET request'
        });
    });
}
