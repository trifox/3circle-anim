export const ThrowParam = (string) => {
    throw new Error(string)
}

function pad(pad, str, padRight) {
    if (typeof str === 'undefined') {
        return pad
    }
    if (padRight) {
        return (str + pad).substring(0, pad.length)
    } else {
        return (pad + str).slice(-pad.length)
    }
}

const factorMethodSkalarArray = (fn) => {
    return (param) => {
        if (Array.isArray(param)) {
            // if is array call method for each array item
            param.map((item) => {
                fn(item)
            })
        }
        else {
            // if is no array call method as normal
            fn(param)
        }
    }
}

export const _Includes = (collection, value) => {
    // console.log('_Includes called on:', collection, value, startIndex)

    //  console.log('_Includes lodash returns =>',)
    var result = false
    collection.map((item) => {
        if (item === value) {
            //    console.log('_Includes return true', item, value)
            result = true
        }
        Object.keys(item)
              .map((key) => {
                  if (item[key] === value) {
                      //    console.log('_Includes return true', key, item[key], value)
                      result = true
                  }
              })
    })
    return result
}

export default {
    ThrowParam,
    pad,
    factorMethodSkalarArray

}
