# Ufp Interface

The following is the official Ufp-Core Interface to the outside world it provides the registration methods for setting up a redux application store

## Public Interface

the following interface is the first setup, it basically starts out with wrapping core redux functionality. this wrapped functionality is used to collect application setup throughout the startup process,

    NOTE: all of the register methods are for now declarative only
    which means they can not be called after application start



### startup()

is the method used to instantiate the declared ufp application. All Configuration has to happen before that call. After this
call the Manifest.actionCreators and Manifest.selectors are bound of any Manifest of whiches register() method has been called

## Private Interface (used internally)


 the following are included here because they are not separated yet, since they heavily deal with
 the declarative functionality of ufp it is very very very certain that this functionality will not
 be exposed in the public interface

### registerReducer(reducer)

registers a [Redux Reducer](http://redux.js.org/docs/basics/Reducers.html)
registers a [Redux Reducer](http://redux.js.org/docs/Glossary.html#reducer)



### registerMiddleware(middleware)

registers a [Redux Middleware](http://redux.js.org/docs/advanced/Middleware.html)
registers a [Redux Middleware](http://redux.js.org/docs/Glossary.html#middleware)

### registerEnhancer(enhancer)

registers a [Redux Store Enhancer](http://redux.js.org/docs/api/createStore.html#arguments)

### registerRunfest(manifest)

this is the preliminary definition of a ufp-core functionality the plan is to host all required information for a ufp-module inside the manifest file for registering
