"use strict";
exports.__esModule = true;
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
function devSettings(config) {
    config.devServer = {
        hot: true,
        hotOnly: true
    };
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
}
function prodSettings(config, analyze) {
    config.plugins.push(new CleanWebpackPlugin(['dist']), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.IgnorePlugin(/^\.\/languages/, /numbro$/), new ExtractTextPlugin('[name].[hash].css'), new OptimizeCssAssetsPlugin());
    config.optimization = {
        splitChunks: {
            chunks: 'all'
        }
    };
    if (analyze) {
        config.plugins.push(new webpack_bundle_analyzer_1.BundleAnalyzerPlugin());
    }
}
exports["default"] = (function (env, argv) {
    var config = {
        entry: {
            app: './src/app.ts'
        },
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }, {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        extractCSS: argv.mode === 'production',
                        loaders: {
                            i18n: '@kazupon/vue-i18n-loader'
                        }
                    }
                }, {
                    test: /\.scss$/,
                    loaders: ['style-loader', 'css-loader', 'sass-loader']
                }, {
                    test: /\.(ttf|woff|woff2|eot|svg)$/,
                    loader: 'file-loader'
                }]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.vue', '.js']
        },
        output: {
            filename: '[name].[hash].bundle.js'
        },
        plugins: [
            new webpack.DefinePlugin({
                WEBPACK_BUILD_DATE: JSON.stringify(new Date().toISOString())
            }),
            new ForkTsCheckerWebpackPlugin({
                tslint: true,
                async: false,
                vue: true
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'index.html',
                inject: true
            }),
            new CopyWebpackPlugin(['favicon.ico']),
            new webpack.ProvidePlugin({
                introJs: ['intro.js', 'introJs']
            })
        ]
    };
    argv.mode === 'development'
        ? devSettings(config)
        : prodSettings(config, argv.analyze);
    return config;
});
