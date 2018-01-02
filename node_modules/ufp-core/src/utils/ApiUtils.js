import {set} from './DeepGetSet'
/**
 * helper method to create the 3 action names request,success,fail to be used by async middleware
 * @param apiDefinitionPath the prefix for the action names
 * @returns {{REQUEST: string, SUCCESS: string, FAILURE: string, END: string}}
 */

const createAsyncResponseActionNames = (apiDefinitionPath) => {
    return {
        REQUEST: apiDefinitionPath.toUpperCase() + '_REQUEST',
        SUCCESS: apiDefinitionPath.toUpperCase() + '_SUCCESS',
        END: apiDefinitionPath.toUpperCase() + '_END',
        FAILURE: apiDefinitionPath.toUpperCase() + '_FAILURE'
    }
}
const traverseDefinition = (obj, callback, path) => {
    // // console.log('traversinng ', obj, path)
    path = path || []
    if (typeof obj === 'object' && obj.url === undefined) {
        Object.keys(obj).forEach((key) => {
            var value = obj[key]
            traverseDefinition(value, callback, path.concat(key))
        })
    } else {
        callback.call(obj, path, obj)
    }
}

const createActionConstantsForApiDefinitions = (ApiDefinitionsObject) => {
    var newApiDefinitionsObject = {}
    traverseDefinition(ApiDefinitionsObject, (path, definition) => {
        set(newApiDefinitionsObject, path,
            Object.assign({
                actionConstants: createAsyncResponseActionNames(
                    path.join('_').toLocaleUpperCase())
            }, definition))
    })
    return newApiDefinitionsObject
}

export default {
    createActionConstantsForApiDefinitions,
    createAsyncResponseActionNames
}
