/* eslint filenames/match-exported: 0 */
const express = require('express')
const path = require('path')
var UFP = require('..//lib/ufp')
const logger = require('../lib/Logger2')('ufp-server')

const webpack = require('webpack')

const webpackConfig = UFP.requireDefault(
    path.join(process.cwd(), '/config/webpack.config'),
    path.join(__dirname, '/../../presets/default/config/webpack.config.js')
)
const project = UFP.requireDefault(
    path.join(process.cwd(), '/project.config'),
    path.join(__dirname, '/../../presets/default/project.config.js')
)

const compress = require('compression')

const main = express()
main.use(compress())

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
    const compiler = webpack(webpackConfig)

    logger.info('Enabling webpack development and HMR middleware')
    main.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: path.resolve(project.basePath, project.srcDir),
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: false,
        stats: 'normal'
    }))
    main.use(require('webpack-hot-middleware')(compiler, {
        path: '/__webpack_hmr'
    }))

    // Serve static assets from ~/public since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    main.use(express.static(path.resolve(project.basePath, 'public')))

    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests). If you want to implement universal
    // rendering, you'll want to remove this middleware.
    main.use('*', function (req, res, next) {
        const filename = path.join(compiler.outputPath, 'index.html')
        compiler.outputFileSystem.readFile(filename, (err, result) => {
            if (err) {
                return next(err)
            }
            res.set('content-type', 'text/html')
            res.send(result)
            res.end()
        })
    })
} else {
    logger.warn(
        'main is being run outside of live development mode, meaning it will ' +
        'only serve the compiled application bundle in ~/dist. Generally you ' +
        'do not need an application main for this and can instead use a web ' +
        'main such as nginx to serve your static files. See the "deployment" ' +
        'section in the README for more information on deployment strategies.'
    )

    // Serving ~/dist by default. Ideally these files should be served by
    // the web main and not the app main, but this helps to demo the
    // main in production.
    main.use(express.static(path.resolve(project.basePath, project.outDir)))
}

module.exports = main
