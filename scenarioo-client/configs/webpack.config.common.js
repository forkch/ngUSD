const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackCommonConfig = {

    entry: {
        polyfills: './app/polyfills.ts',
        app: './app/app.ts'
    },

    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },

    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            "@angular/upgrade/static": "@angular/upgrade/bundles/upgrade-static.umd.js"
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: '/node_modules'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                    }
                }
            },
            {
                test: /\.(jpg|jpeg|gif|png|ico)$/,
                include: /images/,
                loader: 'file-loader?name=/images/[name].[ext]'
            },
            {
                test: /\.html$/,
                loader: "raw-loader",
                exclude: '/node_modules'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                exclude: '/node_modules'
            },
            {
                test: /\.less/,
                loader: "style-loader!css-loader!less-loader",
                exclude: '/node_modules'
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/i,
                loader: "file-loader?name=fonts/[name]-[hash].[ext]"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&minetype=image/svg+xml"
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        new CopyWebpackPlugin([{
            from: './app/images', to: 'images'
        }]),
        // Fixes Critical dependency: the request of a dependency is an expression
        // https://github.com/angular/angular/issues/20357
        new webpack.ContextReplacementPlugin(/@angular([\\/])core([\\/])fesm5/, path.join(__dirname, './src')),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills']
        }),
    ]
};

module.exports = webpackCommonConfig;
