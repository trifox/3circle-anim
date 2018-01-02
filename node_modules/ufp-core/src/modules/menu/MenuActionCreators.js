import MenuConstants from './MenuConstants'

const menuClick = (menuEntry, pushActionCreator) => (dispatch, getState) => {
    if (menuEntry.hash) {
        return dispatch(pushActionCreator(menuEntry.hash))
    } else if (menuEntry.callback) {
        menuEntry.callback({
            menuEntry,
            dispatch: dispatch,
            globalState: getState()
        })
        return Promise.resolve()
    }
}

const menuOpen = (menuItem) => ({
    type: MenuConstants.ActionConstants.MENU_OPEN,
    payload: {
        menuItem: {id: menuItem.id}
    }
})

const menuSwitchOpenClose = (menuItem, area, path) => ({
    type: MenuConstants.ActionConstants.MENU_SWITCH_OPENCLOSE,
    payload: {
        menuItem: {id: menuItem.id},
        pathInfo: {
            area: area,
            path: path
        }
    }
})

const menuClose = (menuItem) => {
    if (menuItem.open) {
        return {
            type: MenuConstants.ActionConstants.MENU_CLOSE,
            payload: {
                menuItem: {id: menuItem.id}
            }
        }
    }
}

export default {
    menuClick,
    menuOpen,
    menuSwitchOpenClose,
    menuClose
}
