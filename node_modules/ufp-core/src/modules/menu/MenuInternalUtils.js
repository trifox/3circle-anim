const findPathForMenuId = (object, id) => {
  var tempResult
  //console.log('findPathForMenuId start ', object, id)
  for (var area in object) { //iterate areas
    for (var subarea in object[area]) { //iterate subareas
      //console.log('findPathForMenuId subarea items', object[area][subarea].items)
      tempResult = findPathForMenuIdTravers(object[area][subarea].items, id, [area, subarea, 'items'].join('.'))
      if (tempResult != null) {
        return tempResult
      }
    }
  }
  //console.log('findPathForId notfound ', object, id)
  return null
}

const findPathForMenuIdTravers = (items, id, currentPath) => {
  for (var index in items) {
    var item = items[index]
    if (item.id === id) {
      //console.log('findPathForId yeah found ', item, id, currentPath + '.' + index)
      return {
        path: currentPath + '.' + index,
        value: item
      }
    }
    if (item.children !== undefined && Array.isArray(item.children)) {
      var tempResult = findPathForMenuIdTravers(item.children, id, currentPath + '.' + index + '.' + 'children')
      if (tempResult != null) {
        return tempResult
      }
    }
  }
  return null
}

const createRandomId = () => {
  return Math.round(Math.random() * 100000) + '-' +
    Math.round(Math.random() * 100000) + '-' +
    Math.round(Math.random() * 100000)
}

// utility method to sort every menu entry by sortIndex
const sortAllChildren = (menuEntry) => {
  const sortFunction = (a, b) => (a.sortIndex - b.sortIndex)
  menuEntry.children = menuEntry.children.sort(sortFunction)
  for (var i in menuEntry.children) {
    sortAllChildren(menuEntry.children[i])
  }
}

export default {
  sortAllChildren,
  createRandomId,
  findPathForMenuId
}
