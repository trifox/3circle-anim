import StartupConstants from './StartupConstants'

export const StartupState = (state) => state[StartupConstants.NAME]
export const GetStatusSelector = (state) => StartupState(state).status
export const StepStatusSelector = (state) => StartupState(state).stepStatus
export const StageStatusSelector = (state) => StartupState(state).stageStatus
export const StageDefinitionSelector = (state) => StartupState(state).stageDefinition

export const AppInitialisedSelector = (state) => GetStatusSelector(state).appInitialised
export const LoadingStateSelector = (state) => GetStatusSelector(state).loadingState
export const CurrentStageIndexSelector = (state) => GetStatusSelector(state).currentStageIndex
export const TotalFinishedStepsSelector = (state) => GetStatusSelector(state).totalFinishedSteps
export const TotalStagesSelector = (state) => GetStatusSelector(state).totalStages
export const TotalStepsSelector = (state) => GetStatusSelector(state).totalSteps

export const TotalPercentageSelector = (state) => GetStatusSelector(state).totalPercentage
export const StagePercentageSelector = (state) => GetStatusSelector(state).stagePercentage
export const StepPercentageSelector = (state) => GetStatusSelector(state).stepPercentage

const StartupSelectors = {
    StageDefinitionSelector,
    StepStatusSelector,
    StageStatusSelector,

    AppInitialisedSelector,
    LoadingStateSelector,
    CurrentStageIndexSelector,
    TotalFinishedStepsSelector,
    TotalStagesSelector,
    TotalStepsSelector,

    TotalPercentageSelector,
    StagePercentageSelector,
    StepPercentageSelector

}
export default StartupSelectors
