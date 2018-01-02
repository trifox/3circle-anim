import MenuActionHandlers from './MenuActionHandlers'
import MenuReducerUtils from './MenuReducerUtils'

export default (state = MenuReducerUtils.getInitialState(), action) => {
    // handle own actions
    const handler = MenuActionHandlers[action.type]
    state = handler ? handler(state, action) : state
    state= MenuReducerUtils.MenuActionListReducer(state, action)
    return state
}
