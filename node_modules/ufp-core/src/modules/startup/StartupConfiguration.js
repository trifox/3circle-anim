import {registerEpic} from '../epic'
import StartupEpic from './StartupEpic'
import JSUtils from '../../utils/JSUtils'

var StartupStages = {}

class StartupConfiguration {

    init() {
        registerEpic({epic: StartupEpic.startupInit})
        registerEpic({epic: StartupEpic.startupStep})
        registerEpic({epic: StartupEpic.startupFinish})
    }

    registerStagedResource({
        stage,
        name,
        actionCreator,
        actionCreatorParams = [],
        required = true,
        actionNameSuccess,
        actionNameFailure

    }) {
        var stageString = JSUtils.pad('000', stage) //for lexicographically sort
        if (!StartupStages['stage' + stageString]) {
            StartupStages['stage' + stageString] = []
        }
        StartupStages['stage' + stageString].push({
            name: name,
            required: required,
            actionCreator: actionCreator,
            actionCreatorParams: actionCreatorParams,
            actionNameSuccess: actionNameSuccess,
            actionNameFailure: actionNameFailure
        })
    }

    registerStage0Resource({
        name,
        actionCreator,
        actionCreatorParams,
        actionNameSuccess,
        actionNameFailure
    }) {
        this.registerStagedResource({
            stage: 0,
            name: name,
            actionCreator: actionCreator,
            actionCreatorParams: actionCreatorParams,
            actionNameSuccess: actionNameSuccess,
            actionNameFailure: actionNameFailure
        })
    }

    registerStage1Resource({
        name,
        actionCreator,
        actionCreatorParams,
        actionNameSuccess,
        actionNameFailure
    }) {
        this.registerStagedResource({
            stage: 1,
            name: name,
            actionCreator: actionCreator,
            actionCreatorParams: actionCreatorParams,
            actionNameSuccess: actionNameSuccess,
            actionNameFailure: actionNameFailure
        })
    }

    get = () => StartupStages
    reset = () => {
        StartupStages = {}
    }

}
export default new StartupConfiguration()
