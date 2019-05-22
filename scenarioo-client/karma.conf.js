/* scenarioo-client
 * Copyright (C) 2014, scenarioo.org Development Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var webpackConfig = require('./configs/webpack.config.test');

module.exports = function (config) {

    config.set({
        frameworks: ['jasmine'],

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // list of files / patterns to load in the browser
        files: [
            'node_modules/babel-polyfill/browser.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'app/app.ts',
            'test/mock/**/*.ts',
            'test/spec/**/*.ts',
        ],

        preprocessors: {
            'node_modules/angular/angular.js': ['webpack'],
            'node_modules/angular-mocks/angular-mocks.js': ['webpack'],
            'app/*.ts': ['webpack'],
            'app/!(components)/**/*.ts': ['webpack'],
            'test/mock/**/*.ts': ['webpack'],
            'test/spec/**/*.ts': ['webpack']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            noInfo: true,
            // and use stats to turn off verbose output
            stats: {
                chunks: false
            }
        },

        plugins: [
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-webpack'
        ],


        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress', 'junit'],

        // web server port
        port: 7070,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeHeadless
        browsers: ['ChromeHeadless'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 20000,
        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 60000, //by default 10000


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // This tells the Karma server to serve the .ts files with a text/x-typescript mime type.
        // It's required to make .ts files work in unit tests.
        mime: {
            'text/x-typescript': ['ts']
        }
    });

};

