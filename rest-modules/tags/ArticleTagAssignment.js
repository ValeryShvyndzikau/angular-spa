module.exports = function (app, mongoose) {

    var ArticleTagAssignment = mongoose.Schema({
        tagId: {
            type: String,
            mandatory: true
        },
        articleId: {
            type: String,
            mandatory: true
        }
    });

    return mongoose.model('ArticleTagAssignment', ArticleTagAssignment);
}
