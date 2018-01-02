import MenuConstants from '../MenuConstants'
/**
 * the menu relies on dedicated menu actions that arise from defined action names, this epic transforms
 * any givven actionName to actionName+MenuSuffix that is then handled in the menureducer
 * @param actionName
 */
const createEpicTransformActionToMenuAction = (actionName) => (action$, storeLite) => {
    // console.log('MenuActionEpic Action called ', action$)
    return action$.filter((action) => action.type === actionName)
                  .mapTo({
                      type: actionName + MenuConstants.MENU_ACTION_SUFFIX,
                      payload: {
                          // getState: storeLite.getState
                          getState: storeLite.getState
                      }
                  })
}

export default {
    createEpicTransformActionToMenuAction
}
