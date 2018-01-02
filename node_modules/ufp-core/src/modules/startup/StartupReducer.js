import StartupConfiguration from './StartupConfiguration'
import StartupReducerUtils from './StartupReducerUtils'
import StartupActionHandlers from './StartupActionHandlers'

export default (state = StartupReducerUtils.getInitialState(StartupConfiguration.get()), action) => {
    // first default action andling
    const handler = StartupActionHandlers[action.type]
    state = handler ? handler(state, action) : state
    state = StartupReducerUtils.stepReducer(state, action)
    return state
}
