import merge from 'deepmerge'
import {ReactPropTypesCheck} from '../utils/ReactPropTypesCheck'
// console.log('xxxxxxxxxxxxxxxxxxxxxxxxxx', ReactPropTypesCheck)

function PropTypesCheck(data, propTypes) {
    try {
        ReactPropTypesCheck(data, propTypes, true)
        return true
    } catch (e) {
        // console.error('Validation error', e)
        return false
    }
}
/**
 * Extract JSON body from a server response made with fetch
 *
 * @function getJSON
 * @access public
 * @param {object} res - A raw response object
 * @returns {promise|undefined}
 */
export const getJSON = async(res) => {
    const contentType = res.headers.get('Content-Type')
    const emptyCodes = [204, 205]

    if (!~emptyCodes.indexOf(res.status) && contentType && ~contentType.indexOf('json')) {
        return res.json()
    } else {
        return Promise.resolve({})
    }
}

function isEmptyObject(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false
        }
    }
    return JSON.stringify(obj) === JSON.stringify({})
}

function errorToObject(err) {
    if (!(err instanceof Error)) {
        throw new TypeError('invalid input argument. Must provide an error object. Value: `' + err + '`.')
    }
    var keys
    var out = {}
    out.errorToObject = true
    out.message = err.message
    if (err.stack) {
        out.stack = err.stack
    }
    // Possible Node.js (system error) properties...
    if (err.code) {
        out.code = err.code
    }
    // Any enumerable properties...
    keys = Object.keys(err)
    for (var i = 0; i < keys.length; i++) {
        if (err[keys[i]] instanceof Response) {
            out[keys[i]] = err[keys[i]]
        } else {
            out[keys[i]] = JSON.parse(JSON.stringify(err[keys[i]]))
        }
    }
    return out
}

function validateStatus(status) {
    return status >= 200 && status < 300
}

const mergeArrayOfObjects = (arr, selector = (t) => t) => {
    return arr.reduce((acc, curr) => {
        return merge(acc, selector(curr) || {})
    }, {})
}
const createAxiosLikeErrorResponse = async(config, code, response) => {
    var err = new Error('Request failed with status code ' + response.status)
    err.config = config
    if (code) {
        err.code = code
    }
    err.response = response
    err.response.data = await getJSON(response)
    return err
}

const addToArrayIfNotExist = (arr, item) => {
    if (arr.indexOf(item) === -1) {
        arr.push(item)
    }
}

const createConfigDefault = (config) => {
    config.headers = {
        'Content-Type': 'application/json'
    }
    return config
}

function infoLogger() {
    // console.log.apply(console, arguments)
}

export default {
    ReactPropTypesCheck,
    PropTypesCheck,
    getJSON,
    isEmptyObject,
    errorToObject,
    validateStatus,
    mergeArrayOfObjects,
    createAxiosLikeErrorResponse,
    addToArrayIfNotExist,
    createConfigDefault,
    infoLogger
}
