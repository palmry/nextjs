import { getFpv } from './fpv'
import { utmCampaign, utmMedium, utmSource, getUtm } from './utmValues'
import routeNameFromPath from './routeNameFromPath'
import capitalize from 'lodash/capitalize'
import { getActivePost } from './activePost'

const postTypeMap = {
  article: 'Article Pages',
  gallery: 'Slideshow Pages',
  'video article': 'Video Article Pages',
  'video gallery': 'Video Slideshow Pages',
}

export const prop30 = (options = {}) => {
  const { pageType = null, postType = null, site = 'none', path = null } = options
  const activePostType = getActivePost() ? getActivePost()['postType'] : null
  const postTypeValue = postType
    ? postTypeMap[postType]
    : activePostType
    ? postTypeMap[activePostType]
    : null
  const pageTypeFromPath = path ? routeNameFromPath(path) : null
  if (pageTypeFromPath === 'post' && !postType && !activePostType) return null //return null if route name is 'post' and no postType argument exists since we're making a seperate call elsewhere with postType as an argument
  const pageTypeValue = pageType || postTypeValue || pageTypeFromPath || 'Other Pages'
  const fpv = getFpv() === 1 ? 'fpv' : 'all'
  const utmCampaignValue = utmCampaign || 'none'
  const utmMediumValue = utmMedium || 'none'
  const utmSourceValue = utmSource || 'none'
  const fbInApp =
    navigator.userAgent.includes('FBAN') || navigator.userAgent.includes('FBAV') ? 'yes' : 'no'
  const goal = getUtm('goal') || 'none'
  //pageType, fpv, Goal, utm_campaign, utm_medium, utm_source, site, fb in app
  return {
    pageType: capitalize(pageTypeValue),
    value: `${fpv}|${goal}|${utmCampaignValue}|${utmMediumValue}|${utmSourceValue}|${site}|${fbInApp}`,
  }
}
