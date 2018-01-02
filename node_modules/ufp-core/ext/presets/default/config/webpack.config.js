/* eslint filenames/match-exported: 0 */

const path = require('path')
const fs = require('fs')
// const glob = require('glob')
var UFP = require('../../../build/lib/ufp')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const projectDefault = require(path.join(__dirname, '/../project.config.js'))

const projectConfig = UFP.requireDefault(
    path.join(process.cwd(), '/project.config.js'),
    path.join(__dirname, '/../project.config.js')
)

const project = Object.assign({}, projectDefault, projectConfig)
const StatsPlugin = require('stats-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const VisualizerPlugin = require('webpack-visualizer-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
// const PurifyCSSPlugin = require('purifycss-webpack')
// const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
const DuplicatePackageCheckerWebpackPlugin = require('duplicate-package-checker-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
// const ClosureCompilerPlugin = require('webpack-closure-compiler')

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = (file) => inProject(project.srcDir, file)

const __DEV__ = project.env === 'development'
const __TEST__ = project.env === 'test'
const __PROD__ = project.env === 'production'

// console.log('Project IS ', project)
// console.log('ENVIRONMENT IS ', process.env.UFP_VERSION)
process.traceDeprecation = true
const UfpConfig = {

    UFP_VERSION: process.env.UFP_VERSION || '0.0.0',
    UFP_API_TYPE: process.env.UFP_API_TYPE || 'live',
    UFP_THEME: process.env.UFP_THEME || 'defaultTheme',
    UFP_NODE_ENV: project.env
}

const config = {
    context: path.join(project.basePath),
    entry: {
        main: [
            inProjectSrc(project.main)
        ]
    },

    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true,
        // Examine all modules
        // maxModules: 'Infinity',
        // Display bailout reasons
        optimizationBailout: true
    },
    devtool: project.sourcemaps ? 'source-map' : 'source-map',
    output: {
        path: inProject(project.outDir),
        filename: __DEV__ ? path.join(project.chunkFolder, '[name].js') :
            path.join(project.chunkFolder, 'js/[name].[chunkhash].js'),
        publicPath: project.publicPath
    },
    resolve: {
        // enforce no-symlinking for module resolving, required when using modules from filesystem (e.g. ufp-core)
        symlinks: false,
        'alias': {
            // // preact setup
            // 'react': 'preact-compat',
            // 'react-dom': 'preact-compat',
            // // required preact adjustment for react-router3
            // 'create-react-class': 'preact-compat/lib/create-react-class'
        },

        modules: [
            inProject(project.srcDir),
            inProject('node_modules')
        ],
        extensions: ['*', '.js', '.jsx', '.json']
    },
    externals: project.externals,
    module: {
        rules: []
    },
    plugins: [
        // CopyWebpackPlugin([
        //     {
        //         from: 'src/static',
        //         to: ''
        //     }]),
        new webpack.DefinePlugin(Object.assign({
            'process.env': {
                NODE_ENV: JSON.stringify(project.env)
            },
            __DEV__,
            __TEST__,
            __PROD__
        }, project.globals))
    ]
}
// console.log('Config is ', config)
/**
 * start of ufp static folders copywebpackplugin config
 */
    // static file copy presets, this is ufp configuration default
const folders = [

        {
            /**
             * the src static is copied to root of project, used to create main
             * folders accesible in production
             *
             * please note that /res is taken from project root whereas /src/static is taken
             * from project src
             */
            from: path.join(project.srcDir, 'static'),
            to: ''
        },
        {
            /**
             * the res default folder is exported 'as is' to the subfolder /res in production
             *
             * please note that /res is taken from project root whereas /src/static is taken
             * from project src
             */
            from: 'res',
            to: 'res'
        }
    ]
// console.info('FOLDER CONFIG IS ', folders)
// and create copy plugin entries if folders exist in project structure
folders.map((folderData) => {
        if (fs.existsSync(path.join(process.cwd(), folderData.from))) {
            config.plugins.push(
                CopyWebpackPlugin([
                    {
                        from: folderData.from,
                        to: folderData.to
                    }], {debug: 'debug'})
            )
        }
    }
)
/**
 * end of ufp static folders copywebpackplugin config
 */
    // JavaScript
    // ------------------------------------
const javascriptConfig = {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,

        use: [
            {
                loader: 'babel-loader',

                options: {
                    env: {
                        development: {
                            plugins: [['react-transform', {
                                transforms: [{
                                    transform: 'react-transform-hmr',
                                    imports: ['react'],
                                    locals: ['module']
                                }]
                            }]]
                        }
                    },
                    cacheDirectory: true,
                    plugins: [

                        'babel-plugin-transform-class-properties',
                        'babel-plugin-syntax-dynamic-import',
                        //  'transform-react-remove-prop-types',
                        'babel-plugin-transform-react-jsx',
                        [
                            'babel-plugin-transform-runtime',
                            {
                                helpers: false,
                                polyfill: false, // we polyfill needed features in src/normalize.js
                                regenerator: false
                            }
                        ],
                        [
                            'babel-plugin-transform-object-rest-spread',
                            {
                                useBuiltIns: false // we polyfill Object.assign in src/normalize.js
                            }
                        ]
                    ],
                    presets: [
                        // use this for es5 transpile target
                        ['es2015', {'modules': false}], ['react']

                        // modern way of declaring transpile targets
                        // ['babel-preset-env', {
                        //   modules: false,
                        //   targets: {
                        //     chrome: "60",
                        //   },
                        //   uglify: true,
                        //
                        // }],
                    ]
                }
            }

        ]
    }

// if (project.env !== 'test' && project.env !== 'development') {
//     /**
//      * disable linting for /test files
//      * todo: prepare lint config for tests
//      */
//     javascriptConfig.use.push({
//         loader: 'eslint-loader',
//         options: {
//             formatter: require('eslint/lib/formatters/codeframe'),
//             configFile: UFP.chooseExistingPath(inProject('.eslintrc'), path.join(__dirname, '../../../../src/.eslintrc'))
//         }
//     })
// }

javascriptConfig.use.push({
        loader: 'preprocess-loader',
        options: {
            NODE_ENV: project.env,

            ...UfpConfig
        }
    },
    {
        loader: 'preprocessor-loader',
        query: 'config=' + path.join(__dirname, '../macrodefinition-' + project.env + '.json')

    })

config.module.rules.push(javascriptConfig)
// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
    filename: path.join(project.chunkFolder, 'styles/[name].[contenthash].css'),
    allChunks: true
    // disable: __DEV__
})

