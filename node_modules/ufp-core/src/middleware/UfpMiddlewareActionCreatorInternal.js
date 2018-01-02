import UFPRequestActions from './UfpRequestActions'

const createActionCreatorForDefinition = (definition, ufpPrehandler = [], ufpResultHandler = []) =>
    ({urlParams = {}, queryParams = {}, body = undefined, ufpPayload = {}}={
        urlParams: {},
        queryParams: {},
        body: undefined,
        ufpPayload: {}
    }) => {
        // console.log('Executing automaticly generated action from definition ', UFPRequestActions, definition)
        const result = ({
            [UFPRequestActions.UFP_REQUEST_ACTION]: {
                ufpDefinition: definition,
                ufpData: {
                    urlParams,
                    queryParams,
                    body
                },
                ufpPayload: ufpPayload,
                ufpPreHandler: ufpPrehandler,
                ufpResultHandler: ufpResultHandler
            }
        })
        // console.log('Executing automaticl result is ', result)
        return result
    }

export default {
    createActionCreatorForDefinition
}
