import ResultHandlerResult from '../utils/ResultHandlerResult'

const requestType = 'JSON'

const matcher = (ufpHandling) => {
    const {ufpAction, requestResponse} = ufpHandling
    return ufpAction.ufpDefinition.requestType === requestType && requestResponse.status === 200
}

const handler = (ufpHandling) => {
    // console.log('UFPMiddleware JSON handling: ', ufpHandling)
    const {dispatch, ufpAction, requestResponse} = ufpHandling
    //  // console.log('UFPResultHandler OK Handling ', ufpHandling)
    // on succes dispatch the received data from here and return hanbdled=true AND success=true
    var dispatchAction = {
        type: ufpAction.ufpTypes.SUCCESS,
        payload: {
            ufpAction: {ufpData: ufpAction.ufpData,
                ufpDefinition: ufpAction.ufpDefinition
            },
            data: requestResponse.data
        }
    }
    // console.log('UFPMiddleware JSON dispatching', JSON.stringify(dispatchAction))
    dispatch(dispatchAction)
    return Promise.resolve(new ResultHandlerResult(true, true, false))
}

export default {
    requestType,
    matcher,
    handler
}
