/**
 * identity helper method to for various occasions, where just the input needs to be returned
 * @param t
 * @returns {*}
 */
const identity = (t) => {
    return t
}

/**
 * retrieves the first particular node from an object with the keyname===nodeName
 * @param nodeName  key name to search for
 * @param object object to search for a key with value nodeName
 * @returns {*}
 */
const getNodeFromObject = (nodeName, object) => {
    // // console.log('Getnode from objewct called ', nodeName, object)
    for (var i in object) {
        //   // console.log('Getnode checking ', i, object[i])
        if (i === nodeName) {
            //     // console.log('Getnode returning 1', object[i])
            return object[i]
        } else if (typeof object[i] === 'object' && object[i] !== null) {
            var tempResult = getNodeFromObject(nodeName, object[i])
            if (tempResult !== undefined) {
                //      // console.log('Getnode returning 2', tempResult)
                return tempResult
            }
        }
    }
}

/**
 * the localselector
 * @param nodeName the node to be returned as the local state for the reducer from the main state tree
 */
const createLocalSelector = (nodeName, func) => {
    // // console.log('Creating local selector for node ', nodeName)
    return (state) => {
        //   // console.log('called local selector for node called', nodeName)
        //    // console.log('called local selector for node called local state is', getNodeFromObject(nodeName, state))
        var node = getNodeFromObject(nodeName, state)
        if (node !== undefined) {
            return func(node)
        } else {
            //  throw 'StateTree does not contain required node: [' + nodeName + '] check reducer naming'
            // state tree entry not found assume its allready local
            return func(state)
        }
    }
}

/**
 *
 * für standard actioncreator 2.ter paramter object oder native type,
 * wird payload zugewiesen - identity wird dann angewendet
 *
 * @param type
 * @param actionCreator
 * @param metaCreator
 * @returns {Function}
 */
const createActionCreator = (type, actionCreator, metaCreator) => {
    const finalActionCreator = typeof actionCreator === 'function' ? actionCreator : identity

    return (...args) => {
        const action = {
            type,
            payload: finalActionCreator(...args)
        }

        if (args.length === 1 && args[0] instanceof Error) {
            // Handle FSA errors where the payload is an Error object. Set error.
            action.error = true
        }

        if (typeof metaCreator === 'function') {
            action.meta = metaCreator(...args)
        }

        return action
    }
}

/**
 * creates a reducer from initialstate and action handlers, actions are then mapped through
 * the action handles associative array to obtain the current action handler
 *./
 * @param initialState the initial state of the reducer
 * @param handlers object notated action handlers
 * @returns {reducer} returns the reducer method
 */
const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        // // console.log('DEBUG 1 REDUCER CALLED')
        const handler = handlers[action.type]
        return handler ? handler(state, action) : state
    }
}
/**
 * this helper method is designed to execute actionhandlers from reducers to be combined
 * with the current actionhandlings
 * @param initialState
 * @param handlers
 * @param reducers
 * @returns {reducer}
 */
const createReducerWithChildReducers = (initialState, handlers, reducers) => {
    return (state = initialState, action) => {
        //  // console.log('createReducerWithChildReducers executing  ', action.type, reducers)
        var currentState = state
        // pass through child reducers
        for (var i in reducers) {
            //   // console.log('createReducerWithChildReducers calling child reducer  ', reducers[i])
            currentState = reducers[i](currentState, action)
        }

        const handler = handlers[action.type]
        return handler ? handler(currentState, action) : currentState
    }
}
/**
 * helper method to create the 3 action names request,success,fail to be used by async middleware
 * @param resourceName the prefix for the action names
 * @returns {{REQUEST: string, SUCCESS: string, FAIL: string}}
 */
const createAsyncResponseActionNames = (resourceName) => {
    return {
        REQUEST: resourceName.toUpperCase() + '_REQUEST',
        SUCCESS: resourceName.toUpperCase() + '_SUCCESS',
        END: resourceName.toUpperCase() + '_END',
        FAIL: resourceName.toUpperCase() + '_FAIL',
        ARRAY: [resourceName.toUpperCase() + '_REQUEST', resourceName.toUpperCase() + '_SUCCESS', resourceName.toUpperCase() + '_FAIL']
    }
}
/**
 * his helper method creates a action with parameter already bound
 * @param actionCreator
 * @param dispatch
 * @param params
 * @returns {Function}
 */
const bindActionCreatorAndParams = (actionCreator, dispatch, ...params) => {
    return (...args) => dispatch(actionCreator(...params, ...args))
}

export default{
    createAsyncResponseActionNames,
    createLocalSelector,
    bindActionCreatorAndParams,
    createReducer,
    createActionCreator,
    createReducerWithChildReducers
}
