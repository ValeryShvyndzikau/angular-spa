exports.getAdminHome = function (request, response) {
    response.render(__dirname + '/views/index.jade', {
        title: 'Express',
        content: 'That is a GET request'
    });
}
