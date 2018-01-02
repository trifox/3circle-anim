
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/count'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/debounce'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/filter'
import {createEpicMiddleware, combineEpics} from 'redux-observable'
import {ThrowParam} from '../../utils/JSUtils.js'

/**
 * Singleton Epic Configuration, use this class to register epics
 */

var epics = []

const ConfigureEpicsInternal = {
    registerEpic: ({epic = ThrowParam('epic has to be provided')}=
        {epic: ThrowParam('epic has to be provided')}) => {
        //logger.debug('ConfigureEpics.registerEpic', epic)
        epics.push(epic)
    },

    createEpicMiddleware: () => {
        // console.log('Creating Epic Middleware', epics)

        return createEpicMiddleware(combineEpics(...epics))
    },

    reset: () => {
        epics = []
    },

    getEpics: () => {
        return epics
    }

}

export default ConfigureEpicsInternal
