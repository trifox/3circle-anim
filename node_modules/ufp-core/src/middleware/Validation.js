import UFPRequestActions from './UfpRequestActions'
import PropTypes from 'prop-types'
import UfpMiddlewareUtils from './UfpMiddlewareUtils'
import UfpMiddlewareConstants from './UfpMiddlewareConstants'

const UFPTypes = PropTypes.shape({
    END: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    FAILURE: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    REQUEST: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    SUCCESS: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired
}).isRequired
const UFPActionPropTypes = {
    [UFPRequestActions.UFP_REQUEST_ACTION]: PropTypes.shape({
        ufpDefinition: PropTypes.shape({
            url: PropTypes.string.isRequired,
            method: PropTypes.oneOf([
                UfpMiddlewareConstants.RequestMethodConstants.GET,
                UfpMiddlewareConstants.RequestMethodConstants.POST,
                UfpMiddlewareConstants.RequestMethodConstants.DELETE,
                UfpMiddlewareConstants.RequestMethodConstants.PATCH,
                UfpMiddlewareConstants.RequestMethodConstants.PUT]).isRequired,
            requestType: PropTypes.string,
            actionConstants: PropTypes.object
        }).isRequired,
        ufpData: PropTypes.shape({
            urlParams: PropTypes.object,
            queryParams: PropTypes.object,
            body: PropTypes.any
        }).isRequired,
        ufpTypes: PropTypes.object,
        ufpPayload: PropTypes.object,
        // ufpActionCreators: PropTypes.object,
        ufpResultHandler: PropTypes.arrayOf(PropTypes.shape({
            matcher: PropTypes.func.isRequired,
            handler: PropTypes.func.isRequired
        })).isRequired,
        ufpPreHandler: PropTypes.arrayOf(PropTypes.shape({
            matcher: PropTypes.func.isRequired,
            handler: PropTypes.func.isRequired
        })).isRequired
    })
}
const UFPTypesPropTypes = {
    [UFPRequestActions.UFP_REQUEST_ACTION]: PropTypes.oneOfType([PropTypes.shape({
        ufpTypes: UFPTypes
    }), PropTypes.shape({
        ufpDefinition: PropTypes.shape(
            {
                actionConstants: UFPTypes
            })
    })])
}

export const isUFPAction = (action) => {
    return typeof action === 'object' && action.hasOwnProperty(UFPRequestActions.UFP_REQUEST_ACTION)
}

/**
 * Checks an action against the RSAA definition, returning a (possibly empty)
 * array of validation errors.
 *
 * @function validateRSAA
 * @access public
 * @param {object} action - The action to check against the RSAA definition
 * @returns {array}
 */
export const validateUFPAction = (action) => {
    try {
        UfpMiddlewareUtils.ReactPropTypesCheck(action, UFPActionPropTypes, true)
    }
    catch (e) {
        //  console.error('Validation returned check ', action)
        //  console.error('Validation returned check ', action[UfpRequestActions.UFP_REQUEST_ACTION])
        //  console.error('Validation returned check ', action[UfpRequestActions.UFP_REQUEST_ACTION]['ufpTypes'])
        // console.error('Validation returned ', e)
        //  console.error('--->' + e + '<--')
        return [e]
    }
    try {
        UfpMiddlewareUtils.ReactPropTypesCheck(action, UFPTypesPropTypes, true)
    }
    catch (e) {
        //console.error('Validation returned check ', e.message)
        var err = new Error('Failed prop type: The prop `UFPREQUESTACTION.ufpTypes` or ' +
            '`UFPREQUESTACTION.ufpDefinition.actionConstants` need to be defined')
        return [err]
    }
    return []
}

export default {
    isUFPAction,
    validateUFPAction
}
