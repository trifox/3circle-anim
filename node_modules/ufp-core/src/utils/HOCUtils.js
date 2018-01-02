const getDisplayName = (WrappedComponent) => WrappedComponent.displayName || WrappedComponent.name || 'Component'
const addDisplayName = ({name, wrappedComponent, newComponent}) => {
    newComponent.displayName = name + '(' + getDisplayName(wrappedComponent) + ')'
}

export default {
    getDisplayName,
    addDisplayName
}
