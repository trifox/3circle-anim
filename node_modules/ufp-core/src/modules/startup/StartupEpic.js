import UfpCoreConstants from '../../core/UfpCoreConstants'
import StartupConstants from './StartupConstants'
import StartupSelectors from './StartupSelectors'
import StartupActionCreators from './StartupActionCreators'

const startupInit = (action$) => {
    return action$.filter((action) => action.type === UfpCoreConstants.ACTION_NAMES.STARTUP)
                  .mapTo(
                      StartupActionCreators.initialiseApplication()
                  )
}
const startupStep = (action$, store) => {
    //console.log('startupStep Epic Action called ', action$, store)
    return action$.filter((action) => {
        // console.log('startupStep Epic Action called state:', store.getState())
        if (action.type !== StartupConstants.ActionConstants.UFP_STARTUP_NEXT_STAGE) {
            var totalStageCount = StartupSelectors.TotalStagesSelector(store.getState())
            var currentStageIndex = StartupSelectors.CurrentStageIndexSelector(store.getState())
            var currentStagePercentage = StartupSelectors.StagePercentageSelector(store.getState())
            // console.log('startupStep Epic Action called ', {
            //     totalStageCount,
            //     currentStageIndex,
            //     currentStagePercentage
            // })
            if (currentStagePercentage >= 100 && (currentStageIndex + 1) !== totalStageCount) {
                return true //stage finished and is not last stage
            }
        }
        return false
    })
                  .mapTo((dispatch, getState) => {
                      var currentStageIndex = StartupSelectors.CurrentStageIndexSelector(getState())
                      // console.log('startupstep finished stage:', currentStageIndex)
                      // console.log('Startupstep load next stage:', currentStageIndex + 1)
                      dispatch(StartupActionCreators.loadStage(currentStageIndex + 1))
                  })
                  .takeUntil(action$.ofType(StartupConstants.ActionConstants.UFP_STARTUP_FINISHED))
}

const startupFinish = (action$, store) => {
    // console.log('startupFinish Epic Action called ', action$)
    return action$.filter((action) => {
        // console.log('startupFinish Epic Action called ', store.getState())
        if (action.type === StartupConstants.ActionConstants.UFP_STARTUP_NO_STEPS) {
            // console.log('startupFinish Epic Action called return TRUE - no steps registered')
            return true
        } else {
            var appInitialised = StartupSelectors.AppInitialisedSelector(store.getState())
            var totalStageCount = StartupSelectors.TotalStagesSelector(store.getState())
            var currentStageIndex = StartupSelectors.CurrentStageIndexSelector(store.getState())
            var currentStagePercentage = StartupSelectors.StagePercentageSelector(store.getState())

            // console.log('startupFinish Epic Action called return TRUE - no steps registered', appInitialised, totalStageCount, currentStageIndex, currentStagePercentage)

            if (currentStagePercentage >= 100 && (currentStageIndex + 1) === totalStageCount && !appInitialised) {
                // console.log('startupFinish Epic Action called return TRUE')
                return true //stage finished and is last stage
            }
            return false
        }
    })
                  .mapTo((dispatch, getState) => {
                          dispatch({
                              type: StartupConstants.ActionConstants.UFP_STARTUP_FINISHED,
                              payload: {
                                  getState: getState
                              }
                          })
                      }
                  )
                  .takeUntil(action$.ofType(StartupConstants.ActionConstants.UFP_STARTUP_FINISHED))
}

export default {
    startupStep,
    startupFinish,
    startupInit
}
