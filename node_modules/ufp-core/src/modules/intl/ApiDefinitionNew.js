import UFPMiddlewareConstants from '../../middleware/UfpMiddlewareConstants'
import ReduxUtils from '../../utils/ReduxUtils'
import StringUtils from '../../utils/StringUtils'

const ApiDefinition = {

    getUfpLangFile: {
        url: '{api}api/Language/{tag}/{lang}',
        method: UFPMiddlewareConstants.RequestMethodConstants.GET,
        requestType: 'JSON'
    },
    getLocalLangFile: {
        url: '{local}lang/{lang}.json',
        method: UFPMiddlewareConstants.RequestMethodConstants.GET,
        requestType: 'JSON'
    }
}

// before returning enrich the apidefinition with default action handlers
const ApiDefinitionNew = {}
for (var i in ApiDefinition) {
    ApiDefinitionNew[i] = Object.assign({actionConstants: ReduxUtils.createAsyncResponseActionNames(StringUtils.camelCaseToConstant(i))}, ApiDefinition[i])
}
// // console.log('Enriched Api Definition: ', ApiDefinitionEnriched)
export default ApiDefinitionNew
