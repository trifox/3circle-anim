import update from 'react-addons-update'
import MenuConstants from './MenuConstants'
import ObjectUtils from '../../utils/ObjectUtils'
import MenuInternalUtils from './MenuInternalUtils'

export default {
    [MenuConstants.ActionConstants.MENU_OPEN]: (state, action) => {
        var updater = ObjectUtils.buildUpdateObjectSetValue(
            MenuInternalUtils.findPathForMenuId(state.MenuData, action.payload.menuItem.id).path + '.open', true)
        return update(state, {MenuData: updater})
    },

    [MenuConstants.ActionConstants.MENU_CLOSE]: (state, action) => {
        var updater = ObjectUtils.buildUpdateObjectSetValue(
            MenuInternalUtils.findPathForMenuId(state.MenuData, action.payload.menuItem.id).path + '.open', false)
        return update(state, {MenuData: updater})
    },

    [MenuConstants.ActionConstants.MENU_SWITCH_OPENCLOSE]: (state, action) => {
        var pathAndValue = MenuInternalUtils.findPathForMenuId(state.MenuData, action.payload.menuItem.id)
        var updater = ObjectUtils.buildUpdateObjectSetValue(
            pathAndValue.path + '.open', !pathAndValue.value.open)
        return update(state, {MenuData: updater})
    }
}
