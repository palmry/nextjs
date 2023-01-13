import { matchPath } from 'react-router-dom'
import { getConfig } from '../globalConfig'

const routes = getConfig('Routes')
const CATEGORY_CONFIGS_EN = getConfig('Category').en

const routeNameFromPath = (path = null) => {
  const routeMatches = Object.keys(routes).filter(key => {
    const match = matchPath(path, routes[key])
    if (
      match &&
      match.isExact &&
      (key !== 'category' || CATEGORY_CONFIGS_EN[match.params.categorySlug]) //if category match check slug against category config
    )
      return key
    else return false
  })
  if (!routeMatches) return null
  const staticMatches = routeMatches
    ? routeMatches.filter(routeKey => routes[routeKey]['isStatic'])
    : []
  return staticMatches.length ? staticMatches[0] : routeMatches[0]
}

export default routeNameFromPath
