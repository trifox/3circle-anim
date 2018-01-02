/**
 * the runfest.js defines the properties of the ufp-module RUNtimemaniFEST
 * @type {{name: string}}
 */
import MenuActionCreators from './MenuActionCreators'
import MenuSelectors from './MenuSelectors'
import MenuReducer from './MenuReducer'
import {EpicRunfest} from '../epic'
import MenuContants from './MenuConstants'
import {ThrowParam} from '../../utils/JSUtils'

const Runfest = {
    name: MenuContants.NAME,
    description: 'Ufp Menu - provides menu management functionality',
    actionCreators: MenuActionCreators,
    selectors: MenuSelectors,

    onRegistered({UfpCore = ThrowParam('UfpCore Instance Required')}) {
        UfpCore.registerRunfest(EpicRunfest)

        UfpCore.registerReducer({
            id: MenuContants.NAME,
            reducer: MenuReducer
        })
    }

}

export default Runfest