config.module.rules.push({
    test: /\.(sass|scss|css)$/,
    loader: extractStyles.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: {
                    sourceMap: project.sourcemaps
                    //     minimize: {
                    //         autoprefixer: {
                    //             add: true,
                    //             remove: true,
                    //             browsers: ['last 5 versions']
                    //         },
                    //         discardComments: {
                    //             removeAll: true
                    //         },
                    //         discardUnused: false,
                    //         mergeIdents: false,
                    //         reduceIdents: false,
                    //         safe: true,
                    //         sourcemap: project.sourcemaps
                    //     }
                }
            },

            {
                loader: 'sass-loader',
                options: {
                    sourceMap: project.sourcemaps,
                    includePaths: [
                        inProjectSrc('styles')
                    ]
                }
            },

            {
                loader: 'preprocess-loader'

            }

        ]
    })
})
config.plugins.push(extractStyles)
config.plugins.push(new CaseSensitivePathsPlugin({debug: true}))

// Images
// ------------------------------------
config.module.rules.push({
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader',
    options: {
        name: path.join(project.chunkFolder, 'img/[name].[ext]'),
        limit: 8192
    }
})

// Fonts
// ------------------------------------
;
[
    ['woff', 'application/font-woff'],
    ['woff2', 'application/font-woff2'],
    ['otf', 'font/opentype'],
    ['ttf', 'application/octet-stream'],
    ['eot', 'application/vnd.ms-fontobject'],
    ['svg', 'image/svg+xml']
].forEach((font) => {
    const extension = font[0]
    const mimetype = font[1]

    config.module.rules.push({
        test: new RegExp(`\\.${extension}$`),
        loader: 'url-loader',
        options: {
            name: path.join(project.chunkFolder, 'fonts/[name].[ext]'),
            limit: 10000,
            mimetype
        }
    })
})

