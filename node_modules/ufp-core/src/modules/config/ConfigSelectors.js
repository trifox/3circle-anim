import {ThrowParam} from '../../utils/JSUtils'
import ConfigConstants from './ConfigConstants'
import UfpCoreSelectors from '../../core/UfpCoreSelectors'

const getReducerState = (state) => UfpCoreSelectors.getUfpState(state)[ConfigConstants.NAME]

export default {
    getConfigValue: (globalState, {
        key = ThrowParam('Config Key has to be set'),
        area = ConfigConstants.DEFAULT_AREA,
        defaultValue = undefined

    }) => {
        // console.log('Retrieving config value', globalState, area, key)
        const state = getReducerState(globalState).data
        // console.log('Retrieving config value', state, area, key)
        return state && state[area] ? state[area][key] : defaultValue
    }
}
