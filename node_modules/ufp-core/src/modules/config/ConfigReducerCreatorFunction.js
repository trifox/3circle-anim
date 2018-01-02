import ConfigActionHandlers from './ConfigActionHandlers'
import ReduxUtils from '../../utils/ReduxUtils'

export default (initialState) => ReduxUtils.createReducer(initialState, ConfigActionHandlers)
