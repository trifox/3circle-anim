import {ThrowParam} from '../../utils/JSUtils'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import React from 'react'
// dummy for eslint without standard-react
var _Providers = []
var _RootSibblings = []
var _RootNode = null
var _ReactApp = null
var _ReactAppCreatorFunction = null

const Runfest = {
    name: 'ufp-react',
    description: 'Ufp React Runfest ',

    register: ({
        rootNode = ThrowParam('HTML RootNode required for initialisation of ufp-react '),
        appCreatorFunction = ThrowParam('JSX Root Component appCreatorFunction required for initialisation of ufp-react')
    }) => {
        _RootNode = rootNode
        _ReactAppCreatorFunction = appCreatorFunction
        // console.log('ufp-react root:', rootNode)
        // console.log('ufp-react aappCreatorFunctionpp:', appCreatorFunction)
    },

    registerProvider: ({
        component
    }) => {
        // console.log('ufp-react root provider registered:', component)
        _Providers.push(component)
    },

    registerRootSibbling: ({
        component = ThrowParam('component Root sibbling has to be set')
    }) => {
        // console.log('ufp-react root sibbling :', component)
        _RootSibblings.push(component)
    },

    onPreStartup: ({UfpCore}) => {
        // console.log('ufp-reactx onPreStartup called React ', UfpCore)
        _ReactApp = _ReactAppCreatorFunction({UfpCore})

        // console.log('ufp-reactx', _RootNode, _ReactApp)

        const App = _ReactApp

        var currentRootComponent = (<App />)

        const sibblings = []
        // console.log('ufp-reactx Root Sibblings are ', sibblings)

        _RootSibblings.map((item, index) => {
            const Component = item
            sibblings.push(<Component key={'sibbling' + index} />)
        })

        _Providers.map((item, index) => {
            const Component = item
            // remark: here the enclosing div is required because some root
            // component providers rely on single child policy ... tsts even china got rid of it...
            // trick here is summing up all providers as childs
            currentRootComponent = (
                <Component>{index === 0 ?
                    (sibblings.length === 0 ? currentRootComponent :
                        <div>{currentRootComponent}{sibblings}</div>) : currentRootComponent }</Component>)
        })
        // console.log('ufp-reactx RootComponent is  ', currentRootComponent)

        ReactDOM.render(<Provider store={UfpCore.getStore()}>{currentRootComponent}</Provider>, _RootNode
        )
    }
}

export default Runfest
