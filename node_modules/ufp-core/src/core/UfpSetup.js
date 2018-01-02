// import _UFPMiddleware from './ufpmiddleware/index.js'
// import _Utils from './utils/index.js'
// import _ConfigureEpics from './epic/ConfigureEpics.js'
// import _Startup from './startup/index.js'
// import _UfpStoreConfig from './store/StoreConfig'
//
// import _Menu from './menu/index.js'
//
// export const ConfigureEpics = _ConfigureEpics
// export const UFPUtils = _Utils
// export const UfpStoreConfig = _UfpStoreConfig
// export const UFPStartup = _Startup
// export const UFPMiddleware = _UFPMiddleware
// // export const UFPMenu = _Menu
// export default{
//
//     UFPMiddleware: _UFPMiddleware,
//     UFPUtils: UFPUtils,
//     UFPStartup: _Startup,
//     UfpStoreConfig,
//     ConfigureEpics: ConfigureEpics,
//     UFPMenu: _Menu
// }
// index.js is evil
// the redux store

const initialStateCallbacks = []
const manifests = []
const reducers = []
const middlewares = []
const enhancers = []
const reducerCreators = []
const middlewareCreators = []
const enhancerCreators = []
export default {
    initialStateCallbacks,
    manifests,
    reducers,
    middlewares,
    enhancers,
    reducerCreators,
    middlewareCreators,
    enhancerCreators,

    getAllActionCreators: () => {
        const result = []
        manifests.map((manifest) => {
            if (manifest.actionCreators) {
                // console.log('United Action pushing', manifest.actionCreators)
                // console.log('United Action pushing', ...manifest.actionCreators)
                result.push(...manifest.actionCreators)
            }
        })
        // console.log('United Action manifests are', this)
        // console.log('United Action manifests are', manifests)
        // console.log('United Action Creators are', result)
        return result
    }

}