// HTML Template
// ------------------------------------
config.plugins.push(new HtmlWebpackPlugin({
    template: inProjectSrc('index.html'),
    inject: project.injectChunks,
    minify: {
        collapseWhitespace: true
    },
    ...UfpConfig

}))

// Development Tools
// ------------------------------------
if (__DEV__) {
    config.entry.main.push(
        `webpack-hot-middleware/client.js?path=${config.output.publicPath}__webpack_hmr`
    )
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    )
}

// Bundle Splitting
// ------------------------------------
if (!__TEST__) {
    const bundles = ['normalize', 'manifest']

    if (project.vendors && project.vendors.length) {
        bundles.unshift('vendor')
        config.entry.vendor = project.vendors
    }
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        names: bundles,
        filename: path.join(project.chunkFolder, 'manifest.js')
    }))
}

// ignoring/externalize modules
// config.plugins.push(new webpack.IgnorePlugin(/core-js/) )
config.plugins.push(new DuplicatePackageCheckerWebpackPlugin())
config.plugins.push(new CircularDependencyPlugin())
//
// config.plugins.push(new webpack.optimize.AggressiveSplittingPlugin())

// Production Optimizations
// ------------------------------------
if (__PROD__) {
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: true
        })
    )

    config.plugins.push(
        new webpack.optimize.ModuleConcatenationPlugin(),
        new StatsPlugin('stats.json', {
            chunkModules: true,
            exclude: [/node_modules[\\\/]react/]
        }),
        new VisualizerPlugin({
            filename: './stats.html'
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        })
        // new ZopfliPlugin({
        //   asset: "[path].gz[query]",
        //   algorithm: "zopfli",
        //   test: /\.(js|html)$/,
        //   threshold: 10240,
        //   minRatio: 0.8
        // }),
        // new PurifyCSSPlugin({
        //     // Give paths to parse for rules. These should be absolute!
        //     paths: glob.sync(path.join(__dirname, 'dist/*.html'))
        // })
    )

    // config.plugins.push(new SWPrecacheWebpackPlugin({
    //     cacheId: project.name,
    //     dontCacheBustUrlsMatching: /\.\w{8}\./,
    //     filename: 'service-worker.js',
    //     minify: true,
    //     navigateFallback: project.publicPath+ 'index.html',
    //     staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
    // }))

    // config.plugins.push(
    //     new BabelMinifyPlugin()
    // )
    config.plugins.push(new UglifyJsPlugin({
        sourceMap: project.sourcemaps,
        uglifyOptions: {
            mangle: true,
            compress: {
                passes: 3,
                warnings: false,
                drop_console: true,
                hoist_vars: true,
                hoist_funs: true,
                conditionals: true,
                unused: true,
                unsafe: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            }
        }
    }))
}
//
// config.plugins.push(function () {
//     this.plugin('done', function (stats) {
//         if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
//             console.log(stats.compilation.errors)
//             //  process.exit(1); // or throw new Error('webpack build failed.');
//         }
//         // ...
//     })
// })

//
// config.plugins.push(new ClosureCompilerPlugin({
//     compiler: {
//         //  jar: 'path/to/your/custom/compiler.jar' //optional
//         language_in: 'ECMASCRIPT6',
//         language_out: 'ECMASCRIPT5',
//         compilation_level: 'ADVANCED',
//         externs: [path.join(__dirname, './closure.externs.js')]
//     },
//     concurrency: 3,
// }))

console.log('<WEBPACK Config is')
console.log(config)
console.log('WEBPACK Config is>')

module.exports = config
