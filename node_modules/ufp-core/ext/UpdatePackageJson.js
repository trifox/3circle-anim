/**
 * warning: thesee are ufp-projectr scripts to be executed in project context, not
 * used for any ufp-core processes
 */

const exec = require('child_process').exec

const logger = require('./build/lib/Logger2')('update-package-json')

logger.info('Updating package.json from ufp-core')

const ls = exec('' +
//    'node node_modules/ufp-core/ext/UpdatePackageJsonDependencies && ' +
    'node node_modules/ufp-core/ext/UpdatePackageJsonScripts')

ls.stdout.on('data', (data) => {
    console.log(`${data}`)
})

ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
})

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
})
