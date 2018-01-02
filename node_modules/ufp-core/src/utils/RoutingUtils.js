import StringUtils from './StringUtils'

var RoutingUtils = {

  openNewTab: (hash, params) => {
    var currentLocation = window.location.href
    currentLocation = currentLocation.split('#')[0]
    if (params !== undefined) {
      window.open(currentLocation + '#/' + StringUtils.replaceRouteVariables(hash, params), '_blank')
    } else {
      window.open(currentLocation + '#/' + hash, '_blank')
    }
  },

  getParameterByName: (name, url) => {
    if (!url) {
      url = window.location.href
    }
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)
    if (!results) {
      return null
    }
    if (!results[2]) {
      return ''
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  },

  toQueryString: (obj) => {
    var parts = []
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]))
      }
    }
    return parts.join('&')
  }
}

export default RoutingUtils
