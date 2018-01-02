import UfpMiddlewareUtils from './UfpMiddlewareUtils'
import PropTypes from 'prop-types'

const UFPMiddlewareConfigurationX = {
    resultHandlings: {
        genericResultHandler: [],
        unhandledResultHandler: []
    },
    preRequestHandling: [],
    createConfig: undefined
}

const UFPHandlerPropTypeDefinition =
    PropTypes.shape({
        matcher: PropTypes.func.isRequired,
        handler: PropTypes.func.isRequired
    })

const UFPHandlerPropTypeDefinitionArray = {
    input: PropTypes.arrayOf(UFPHandlerPropTypeDefinition).isRequired
}
const UFPHandlerPropTypeDefinitionObject = {
    input: UFPHandlerPropTypeDefinition.isRequired
}

const register = (array) => (handlers) => {
    // console.log('UfpMiddlewareUtils', UfpMiddlewareUtils)

    if (Array.isArray(handlers)) {
        if (UfpMiddlewareUtils.PropTypesCheck({input: handlers}, UFPHandlerPropTypeDefinitionArray)) {
            handlers.map((handler) => {
                array.push(handler)
            })
        } else {
            throw new Error('UFP ResultHandler or Prehandler Objects need to have a matcher and handler function')
        }
    } else {
        if (UfpMiddlewareUtils.PropTypesCheck({input: handlers}, UFPHandlerPropTypeDefinitionObject)) {
            array.push(handlers)
        } else {
            throw new Error('UFP ResultHandler or Prehandler Objects need to have a matcher and handler function')
        }
    }
}

const setCreateConfig = (createConfig) => {
    UFPMiddlewareConfigurationX.createConfig = createConfig
}

const registerResultHandler = register(UFPMiddlewareConfigurationX.resultHandlings.genericResultHandler)
const registerPreHandler = register(UFPMiddlewareConfigurationX.preRequestHandling)
const registerUnhandledHandler = register(UFPMiddlewareConfigurationX.resultHandlings.unhandledResultHandler)
//UFPMiddlewareConfigurationX.resultHandlings.unhandledResultHandler.push(UFPResponseHandler)

export default {
    get: () => UFPMiddlewareConfigurationX,
    registerResultHandler,
    registerPreHandler,
    registerUnhandledHandler,
    setCreateConfig
}
