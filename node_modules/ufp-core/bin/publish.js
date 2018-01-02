#!/usr/bin/env node
/*

 info:

 this is a utility skript to call the (logged in) npm publish script with '-tag beta' to provide the
 mechanics for automatically publishing beta versions to npm repository through git repository tags

 the rule is heuristically simple:

 - make it a beta version if it has a version extension

 x.x.x-whatever


 */

const child_process = require('child_process')
const package = require(process.cwd() + '/package.json')

console.log('This script determines wether a beta version or an untagged production release to npm shall be done...')
console.log()
console.log('module is', package.name)
console.log('version is', package.version)



// modified from https://github.com/sindresorhus/semver-regex/blob/master/index.js
// regexp for ommiting v beginning and capture group for tags
const semverRegexp = /\b(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(([\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?))\b/

const match = semverRegexp.exec( '0.4.6-rc1')
if (match) {

    if (match[1] === undefined) {
        console.error('publishing production release', match[0])

        const res= child_process.execSync(__dirname + '/npm_publish.sh  ')
        console.log('result is 'res.toString());

    } else {
        console.error('beta version is', match[1])
        const res= child_process.execSync(__dirname + '/npm_publish.sh --tag beta')

        console.log('result is 'res.toString());
    }
    // execute publish script with the login credentials

} else {
    console.error('No Valid Version inside package.json', package.version)
}

console.log('finished with npm publish')
process.exit(0)