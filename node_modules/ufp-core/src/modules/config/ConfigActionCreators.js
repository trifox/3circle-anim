// import update from 'react-addons-update'
// import ApiDefinition from 'api/ApiDefinition'
import {ThrowParam} from '../../utils/JSUtils'
import ConfigConstants from './ConfigConstants'

export default {

    setConfigValue: ({
        key = ThrowParam('Config Key has to be set'),
        value = ThrowParam('Config value has to be set'),
        area = ConfigConstants.DEFAULT_AREA

    }) => {
        return {
            type: ConfigConstants.ACTION_NAMES.SET_CONFIG_VALUE,
            payload: {
                key,
                value,
                area
            }
        }
    }

}
