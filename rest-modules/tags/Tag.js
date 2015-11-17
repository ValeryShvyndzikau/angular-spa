module.exports = function (app, mongoose) {

    var Tag = mongoose.Schema({
        name: {
            type: String,
            mandatory: true
        },
        textColor: {
            type: String,
            mandatory: false,
            default: '#000'
        },
        backgroundColor: {
            type: String,
            mandatory: false,
            default: '#EEE'
        },
        glyph: {
            type: String,
            mandatory: false,
            default: 'none'
        },
        published: {
            type: Boolean,
            mandatory: false,
            default: true
        }
    });

    return mongoose.model('Tag', Tag);
}
