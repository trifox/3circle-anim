import StartupConstants from './StartupConstants'
import StartupSelectors from './StartupSelectors'

const initialiseApplication = () => loadStage(0)

const loadStage = (stageIndex) => (dispatch, getState) => {
    var stageDefinition = StartupSelectors.StageDefinitionSelector(getState())
    //console.log('LOAD STAGE ', stageDefinition)
    var stages = Object.keys(stageDefinition).sort()
    //console.log('LOAD STAGE ', stageIndex, stageDefinition[stages[stageIndex]], getState())

    if (stages.length>0) {
        dispatch({
            type: StartupConstants.ActionConstants.UFP_STARTUP_NEXT_STAGE,
            payload: {
                stageIndex: stageIndex
            }
        })
        stageDefinition[stages[stageIndex]].forEach((element) => {
            dispatch(element.actionCreator.apply(element.actionCreator, element.actionCreatorParams))
        })
    } else {
        dispatch({
            type: StartupConstants.ActionConstants.UFP_STARTUP_NO_STEPS
        })
    }
}

export default {
    initialiseApplication,
    loadStage
}
