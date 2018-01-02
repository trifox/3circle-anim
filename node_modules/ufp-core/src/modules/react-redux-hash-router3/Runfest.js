/**
 * Application Router
 * @type {{name: string}}
 */
import useRouterHistory from 'react-router/lib/useRouterHistory'
import createHashHistory from 'history/lib/createHashHistory'
import RouterSelectors from './RouterSelectors'
import RouterConstants from './RouterConstants'
import {routerMiddleware, syncHistoryWithStore, routerReducer as routerReducer3} from 'react-router-redux'

const hashHistory = useRouterHistory(createHashHistory)({
    basename: ''
})

const Runfest = {
    name: RouterConstants.NAME,
    description: 'React Redux Hash Router3',
    selectors: RouterSelectors,

    onRegistered: ({UfpCore}) => {
        // console.log('ROUTER REGISTERED CALLED ')

        UfpCore.registerMiddleware({
            id: 'router-middleware',
            middleware: routerMiddleware(hashHistory)
        })

        UfpCore.registerReducer({
            id: RouterConstants.NAME,
            reducer: routerReducer3
        })

        // in this example declare react-router
    },

    /**
     * route setup is communicated through main manifes
     */
    syncHistoryWithStore: (store) => {
        return syncHistoryWithStore(hashHistory, store, {

            selectLocationState: (state) => state[Runfest.name]
        })
    }

}

export default Runfest
