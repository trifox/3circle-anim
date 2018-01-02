import MenuConstants from './MenuConstants'
import {registerEpic} from '../epic'
import MenuActionEpicCreator from './epics/MenuActionEpicCreator'
import JSUtils from '../../utils/JSUtils'
import MenuInternalUtils from './MenuInternalUtils'
const EmptyFunc = () => {
}

class MenuConfigurationInternal {

    MenuDefinition = []
    MenuData = {}

    createMenuEntry({
        open = false,
        sortIndex = 0,
        component = JSUtils.ThrowParam('react component has to be set'),
        href,
        styleClass,
        hash,
        highLight,
        callback = EmptyFunc,
        children = []
    }) {
        return {
            id: MenuInternalUtils.createRandomId(),
            hash,
            open,
            styleClass,
            component,
            sortIndex,
            highLight,
            href,
            callback,
            children
        }
    }

    registerMenuReducer = ({
        area = 'main',
        sortIndex = -1,
        subArea,
        actionName,
        actionNames = [],
        actionHandler,
        initialState = []
    }) => {
        //console.log('MenuConfigurator registerMenuReducer', arguments)
        //console.log('MenuConfigurator registerMenuReducer', area, actionNames,
        // actionHandler, initialState)

        if (!subArea) {
            throw new Error('UFP Menu Configuration SubArea needs to be defined')
        }
        // // console.log('Register Menu Reducer called ', area, actionNames,
        // actionHandler, actionName)

        // create an empty place for the menu reducer to live in
        if (!this.MenuData[area]) {
            this.MenuData[area] = {}
        }

        if (!this.MenuData[area][subArea]) {
            this.MenuData[area][subArea] = {}
            this.MenuData[area][subArea].items = initialState
            this.MenuData[area][subArea].sortIndex = sortIndex
        }
        var menuDef = ({
            // todo/fixme: generalize/centralize generation of ufp id objects!
            area,
            sortIndex,
            actionName: actionName + MenuConstants.MENU_ACTION_SUFFIX,
            subArea,
            initialState,
            actionHandler
        })
        // append to menu definition hash using action name as key for quick access to
        // the action handler

        //

        if (Array.isArray(actionNames)) {
            // for quick reference put all original action names into handled actions to be found
            // easily by menureducer to defer its call to the ones renamed in the menu entry
            actionNames.map((currentActionName) => {
                // // console.log('Register Menu Reducer called adding item ', currentActionName)
                if (this.MenuDefinition[currentActionName] === undefined) {
                    this.MenuDefinition[currentActionName] = []
                }
                this.MenuDefinition[currentActionName].push(Object.assign({}, menuDef,
                    {actionName: currentActionName + MenuConstants.MENU_ACTION_SUFFIX}))
                /**
                 * create and register an epic of the form: action->action_Menu meaning that
                 * the list of actions is going to get
                 * transformed with the menu suffix, this is handled as before just that no UfpActor
                 * is needed to watch over the state
                 *
                 */
                registerEpic({
                    epic: MenuActionEpicCreator.createEpicTransformActionToMenuAction(currentActionName)
                })
            })
        }
        if (actionName) {
            // // console.log('Register Menu Reducer called adding item single', actionName)
            if (this.MenuDefinition[actionName] === undefined) {
                this.MenuDefinition[actionName] = []
            }
            this.MenuDefinition[actionName].push(menuDef)
            registerEpic({
                epic: MenuActionEpicCreator.createEpicTransformActionToMenuAction(actionName)
            })
        }
    }
    getMenuData = () => {
        return this.MenuData
    }
    getMenuDefinition = () => {
        return this.MenuDefinition
    }

}
export default new MenuConfigurationInternal()
