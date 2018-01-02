import UFPRequestActions from './UfpRequestActions'
import {isUFPAction, validateUFPAction} from './Validation'
import {InvalidUFPAction, UfpMiddlewareRequestCancelledError, UfpMiddlewareMaxRetryReachedError} from './Errors'
import UFPMiddlewareUtils from './UfpMiddlewareUtils'
import UFPMiddlewareConstants from './UfpMiddlewareConstants'
import UFPMiddlewareConfiguration from './UfpMiddlewareConfiguration'
// console.log('UfpMiddleware imported ')
function UfpMiddleware(options = {}) {
    return ({getState, dispatch}) => {
        return (next) => async(action) => {
            if (!isUFPAction(action)) {
                return next(action)
            }

            // console.log('UfpMiddleware Ufp Action Detected ', UFPMiddlewareConfiguration, action)
            const dispatchPromise = new Promise(async(resolve /*, reject */) => {
                /**
                 *  Do not process actions without a [UFP_ACTION] property
                 * Try to dispatch an error request FSA for invalid UFPAction's
                 */
                const validationErrors = validateUFPAction(action)

                if (validationErrors.length > 0) {
                    // console.log('UFP MIDDLEWARE validationErrors', validationErrors)
                    var validationErr = new InvalidUFPAction(validationErrors[0])
                    dispatch({
                        type: UFPMiddlewareConstants.ActionConstants.UFP_ACTION_ERROR,
                        payload: validationErr
                    })
                    resolve(validationErr)
                } else {
                    /**
                     * MEGA BLOCK TODO FIXME REFACTOR
                     *
                     * this block is the core middleware functionality rougly:
                     *
                     * - prehandling
                     * - executing
                     * - posthandling/parsing
                     * - finalisation
                     *
                     */

                        // Parse the validated UFP_REQUEST_ACTION action
                    const ufpAction = action[UFPRequestActions.UFP_REQUEST_ACTION]
                    const dispatchWrapper = UFPMiddlewareUtils.wrapDispatcher(dispatch /*, getState, ufpAction*/)
                    const {
                        ufpDefinition,
                        ufpPayload,
                        ufpData,
                        ufpResultHandler,
                        ufpPreHandler,
                        ufpTypes
                    } = ufpAction
                    const additionalPayload = {

                        // getState: getState,
                        // globalState: getState()
                    }
                    const thePayload = Object.assign({}, ufpPayload, additionalPayload)
                    // Object.assign({}, ufpDefinition.actionConstants || {}, ufpAction.ufpTypes || {})
                    // join together 2 action type definitions, one from action and one from definition,
                    // both definitions are handled as array
                    const ufpTypesUnited = UFPMiddlewareUtils.uniteActionResultTypes(ufpTypes, ufpDefinition.actionConstants)
                    const MAX_RETRY_COUNT = options.maxRetryCount || 5
                    var retry = true
                    var retryCount = 0
                    var makeRequest = true
                    var totalSuccess = true
                    var requestResponse = null
                    const resultContainerForPreHandler = {
                        ufpAction: {
                            wixi: 'buxi',
                            ufpData,
                            ufpDefinition,
                            ufpPayload: thePayload,
                            ufpResultHandler,
                            ufpPreHandler,
                            ufpTypes: ufpTypesUnited
                        },
                        ufpDefinition,
                        dispatch: dispatchWrapper,
                        dispatchOriginal: dispatch,
                        getState: getState,
                        globalState: getState()
                    }
                    var configPrepared = UFPMiddlewareUtils.ufpMiddlewarePrepareConfig(ufpAction)
                    // console.log('UfP types', ufpTypesUnited)
                    const allPreHandler = ([].concat(ufpPreHandler)).concat(
                        UFPMiddlewareConfiguration.get().preRequestHandling)
                    // console.log('ufpPreHandler', allPreHandler, resultContainerForPreHandler)
                    const preHandlerResult = await UFPMiddlewareUtils.handlePreHandlers(
                        allPreHandler, resultContainerForPreHandler)
                    // console.log('preHandlerResult ', preHandlerResult)
                    var validateResult
                    makeRequest = !preHandlerResult.break
                    if (makeRequest) {
                        var config
                        // console.log('UFPMiddleware executing: ', retryCount, ufpAction)
                        if (UFPMiddlewareConfiguration.get().createConfig === undefined ||
                            typeof UFPMiddlewareConfiguration.get().createConfig !== 'function') {
                            config = UFPMiddlewareUtils.createConfigDefault(configPrepared)
                        } else {
                            config = UFPMiddlewareConfiguration.get().createConfig(configPrepared, ufpAction, getState())
                        }

                        // console.log('UFP MIDDLEWARE config', config)
                        dispatchWrapper({
                            type: ufpTypesUnited.REQUEST,
                            payload: {
                                action: action,
                                config: configPrepared
                            }
                        })
                        dispatchWrapper({
                            type: 'MIDDLEWARE_REQUEST',
                            payload: {
                                action: action,
                                config: configPrepared
                            }
                        })
                        while (retry && retryCount < MAX_RETRY_COUNT) {
                            validateResult = undefined
                            retryCount += 1

                            // Make the API call
                            if (options.debug) {
                                UFPMiddlewareUtils.infoLogger('[UFP MIDDLEWARE:] making request', config)
                            }

                            requestResponse = await UFPMiddlewareUtils.ufpMiddlewareRequest(config)

                            if (options.debug) {
                                UFPMiddlewareUtils.infoLogger('[UFP MIDDLEWARE:] making request finished',
                                    (requestResponse instanceof Error) ?
                                        UFPMiddlewareUtils.errorToObject(requestResponse) : requestResponse)
                            }

                            const resultContainerForHandler = {
                                ufpAction: {
                                    ufpData,
                                    ufpDefinition,
                                    ufpPayload: thePayload,
                                    ufpResultHandler,
                                    ufpPreHandler,
                                    ufpTypes: ufpTypesUnited
                                },
                                dispatch: dispatchWrapper,
                                dispatchOriginal: dispatch,
                                getState: getState,
                                globalState: getState(),
                                ufpDefinition,
                                requestResponse: requestResponse
                            }
                            var promiseAll0
                            var promiseAll1

                            var resultHandler
                            // console.log('ufpResultHandler', ufpResultHandler, ufpDefinition)
                            if (ufpResultHandler !== undefined && ufpResultHandler.length > 0) {
                                resultHandler = ufpResultHandler
                                // console.log('resultHandler', resultHandler)
                                promiseAll0 = await UFPMiddlewareUtils.handleResultHandlers(resultHandler, resultContainerForHandler)
                                // console.log('UFPMiddleware HandlerResult: ', promiseAll0, resultHandler)
                                try {
                                    validateResult = UFPMiddlewareUtils.validateResultHandlerResult(promiseAll0)
                                    // console.log('ResultHandler', validateResult)
                                    // console.log('UFPMiddleware Aggregated Result : ', validateResult)
                                    if (validateResult.handled && validateResult.success) {
                                        dispatchWrapper({
                                            type: ufpTypesUnited.SUCCESS,
                                            payload: Object.assign(
                                                Object.assign({}, {data: requestResponse.data}, ufpAction.ufpPayload),
                                                {additionalPayload: validateResult.additionalPayload})
                                        })
                                    }
                                }
                                catch (err) { //UfpMiddlewareResulthandlerMoreThenOneSuccessError
                                    // console.log('Catched error', err)
                                    dispatchWrapper({
                                        type: ufpTypesUnited.FAILURE,
                                        payload: err,
                                        error: true
                                    })
                                    dispatchWrapper({
                                        type: ufpTypesUnited.END,
                                        payload: thePayload
                                    })
                                    return resolve(err)
                                }
                            }
                            // console.log('UFPMiddleware validateResult: ', validateResult)
                            if (!resultHandler || (validateResult && !validateResult.handled)) {
                                promiseAll1 = await UFPMiddlewareUtils.handleResultHandlers(
                                    UFPMiddlewareConfiguration.get().resultHandlings.genericResultHandler, resultContainerForHandler)
                                try {
                                    // console.log('genericResultHandler', promiseAll1)
                                    validateResult = UFPMiddlewareUtils.validateResultHandlerResult(promiseAll1)

                                    if (validateResult.handled && validateResult.success) {
                                        dispatchWrapper({
                                            type: 'MIDDLEWARE_SUCCESS',
                                            payload: {
                                                data: requestResponse.data,

                                                ufpAction: ufpAction,
                                                config: configPrepared
                                            }
                                        })
                                    }
                                }
                                catch (err) { //UfpMiddlewareResulthandlerMoreThenOneSuccessError
                                    // console.log('Catched error', err)
                                    dispatchWrapper({
                                        type: ufpTypesUnited.FAILURE,
                                        payload: err,
                                        error: true
                                    })
                                    dispatchWrapper({
                                        type: ufpTypesUnited.END,
                                        payload: thePayload
                                    })
                                    return resolve(err)
                                }
                            }

                            // console.log('xxxxx middleware promiseall1', promiseAll1, validateResult)
                            // check if if request is unhandled
                            if (!validateResult.handled && !validateResult.success && !validateResult.retry) {
                                console.warn('UFPMiddleware UNHANDLED RESULT UNSUSESFUL UNRETRY: ')
                                var promiseAll2
                                promiseAll2 = await UFPMiddlewareUtils.handleResultHandlers(
                                    UFPMiddlewareConfiguration.get().resultHandlings.unhandledResultHandler,
                                    resultContainerForHandler)

                                // console.log('xxxxx middleware promiseall2', promiseAll2)
                                console.warn('UFPMiddleware UNHANDLED RESULT UNSUSESFUL UNRETRY: ', promiseAll2)
                                // set validate result to the one returned from unhandledResultHandler
                                try {
                                    validateResult = UFPMiddlewareUtils.validateResultHandlerResult(promiseAll2)
                                    if (validateResult.handled && validateResult.success) {
                                        dispatchWrapper({
                                            type: ufpTypesUnited.SUCCESS,
                                            payload: Object.assign(
                                                Object.assign({}, {data: requestResponse.data}, ufpAction.ufpPayload),
                                                {additionalPayload: validateResult.additionalPayload})
                                        })
                                    }
                                }
                                catch (err) { //UfpMiddlewareResulthandlerMoreThenOneSuccessError
                                    console.warn('UFPMiddleware UNHANDLED RESULT USUCCESFYK RETRY: ', err)
                                    dispatchWrapper({
                                        type: ufpTypesUnited.FAILURE,
                                        payload: err,
                                        error: true
                                    })
                                    dispatchWrapper({
                                        type: ufpTypesUnited.END,
                                        payload: thePayload
                                    })
                                    return resolve(err)
                                }

                                console.warn('UFPMiddleware UNHANDLED RESULT USUCCESFYK RETRY: ', validateResult)
                            }

                            retry = validateResult.retry
                            if (!retry && !validateResult.success) {
                                //  console.log('xxxxx middleware rejectin0')
                                dispatchWrapper({
                                    type: ufpTypesUnited.FAILURE,
                                    payload: Object.assign(
                                        Object.assign({}, {data: requestResponse.data}, ufpAction.ufpPayload),
                                        {additionalPayload: validateResult.additionalPayload})

                                })
                                totalSuccess = false
                                // console.log('xxxxx middleware rejecting1')
                                //   reject()
                                // reject()
                                //   // // console.log('xxxxx middleware rejecting2')
                            }
                            //   // // console.log('xxxxx middleware looping3')
                        } // end while
                        if (retryCount === MAX_RETRY_COUNT) {
                            // console.log('UfpMiddleware Max retry count reached')
                            var err = new UfpMiddlewareMaxRetryReachedError()
                            dispatchWrapper({
                                type: ufpTypesUnited.FAILURE,
                                payload: err,
                                error: true
                            }) //Flux Standard Action , if error is true, the payload SHOULD be an error object.
                            dispatchWrapper({
                                type: ufpTypesUnited.END,
                                payload: thePayload
                            })
                            return resolve(err)
                        } else if (totalSuccess) {
                            resolve(requestResponse) //resolve for success
                        } else {
                            resolve(requestResponse) //resolve when handler say its failure
                        }
                    } else { // end if(makeRequest)
                        const err2 = new UfpMiddlewareRequestCancelledError()
                        // console.log('UfpMiddleware Request Cancelled')
                        dispatchWrapper({
                            type: ufpTypesUnited.FAILURE,
                            payload: err2,
                            error: true
                        }) //Flux Standard Action, if error is true, the payload SHOULD be an error object.
                        resolve(err2)
                        //console.log('after resolve')
                    }
                    //console.log('xxxxx middleware looping4', ufpTypesUnited.END)
                    dispatchWrapper({
                        type: ufpTypesUnited.END,
                        payload: {
                            ufpAction: ufpAction,
                            config: configPrepared
                        }
                    })
                    // // // console.log('xxxxx middleware end5')
                    // console.warn('UFPMiddleware END finish: ')
                }
            })
            // // // console.log('MIDDLEWARE PROIMISE IS ', action, dispatchPromise)
            //return next(() => dispatchPromise)
            return dispatchPromise
        }
    }
}
export default UfpMiddleware
