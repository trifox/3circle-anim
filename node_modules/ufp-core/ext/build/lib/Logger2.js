// var log4js = require('log4js')
// const Constants = require('../scripts/constants')

/**
 * use constants for defined log level option in yargs, set log level as global default
 */

//const yargs = require('yargs').option('LOG_LEVEL', Constants.MAKE_OPTIONS.LOG_LEVEL)

module.exports = (area) => {
//    const logger = log4js.getLogger(area)
    // const loggerlevel = yargs.argv.LOG_LEVEL.toLowerCase()
    return {

        trace: (...rest) => {
            console.log('trace', area, rest)
        },
        log: (...rest) => {
            console.log('log', area, rest)
        },
        warn: (...rest) => {
            console.warn('warn', area, rest)
        },
        debug: (...rest) => {
            console.log('debug', area, rest)
        },
        info: (...rest) => {
            console.log('info', area, rest)
        },
        error: (...rest) => {
            console.error('error', area, rest)
        },
        mark: (...rest) => {
            console.log('mark', area, rest)
        },
        success: (...rest) => {
            console.error('success', area, rest)
        },
        fatal: (...rest) => {
            console.error('fatal', area, rest)
        }

    }
}
