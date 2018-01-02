import update from 'react-addons-update'
import MenuConfigurationInternal from './MenuConfigurationInternal'
import MenuInternalUtils from './MenuInternalUtils'

export const getInitialState = () => {
    // console.log('Initial State Menu called ', MenuConfigurationInternal)
    // console.log(MenuConfigurationInternal)

    return {

        MenuData: MenuConfigurationInternal.getMenuData(),
        MenuDefinition: MenuConfigurationInternal.getMenuDefinition(),
        DeferedActionsList: []
    }
}

const MenuActionListReducer = (state, action) => {
    // console.log('MenuReducer Called', state, action)
    var menuEntryAll = state.MenuDefinition[action.type]
    // console.log('MenuReducer Called menudef entry is ', menuEntryAll)

    if (menuEntryAll !== undefined) {
        var pushedalread = {}
        menuEntryAll.map((menuEntry) => {
            // // console.log('MenuReducer entry found ', menuEntry)

            // if menu registered action is encountered, store the aftermath
            // action in the action list to be executed after the "normal" action
            // handlers for that action have done their work
            // this defered actions is then called from the menuactor
            if (pushedalread[menuEntry.actionName] === undefined) {
                state = update(state, {DeferedActionsList: {$push: [menuEntry.actionName]}})
            }
            pushedalread[menuEntry.actionName] = true
            // // console.log('MenuReducer new state is', state)
            // // console.log('MenuReducer new defer is', [menuEntry.actionName])
        })
        return state
    } else {
        // check if entry is in defer list and call reducer for menu
        if (state.DeferedActionsList.indexOf(action.type) !== -1) {
            // // console.log('MenuReducedr action is in defered list, check for menu
            // reducers and remove entry from defered list')
            for (var i in state.MenuDefinition) {
                const menuEntryAll = state.MenuDefinition[i]
                if (menuEntryAll !== undefined) {
                    menuEntryAll.map((menuEntry) => {
                            if (menuEntry.actionName === action.type ||
                                (Array.isArray(menuEntry.actionNames) &&
                                menuEntry.actionNames.indexOf(action.type) !== -1)) {
                                // call menu reducer with its state from this reducer
                                // // console.log('MenuReducer Called menudef entry is 1', menuEntry)
                                // // console.log('MenuReducer Called menudef state is 2',
                                // state.MenuData[menuEntry.area][menuEntry.subArea])
                                var newLocalState = menuEntry.actionHandler({
                                    getState: action.payload.getState,
                                    state: state.MenuData[menuEntry.area][menuEntry.subArea].items,
                                    action: action
                                })
                                if (Array.isArray(newLocalState)) {
                                    newLocalState.map((menuEntry) => {
                                        MenuInternalUtils.sortAllChildren(menuEntry)
                                    })
                                }
                                // retrieve the local state for the menu, each menu reducer
                                // shall just receive its local menu definition
                                state = update(state, {
                                    MenuData: {
                                        [menuEntry.area]: {[menuEntry.subArea]: {items: {$set: newLocalState}}}
                                    }
                                })
                            }
                        }
                    )
                }
            }
            // remove defered action from list
            // // console.log('MenuReducer removing defered action', action)
            state = update(state, {
                DeferedActionsList: {$splice: [[state.DeferedActionsList.indexOf(action.type), 1]]}
            })
        }
        return state
    }
}

export default {
    getInitialState,
    MenuActionListReducer
}
