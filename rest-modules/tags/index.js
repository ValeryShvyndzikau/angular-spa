module.exports = function (app, mongoose, api) {

    var api = api;
    var model = require('./Tag.js')(app, mongoose);
    var articleModel = api.getRESTModule('article').getModel();

    if (articleModel == undefined) {
        console.log('Could not to init tags/index.js module! Something bad with article/index.js module, it already MUST be preloaded!');
        return;
    }

    var articleTagAssignmentModel = require('./ArticleTagAssignment.js')(app, mongoose);

    // Routes list
    // -----------
    app.get('/service/tags', getTagsRequest);

    app.get('/service/tag/get-by-id/:tagId', getTagByIdRequest);

    app.get('/service/tag/get-by-name/:tagName', getTagByNameRequest);

    app.get('/service/tag/get-by-article/:articleId', getTagByArticleIdRequest);

    app.put('/service/tag/create', createTagRequest);

    app.delete('/service/tag/delete/:tagId', deleteTagRequest);

    app.get('/service/tag/autocomplete/:arg', autocompleteTagRequest);

    // NodeJS.Express bug using HTTP.PUT with dynamical arguments...
    app.get('/service/assign-article-tag/:articleId/:tagId', assignArticleTagRequest);

    app.delete('/service/remove-article-tag/:articleId/:tagId', removeArticleTagRequest);

    app.delete('/service/remove-article-tags/:articleId', removeArticleTagsRequest);

    app.get('/service/tags/generate/:number', generateTagsRequest);

    // Routes implementation
    // ---------------------
    function getTagsRequest(request, response) {
        var operationName = 'list tags';

        return model.find(function (error, data) {
            if (!error) {
                return response.send(api.generateResponseObject(operationName, 'ok', null, data));
            }

            return response.send(api.generateResponseObject(operationName, 'error', error));
        });
    };

    function getTagByIdRequest(request, response) {
        var operationName = 'get tag by id';
        var id = request.params.tagId;

        return model.findById(id, function (error, data) {
            if (!error) {
                return response.send(api.generateResponseObject(operationName, 'ok', null, data));
            }

            return response.send(api.generateResponseObject(operationName, 'error', error));
        });
    };

    function getTagByNameRequest(request, response) {
        var operationName = 'get tag by name';
        var tagName = request.params.tagName;

        return model.findOne({ name: tagName }, function (error, data) {
            if (!error) {
                return response.send(api.generateResponseObject(operationName, 'ok', null, data));
            }

            return response.send(api.generateResponseObject(operationName, 'error', error));
        });
    };

    function getTagByArticleIdRequest(request, response) {
        var operationName = 'get tag by article id';
        var articleId = request.params.articleId;

        return articleTagAssignmentModel.findOne({ articleId: articleId }, function (error, data) {
            if (!error) {
                return response.send(api.generateResponseObject(operationName, 'ok', null, data));
            }

            return response.send(api.generateResponseObject(operationName, 'error', error));
        });
    };

    function createTagRequest(request, response) {
        var operationName = 'create tag';
        var tagName = request.body.hasOwnProperty('name') ? request.body.name : null;

        if (tagName == null) {
            return response.send(api.generateResponseObject(operationName, 'error', 'Tag with name ' + tagName + ' already exists, please pick another name'));
        }

        var tagFields = {
            name: tagName
        };

        tagFields.textColor = api.getRequestBodyFieldValue(request.body, 'textColor', '#000');
        tagFields.backgroundColor = api.getRequestBodyFieldValue(request.body, 'backgroundColor', '#EEE');
        tagFields.glyph = api.getRequestBodyFieldValue(request.body, 'glyph', 'none');
        tagFields.published = api.getRequestBodyFieldValue(request.body, 'published', true);

        var tag = new model(tagFields);

        tag.save(function (error) {
            if (!error) {
                return response.send(api.generateResponseObject(operationName, 'ok', null, tag));
            }

            return response.send(api.generateResponseObject(operationName, 'error', error));
        });
    };

    function deleteTagRequest(request, response) {
        var operationName = 'delete tag';
        var tagId = request.params.tagId;

        return model.findById(tagId, function (error, data) {
            if (error) {
                return response.send(api.generateResponseObject(operationName, 'error', error));
            }

            if (data != null) {
                return data.remove(function (error) {
                    if (!error) {
                        return response.send(api.generateResponseObject(operationName, 'ok', null));
                    }
                });
            }

            return response.send(api.generateResponseObject(operationName, 'error', error));
        });
    };

    function autocompleteTagRequest(request, response) {
        var searchQuery = request.params.arg.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        var searchRegEx = new RegExp('^' + searchQuery, 'i');

        return model.find().or([ { name: searchRegEx } ]).sort('name').exec(function (error, data) {
            response.json(JSON.stringify(data));
        });
    }

    function assignArticleTagRequest(request, response) {
        var operationName = 'article tag assignment';
        var articleId = request.params.articleId;
        var tagId = request.params.tagId;

        return articleTagAssignmentModel.findOne({
            articleId: articleId,
            tagId: tagId
        }, function (error, data) {
            if (!error && data != null) {

                return response.send(api.generateResponseObject(operationName, 'error', 'Relation between article=' + articleId + ' and tag=' + tagId + ' already exists'));
            }

            var tag = model.findById(tagId, function (error, data) {
                if (!error) {
                    return data;
                }

                api.generateResponseObject(operationName, 'error', error);
                return null;
            });

            var article = articleModel.findById(articleId, function (error, data) {
                if (!error) {
                    return data;
                }

                api.generateResponseObject(operationName, 'error', error);
                return null;
            })

            var articleTagAssignment = new articleTagAssignmentModel({
                tagId: tagId,
                articleId: articleId
            });

            articleTagAssignment.save(function (error) {
                if (!error) {
                    return response.send(api.generateResponseObject(operationName, 'ok', null, articleTagAssignment));
                }

                return response.send(api.generateResponseObject(operationName, 'error', error));
            });
        });
    };

    function removeArticleTagRequest(request, response) {
        var operationName = 'article tag unassignment';
        var articleId = request.params.articleId;
        var tagId = request.params.tagId;

        return articleTagAssignmentModel.findOne({
            articleId: articleId,
            tagId: tagId
        }, function (error, data) {
            if (error) {
                return response.send(api.generateResponseObject(operationName, 'error', error));
            }

            return data.remove(function (error) {
                if (!error) {
                    return response.send(api.generateResponseObject(operationName, 'ok', null, data));
                }

                return response.send(api.generateResponseObject(operationName, 'error', error));
            });
        });
    };

    function removeArticleTagsRequest(request, response) {
        var operationName = 'article tags unassignment';
        var articleId = request.params.articleId;

        return articleTagAssignmentModel.find({ articleId: articleId }, function (error, data) {
            var assignmentsRemoved = 0;

            if (error) {
                return response.send(api.generateResponseObject(operationName, 'error', error));
            }

            for (var i = 0; i < data.length; i++) {
                var articleTagAssignment = articleTagAssignmentModel.findById(data[i]._id, function(error, assignmentData) {
                    if (error) {
                        return response.send(api.generateResponseObject(operationName, 'error', error));
                    }

                    assignmentData.remove(function (error) {
                        if (error) {
                            return response.send(api.generateResponseObject(operationName, 'error', error, assignmentData));
                        }
                    });
                });

                if (articleTagAssignment) {
                    assignmentsRemoved++;
                }
            }

            return response.send(
                api.generateResponseObject(
                    operationName,
                    assignmentsRemoved > 0 ? 'ok' : 'error',
                    assignmentsRemoved > 0 ? null : 'No records has been removed',
                    data
                )
            );
        });
    }

    function generateTagsRequest(request, response) {
        var numberOfTags = parseInt(request.params.number);
        var tagsCreated = 0;

        if (numberOfTags < 0) {
            numberOfTags = 1;
        }
        else if (numberOfTags > 50) {
            numberOfTags = 50;
        }

        for (var i = 0; i < numberOfTags; i++) {
            var tag = generateRandomTag();

            if (isTagNameExists(tag.name)) {
                numberOfTags++;
                continue;
            }

            tag.save(function (error) {
                if (error) {
                    console.log('The tag could not be saved');
                }
            });

            if (tag._id != undefined) {
                tagsCreated++;
            }
        }

        return response.send(api.generateResponseObject(
            'create random tag',
            tagsCreated > 0 ? 'ok' : 'error',
            tagsCreated > 0 ? null : 'No tags has been created',
            {
                tagsCreated: tagsCreated
            })
        );
    };

    // Helper functions
    // ----------------
    function getModel() {
        return model;
    }

    function getArticleTagAssignmentModel() {
        return articleTagAssignmentModel;
    }

    function generateRandomTag() {
        var tag = new model({
            name: 'Random tag [' + Math.floor(Math.random() * 100000) + ']',
            textColor: '#0' + Math.floor((Math.random() + 1) * 10),
            backgroundColor: '#E' + Math.floor((Math.random() + 1) * 4) + '' + Math.floor((Math.random() + 1) * 4),
            glyph: 'none',
            published: true
        });

        return tag;
    }

    function isTagNameExists(tagName) {
        model.findOne({
            name: tagName
        }, function (error, data) {
            if (!error) {
                return data;
            }

            return null;
        });

        return null;
    }

    return {
        getModel: getModel,
        getArticleTagAssignmentModel: getArticleTagAssignmentModel,
        generateRandomTag: generateRandomTag,
        isTagNameExists: isTagNameExists
    };
}
