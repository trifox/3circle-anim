const path = require('path')
var fs = require('fs')
const port=3000
const express = require('express')
var expressStaticGzip = require('express-static-gzip')
const childProcess = require('child_process')

const serveDir = path.join(process.cwd(), 'dist')
const theServer = () => {
    const app = express()
    // serve the folder using
    app.use('/', expressStaticGzip(serveDir))
    app.listen(port, function () {
        console.log(`UFP App listening on port ${port}`)
        console.log('serving: ', path.resolve(serveDir))
    })
}

if (fs.existsSync(serveDir)) {
    theServer()
} else {
    console.log(serveDir, 'not found')
    console.log('Execute "npm run ufp-make" to create a dist build ')
    childProcess.execSync('npm run ufp-make', {
        cwd: process.cwd(),
        stdio: 'pipe'
    })
    theServer()
}
