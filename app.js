/**
 * Module dependencies.
 */

var env_dev = 'Development';
var env_prod = 'Production';

var node_env = process.env.NODE_ENV || env_dev;
var node_user_id = process.env.NODE_USER_ID || null;

var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var port = 3000;

// Init mongoose
mongoose.connect('mongodb://admin:admin@ds047504.mongolab.com:47504/sandbox');

// Configuration
app.configure(function () {
    app.locals.basedir = __dirname;

    app.set('views', __dirname + '/angular-spa-ui');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: true
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/angular-spa-ui'));

    app.locals.basedir = path.join(app.get('views'));

    app.envSettings = {
        environmentType: node_env,
        user: node_user_id
    };
});

app.configure('development', function () {
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

// Load entities
var Article = require('./rest-modules/article/')(app, mongoose);
var Publication = require('./rest-modules/publication/')(app, mongoose);
var User = require('./rest-modules/user/')(app, mongoose);
var Role = require('./rest-modules/role/')(app, mongoose);
var Index = require('./rest-modules/index/')(app);
var Admin = require('./rest-modules/admin/')(app);
