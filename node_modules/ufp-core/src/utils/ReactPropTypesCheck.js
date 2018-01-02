/**
 * @param {Object} object to be validated
 * @param {Object} propTypes object with defined prop types
 * @param {Boolean} _throw if set to true, invalid prop types will throw
 */
'use strict'
import checkPropTypes from 'check-prop-types'
import JsUtils from './JSUtils'

export const ReactPropTypesCheck = (object, propTypes, _throw) => {
    console.warn('ReactPropTypesCheck is deprecated use CheckPropTypes() ')
    var propName

    for (propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
            var error = checkPropTypes(propTypes, object, 'prop', 'UfpPropTypesCheck')
            if (error) {
                if (_throw) {
                    throw error
                } else {
                    console.error(error.message)
                }
            }
        }
    }
}

/**
 * Executes the ReactPropType for an object,
 * @param object the object to check
 * @param propTypes react proptypes definition
 * @param name the name of the object (for message
 * @param doThrow if true method throws if false method returns true/false
 * @returns {boolean}
 * @constructor
 */
export const CheckPropTypes = ({
    object = JsUtils.ThrowParam('object parameter has to be set'),
    propTypes = JsUtils.ThrowParam('propTypes parameter has to be set'),
    name = 'Object',
    doThrow = false
}) => {
    var propName

    for (propName in propTypes) {
        if (propTypes.hasOwnProperty(propName)) {
            var error = checkPropTypes(propTypes, object, 'prop', name)
            if (error) {
                if (doThrow) {
                    throw error
                } else {
                    console.error(error.message)
                    return false
                }
            }
        }
    }
    return true
}

export default {
    ReactPropTypesCheck,
    CheckPropTypes
}
