import update from 'react-addons-update'
import IntlConstants from './IntlConstants'
import StorageReal from '../../utils/storage/StorageReal'

export default {
    [IntlConstants.SET_LANGUAGES]: (state, action) => {
        return update(state, {
            languages: {$set: action.payload.languages}
        })
    },

    [IntlConstants.SET_LANGUAGE_REQUEST]: (state, action) => {
        return update(state, {
            nextLanguage: {$set: action.payload.lang}
        })
    },
    [IntlConstants.SET_LANGUAGE]: (state, action) => {
        if (action.payload.lang && state.currentLanguage !== action.payload.lang) {
            return update(state, {
                randomKey: {$set: Math.random()},
                currentLanguage: {$set: action.payload.lang}
            })
        }
        StorageReal.setItem(IntlConstants.STORAGE_KEY, action.payload.lang)
        return state
    },

    [IntlConstants.APPEND_MESSAGES]: (state, action) => {
        return update(state, {
            allMessages: {
                [action.payload.lang]: {$push: action.payload.messages}
            },
            randomKey: {$set: Math.random()}
        })
    },
    [IntlConstants.UPDATE_MESSAGES]: (state, action) => {
        const {messages, lang}=action.payload
        var result = state

        result = update(result, {
            allMessages: {
                [lang]: {$set: messages}
            },
            randomKey: {$set: Math.random()}
        })

        if (state.nextLanguage === action.payload.lang && state.currentLanguage !== state.nextLanguage) {
            // update current language according to next language if it was the desire to load for
            // active language (which we define as such)

            result = update(result, {
                currentLanguage: {$set: action.payload.lang}
            })

            var found = false
            state.languages.map((langid) => {
                if (langid === action.payload.lang) {
                    found = true
                }
            })
            if (!found) {
                result = update(result, {languages: {$push: [action.payload.lang]}})
            }
        }

        console.log('UPDATE MESSAGE result ', result)

        return result
    }

}
