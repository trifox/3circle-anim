import MenuConstants from './MenuConstants'

export const MenuState = (state) => state[MenuConstants.NAME]

export const MenuDefinitionSelector = (state) => MenuState(state).MenuDefinition
export const MenuDataSelector = (state) => MenuState(state).MenuData || {}

export const MenuSubAreasSortedSelector = (state, props) => {
    var data = MenuDataSelector(state)

    var keysSorted
    if (props.menuAreaName !== undefined && data !== undefined && data[props.menuAreaName] !== undefined) {
        keysSorted = Object.keys(data[props.menuAreaName])
            .sort((a, b) => {
                if (data[props.menuAreaName][a].sortIndex !== -1 && data[props.menuAreaName][b].sortIndex !== -1) {
                    return data[props.menuAreaName][a].sortIndex - data[props.menuAreaName][b].sortIndex
                } else {
                    if (data[props.menuAreaName][a].sortIndex === -1 && data[props.menuAreaName][a].sortIndex === -1) {
                        return 0
                    } else if (data[props.menuAreaName][a].sortIndex === -1) {
                        return -1
                    } else {
                        return 1
                    }
                }
            })
    } else {
        keysSorted = []
    }
    var sortedItems = []
    keysSorted.map((item) => {
        sortedItems.push(data[props.menuAreaName][item].items)
    })
    return sortedItems
}

export const MenuSubAreaSelector = (state, props) => {
    var data = MenuDataSelector(state)
    return (data && data[props.menuAreaName] && data[props.menuAreaName][props.menuSubAreaName].items) || {}
}

export const MenuDeferedActionsSelector = (state) => MenuState(state).DeferedActionsList

export default {
    MenuSubAreaSelector,
    MenuDefinitionSelector,
    MenuDataSelector,
    MenuDeferedActionsSelector,
    MenuSubAreasSortedSelector
}
