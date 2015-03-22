'use strict';

module.exports = function (config) {
    config.set({

        basePath: '../build/development',

        files: [
            {pattern: 'vendor/js/*.js', included: false},
            {pattern: 'components/**/*.js', included: false},
            {pattern: '*.html', included: false},
            {pattern: '**/*.html', included: false},
            {pattern: '**/*.unit.spec.js', included: false},
            './test-config.js'
        ],

        autoWatch: true,

        port: 9001,

        preprocessors: {
            '!(vendor)/**/*.js': ['coverage']
        },

        frameworks: ['jasmine', 'requirejs'],

        browsers: [
            'PhantomJS'
        ],

        exclude: [
            'config.js',
            'boot.js'
        ],

        plugins: [
            'karma-firefox-launcher',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-requirejs',
            'karma-coverage'
        ],

        reporters: ['progress', 'coverage', 'junit'],

        singleRun: false,

        colors: true,

        logLevel: config.LOG_INFO,

        junitReporter : {
            outputFile: './test-coverage/test-results.xml',
            suite: 'unit'
        },

        coverageReporter: {
            type: 'html',
            dir: './test-coverage/'
        }

    });
};
