// candidate for deprecation totally unclear for what this method has been used
// /**
//  *
//  * @param target
//  * @param object
//  * @param path
//  * @returns {*}
//  */
// export const flattenObject = (target, object, path = '') => {
//     for (var i in object) {
//         if (object.hasOwnProperty(i)) {
//             if (object[i] !== undefined) {
//                 if (object[i] !== null) {
//                     if (object[i] !== '') {
//                         if (typeof object[i] === 'object') {
//                             flattenObject(target, object[i], path === '' ? i : path + '.' + i)
//                         } else if (Array.isArray(object[i])) {
//                             // flatten array as comma separated list ?
//                         } else {
//                             if (Array.isArray(object)) {
//                                 target[path === '' ? '[' + i + ']' : path + '[' + i + ']'] = object[i]
//                             } else {
//                                 target[path === '' ? i : path + '.' + i] = object[i]
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return target
// }

export const isObject = (val) => {
    if (val === null) {
        return false
    }
    return ((typeof val === 'function') || (typeof val === 'object'))
}

export const getObjectForPath = (path, newValue) => {
    //console.log('buildUpdateObject 1 ', path, newValue)
    var elems = path.split('.')
    var current
    elems.reverse()
    // console.log('buildUpdateObject 2 ', elems, elems.length)
    for (var i = 0; i < elems.length; i++) {
        // console.log('buildUpdateObject checking value 3', i, elems[i])
        var item = elems[i]
        if (i === 0) {
            current = {
                [item]: newValue

            }
        } else {
            current = {
                [item]: current
            }
        }
    }

    //console.log('buildUpdateObject returning', current)
    return current
}

/**
 * this method creates a immutable update() object that can be used
 * to update an object.
 *
 * warning: this method does not create intermediate nodes
 *
 * @param path a dot separated property path
 * @param newValue the value to be set
 * @returns {*} the update() config
 */
export const buildUpdateObjectSetValue = (path, newValue) => {
    //console.log('buildUpdateObject 1 ', path, newValue)
    var elems = path.split('.')
    var current
    elems.reverse()
    // console.log('buildUpdateObject 2 ', elems, elems.length)
    for (var i = 0; i < elems.length; i++) {
        // console.log('buildUpdateObject checking value 3', i, elems[i])
        var item = elems[i]
        if (i === 0) {
            current = {
                [item]: {
                    $set: newValue
                }
            }
        } else {
            current = {
                [item]: current
            }
        }
    }

    //console.log('buildUpdateObject returning', current)
    return current
}

export const createUpdate = (obj, path, value) => {
    /**
     * for now we explicitly NOT support array notation
     *
     * @type {{}}
     */

    if (path.indexOf('[') !== -1) {
        throw new Error('Deep Set Update array notation not supported currently')
    }

    var tpath = getObjectForPath(path, value)

    /**
     *     we now need to insert the $set object at exactly the location
     *     where an undefined prop exists
     */
    return makeUpdate(obj, tpath)
}

const makeUpdate = (obj, objUpdate) => {
    var result = {}

    Object.keys(objUpdate)
          .forEach((key) => {
              // check if we have reached the leave node
              if (isObject(objUpdate[key])) {
                  if (obj[key] !== undefined) {
                      /**
                       * if the property exist, check if its structure
                       * changed e.g. plain value to object, since we now
                       * our new value is of type object, we need to
                       * verify that existing value is object as well
                       */
                      if (isObject(obj[key])) {
                          // if object go down that rabbit hole
                          result = {[key]: makeUpdate(obj[key], objUpdate[key])}
                      } else {
                          // if its structure is different insert the $set directive here
                          result = {[key]: {$set: objUpdate[key]}}
                      }
                  } else {
                      // here we found a non existing property,
                      // we need at this point to insert the $set directive
                      // and set the whole remaining object

                      result = {[key]: {$set: objUpdate[key]}}
                  }
              } else {
                  // plain objects go as $set directlu
                  result = {[key]: {$set: objUpdate[key]}}
              }
          })

    return result
}

/**
 * checks of an object has at least one own property
 * @param obj
 * @returns {boolean}
 */
export const isObjectEmpty = (obj) => {
    if (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false
            }
        }
    }
    return true
}

export default{
    isObject,
    isObjectEmpty,
    getObjectForPath,
    createUpdate,
    buildUpdateObjectSetValue
}
