import StartupConstants from './StartupConstants'
import update from 'react-addons-update'

var LoadingStateEnum = StartupConstants.LoadingStateEnum

const getInitialStatus = (StartupStageDefinition) => {
    // calculate total steps by counting through the definition
    var totalSteps = 0
    // good ole iterate iterate but no external lib used,
    // todo: fixme: provide Object.reduce() helper method
    for (var i in StartupStageDefinition) {
        var stage = StartupStageDefinition[i]
        Object.keys(stage)
            .map(() => {
                totalSteps++
            })
    }
    var result = {
        currentStageIndex: -1,
        appInitialised: false,
        loadingState: LoadingStateEnum.UNINITIALISED,
        stagePercentage: 0,
        totalPercentage: 0,
        stepPercentage: 0,
        totalStages: Object.keys(StartupStageDefinition).length,
        totalSteps: totalSteps,
        totalFinishedSteps: 0
    }
    return result
}

const getInitialStageStatus = (StartupStageDefinition) => {
    var obj = {}
    Object.keys(StartupStageDefinition)
        .sort()
        .map((StartupStageDefinitionName, index) => {
            var stage = StartupStageDefinition[StartupStageDefinitionName]
            obj[index] = {
                totalSteps: stage.length,
                successCount: 0,
                failureCount: 0
            }
        })
    return obj
}

const getInitialStepStatus = (StartupStageDefinition) => {
    // // // console.log('StartupReducer creating ', Object.assign({},
    // StartupStageDefinition))
    var result = {}
    for (var i in StartupStageDefinition) {
        var stage = StartupStageDefinition[i]

        //   // // console.log('StartupReducer Creating initialstate startup2:', stage)

        for (var j in stage) {
            var current = stage[j]
            result[current.name] = LoadingStateEnum.UNINITIALISED
        }
    }

    // // // console.log('StartupReducer Creating initialstate startup4:', result)
    return result
}

const getInitialState = (StartupStageDefinition) => {
    return {
        status: getInitialStatus(StartupStageDefinition),
        stageStatus: getInitialStageStatus(StartupStageDefinition),
        stepStatus: getInitialStepStatus(StartupStageDefinition),
        stageDefinition: StartupStageDefinition
    }
}

const updateStatus = (state) => {
    var currentStageIndex = state.status.currentStageIndex
    var totalCount = state.stageStatus[currentStageIndex].totalSteps
    var successCount = state.stageStatus[currentStageIndex].successCount
    //var failureCount=state.stageStatus[currentStageIndex].failureCount
    //console.log('totalcount',totalCount, failureCount, successCount)

    if (totalCount === successCount) {
        // set next stage
        state = update(state, {status: {stagePercentage: {$set: 100}}})
        //epic will start next stage or report finish
        // console.log('StartupReducer Stage finished ', state)
    } else {
        // if stage is not finished update percentage for current stage
        state = update(state, {status: {stagePercentage: {$set: Math.round((successCount / totalCount) * 100.0)}}})

        // console.log('StartupReducer Stage not finished ', currentStage, state)
    }

    // and update total percentage accordingly
    var totalPercentage = Math.round(((currentStageIndex) / state.status.totalStages) * 100)
    // // // console.log('StartupReducer actualizing percentages stage1 ', state.status.stagePercentage)
    //  // // console.log('StartupReducer actualizing percentages total2 ', totalPercentage)
    //console.log('StartupReducer actualizing percentages total3', totalPercentage +
    // ((state.status.stagePercentage / state.status.totalStages) * 0.01) * 100.0)
    state = update(state, {
        status: {
            totalPercentage: {$set: totalPercentage + (((state.status.stagePercentage / state.status.totalStages) * 0.01) * 100.0)}
        }
    })
    state = update(state, {
        status: {
            stepPercentage: {$set: (state.status.totalFinishedSteps / state.status.totalSteps) * 100.0}
        }
    })

    return state
}

const stepReducer = (state, action) => {
    if (state === undefined || !state.status || state.status.currentStageIndex === -1) {
        return state
    }

    // console.log('Step Reducer Called', state, action)

    var currentStageIndex = state.status.currentStageIndex
    var stageKeys = Object.keys(state.stageDefinition)
        .sort()
    //  // // console.log('StartupReducer ', currentStageIndex, stageKeys)
    // marker flag if any of the registered actions are incoming (dont update state otherwise)
    var currentStage = state.stageDefinition[stageKeys[currentStageIndex]]

    // console.log('Step Reducer Called Current Stage is', currentStage)

    currentStage.some((stepDef) => {
        // // console.log('StartupReducer checking', stepDef)
        // // console.log('StartupReducer checking', action.type, stepDef.actionNameSuccess)
        // // console.log('StartupReducer checking', action.type === stepDef.actionNameSuccess)
        if (action.type === stepDef.actionNameSuccess) {
            state = update(state, {
                stepStatus: {
                    [stepDef.name]: {$set: LoadingStateEnum.SUCCESS}
                }
            })
            // increase step for every success
            state = update(state, {
                status: {
                    totalFinishedSteps: {$set: state.status.totalFinishedSteps + 1}
                }
            })
            //update count in stageStatus
            state = update(state, {
                stageStatus: {
                    [currentStageIndex]: {successCount: {$set: state.stageStatus[currentStageIndex].successCount + 1}}
                }
            })
            state = updateStatus(state)
            // console.log('StartupReducer success', stepDef)
            return true //breaks the execution
        } else if (action.type === stepDef.actionNameFailure) {
            state = update(state, {
                stepStatus: {
                    [stepDef.name]: {$set: LoadingStateEnum.FAILURE}
                }
            })
            //update count in stageStatus
            if (stepDef.required === true) {
                state = update(state, {
                    stageStatus: {
                        [currentStageIndex]: {failureCount: {$set: state.stageStatus[currentStageIndex].failureCount + 1}}
                    }
                })
            } else {
                state = update(state, {
                    status: {
                        totalFinishedSteps: {$set: state.status.totalFinishedSteps + 1}
                    }
                })
                state = update(state, {
                    stageStatus: {
                        [currentStageIndex]: {successCount: {$set: state.stageStatus[currentStageIndex].successCount + 1}}
                    }
                })
            }

            state = updateStatus(state)
            // console.log('StartupReducer failed', stepDef)
            return true //breaks the execution
        }
        return false //continue the execution
    })
    return state
}

export default {
    updateStatus,
    getInitialState,
    getInitialStepStatus,
    getInitialStageStatus,
    stepReducer
}
