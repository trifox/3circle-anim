import update from 'react-addons-update'
import StartupConstants from './StartupConstants'
var LoadingStateEnum = StartupConstants.LoadingStateEnum

export default
{
    [StartupConstants.ActionConstants.UFP_STARTUP_NEXT_STAGE]: (state) => {
        //   // console.log('StartupReducer next stage')
        return update(state, {
            status: {
                loadingState: {$set: LoadingStateEnum.LOADING},
                currentStageIndex: {$set: state.status.currentStageIndex + 1},
                stagePercentage: {$set: 0}
            }
        })
    },

    [StartupConstants.ActionConstants.UFP_STARTUP_FINISHED]: (state) => {
        //  // console.log('StartupReducer finalizing ', state)
        return update(state, {
            status: {
                appInitialised: {$set: true},
                loadingState: {$set: LoadingStateEnum.SUCCESS},
                totalPercentage: {$set: 100}
            }
        })
    }
}
