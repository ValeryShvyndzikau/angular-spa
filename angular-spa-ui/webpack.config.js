var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var ENV_DEV = process.env.NODE_ENV === 'Development';

module.exports = {
    context: __dirname,
    entry: {
        common: [
            './js/ui-core/common.js'
        ],
        vendor: [
            'angular',
            'angular-ui-router',
            'underscore'
        ],
        admin: './js/admin-app/admin-app.js',
        search: './js/search-app/search-app.js',
        common: './js/ui-core/index.js',
        vendors: [ 'angular', 'angular-ui-router', 'underscore' ]
    },
    output: {
        path: __dirname + '/build/scripts/',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract("css!sass")
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'underscore'
        }),
        new CommonsChunkPlugin('vendor', 'vendor.js'),
        new ExtractTextPlugin('../styles/styles.css', {
            allChunks: true
        })
    ],
    watch: ENV_DEV,
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: (ENV_DEV ? 'source-map' : null)
};

if (!ENV_DEV) {
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}
