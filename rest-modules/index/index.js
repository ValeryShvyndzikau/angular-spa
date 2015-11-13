module.exports = function (app) {
    app.get('/', function (request, response) {
        response.render('js/search-app/index.jade', {
            way: 'js/search-app/',
            backEndData: 'That is a message from Backend',
            userId: app.envSettings.user
        });
    });
}
