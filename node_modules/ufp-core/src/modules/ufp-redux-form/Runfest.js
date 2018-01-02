/**
 * the runfest.js defines the properties of the ufp-module and serves as RUNtimemaniFEST
 * @type {{name: string}}
 */
import {reducer as formReducer} from 'redux-form'

const Runfest = {
    name: 'ufp-redux-form',
    description: 'Ufp Redux Form Wrapper',

    onRegistered({UfpCore}) {
        UfpCore.registerReducer({
            id: 'form',
            reducer: formReducer
        })
    }
}

export default Runfest
