/* eslint filenames/match-exported: 0 */
const path = require('path')
const glob = require('glob')
const argv = require('yargs').argv
const webpackConfig = require('./webpack.config.js')

// const TEST_BUNDLER = './tests/test-bundler.js'
const TEST_BUNDLER = './tests/**/*.spec.js'

// console.log('testsContext ')
// console.log('testsContext ', process.cwd())
const karmaConfig = {
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 60000, //by default 10000
    basePath: process.cwd(),
    browsers: ['ChromeHeadless'],
    singleRun: !argv.watch,
    coverageReporter: {
        reporters: [
            {
                type: 'html',
                dir: 'test-report/coverage',
                subdir: 'html'
            },
            {
                type: 'text-summary',
                dir: 'test-report/coverage',
                subdir: 'coverage'
            },
            {
                type: 'clover',
                dir: 'test-report/coverage',
                subdir: 'clover'
            },
            {
                type: 'lcov',
                dir: 'test-report/coverage',
                subdir: 'lcov'
            }
        ]
    },
    files: [
        {
            pattern: path.resolve(__dirname, 'karma.setup.js'),
            watched: false,
            served: true,
            included: true
        },
        {
            pattern: TEST_BUNDLER,
            watched: false,
            served: true,
            included: true
        }],
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha', 'junit', 'coverage'],
    preprocessors: {
        [path.resolve(__dirname, 'karma.setup.js')]: ['webpack'],
        [TEST_BUNDLER]: ['webpack']
    },
    logLevel: 'DEBUG',
    browserConsoleLogOptions: {
        terminal: true,
        format: '%b %T: %m',
        level: ''
    },
    junitReporter: {
        outputDir: 'test-report', // results will be saved as $outputDir/$browserName.xml
        outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
        useBrowserName: false, // add browser name to report and classes names
        xmlVersion: null // use '1' if reporting to be per SonarQube 6.2 XML format
    },
    plugins: [
        'karma-chai',
        'karma-chrome-launcher',
        'karma-coverage',
        'karma-junit-reporter',
        'karma-mocha',
        'karma-mocha-reporter',
        'karma-requirejs',
        'karma-sinon',
        'karma-spec-reporter',
        'karma-webpack'
    ],
    webpack: {
        context: process.cwd(),
        entry: [...glob.sync(TEST_BUNDLER, {cwd: process.cwd()})],
        devtool: 'inline-source-map',
        module: webpackConfig.module,
        plugins: webpackConfig.plugins,
        resolve: webpackConfig.resolve,
        externals: {
            'browser': 'browser',
            'react/addons': 'react',
            'react/lib/ExecutionEnvironment': 'react',
            'react/lib/ReactContext': 'react'

        }
    },
    webpackMiddleware: {
        stats: 'errors-only',
        noInfo: true
    }
}

module.exports = (cfg) => cfg.set(karmaConfig)
