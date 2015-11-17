module.exports = function(app, mongoose, api) {

    var api = api;
    var config = require('../../config.json');
    var Async = require('async');

    app.get('/search-app', searchAppIndexPageRequest);

    app.get('/service/search', searchRequest);

    function searchAppIndexPageRequest (request, response) {
        response.render('js/search-app/index.jade', {
            way: 'js/search-app/',
            backEndData: 'That is a message from Backend',
            userId: app.envSettings.user
        });
    }

    function searchRequest(request, response) {
        var operationName = 'search';

        var query = request.param('query')
            ? request.param('query').trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
            : '.';

        var searchingEntity = request.param('searchIn')
            ? request.param('searchIn').trim()
            : config.search.searchIn;

        var startFrom = request.param('startFrom')
            ? request.param('startFrom').trim()
            : config.search.startFrom;

        var itemsOnPage = request.param('showItems')
            ? request.param('showItems').trim()
            : config.search.itemsOnPage;

        var sortingOrder = request.param('orderBy')
            ? request.param('orderBy').trim()
            : config.search.orderBy;

        var searchingField = request.param('field')
            ? request.param('field').trim()
            : config.search.field;

        var entityModel = api.getRESTModule(searchingEntity);

        if (entityModel == undefined || entityModel == null) {
            return response.send(api.generateResponseObject(
                operationName,
                'error',
                'Looks like ' + searchingEntity + ' does not implemented or does not loaded at the moment...'
            ));
        }
        else {
            entityModel = entityModel.getModel();
        }

        if (!config.search.validSearchEntities.hasOwnProperty(searchingEntity)) {
            return response.send(api.generateResponseObject(
                operationName,
                'error',
                'Entity ' + searchingEntity + ' does not available for searching'
            ));
        }

        if (config.search.validSearchEntities[searchingEntity].indexOf(searchingField) == -1) {
            return response.send(api.generateResponseObject(
                operationName,
                'error',
                'Field ' + searchingField + ' in entity ' + searchingEntity + ' does not available for searching'
            ));
        }

        var searchingRegexp = new RegExp(query, 'i');
        var searchingFieldData = {};
        var orderingFieldData = {};

        searchingFieldData[searchingField] = searchingRegexp;
        orderingFieldData[searchingField] = sortingOrder == 'ASC' ? '1' : '-1';

        return entityModel
            .find()
            .or([ searchingFieldData ])
            .sort(orderingFieldData)
            .exec(function (error, data) {
                return response.json(JSON.stringify(data));
            }
        );
    }
}
