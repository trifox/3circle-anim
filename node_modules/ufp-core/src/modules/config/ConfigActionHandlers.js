import ConfigConstants from './ConfigConstants'
import update from 'react-addons-update'
import ObjectUtils from '../../utils/ObjectUtils'

export default {

    [ConfigConstants.ACTION_NAMES.SET_CONFIG_VALUE]: (state, action) => {
        // console.log('Config Reducer Setting config value', action.payload)

        var updater = ObjectUtils.createUpdate(state,
            'data.' + action.payload.area + '.' + action.payload.key, action.payload.value)

        // console.log('yyyyyyyyyyCurrent state is ', JSON.stringify(state))
        // console.log('yyyyyyyyyyUpdate would be then ', JSON.stringify(updater))
        var result = update(state, updater)
        return result
        // //initialise main data container
        // if (state.data === undefined) {
        //     state = update(state, {
        //         data: {$set: {}}
        //     })
        // }
        // //initialise area data container
        // if (state.data[action.payload.area] === undefined) {
        //     state = update(state, {
        //         data: {[action.payload.area]: {$set: {}}}
        //     })
        // }
        //
        // console.log('Config Reducer Setting config value', action.payload)
        // console.log('Config Reducer Setting config value', action.payload)
        // console.log('Config Reducer Setting config value', action.payload)
        // console.log('Config Reducer Setting config value', action.payload)
        // // and set final value
        // return update(state, {
        //     data: {
        //         [action.payload.area]: {
        //             [action.payload.key]: {$set: action.payload.value}
        //         }
        //     }
        // })
    }
}
