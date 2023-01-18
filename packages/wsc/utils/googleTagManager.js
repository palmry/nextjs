import dateformat from 'dateformat'
import { abgroupTargeting } from '../adTargeting'
import { fbasid } from './utmValues'
import { prop30 } from './prop30'
import get from 'lodash/get'
import { getConfig } from '../globalConfig'
import { getPostSponsor } from './common'

const appConfig = getConfig('AppConfig')
// window.dataLayer = window.dataLayer || []
let prop30Value = {}

export const setPostDimensions = (post = null) => {
  const relatedCategories =
    (post?.relatedCategoriesCollection &&
      post.relatedCategoriesCollection.items.map((cat) => cat.slug)) ||
    []
  const sponsor = (post && getPostSponsor(post)) || {}
  // send data to GTM data layer
  window.dataLayer.push({
    authorName: post?.authorsCollection
      ? post.authorsCollection.items.map((author) => author.name).join(',')
      : 'none',
    publishDate: post?.publishDate
      ? dateformat(post.publishDate, `mm/dd/yy HH:MM:ss`, true)
      : 'none',
    tags: post ? (post.tags ? post.tags.join() : undefined) : 'none',
    sponsorCode: get(sponsor, 'name', 'none'),
    contentType: post ? post.postType : 'none',
    title: post ? post.title : 'none',
    category: post ? get(post, 'mainCategory.slug') : 'none',
    subcategory:
      relatedCategories.length > 0 ? relatedCategories.join(',') : 'none',
    abgroup: abgroupTargeting({ delimiter: '|' }) || 'none',
    postId: post?.sys ? post.sys.id : 'none',
    fbasid: fbasid || 'none',
    intentionTag: post?.intentionTag ? post.intentionTag : 'none',
  })
}

export const setProp30 = (options) => {
  prop30Value = prop30({ ...options, site: appConfig.prop30SiteName })
  if (prop30Value) window.dataLayer.push({ prop30: prop30Value })
}

export const getProp30 = () => {
  return prop30Value
}

export const parentalStatusVariable = (parentalStatus) => {
  const MAPPING_LIST = [
    {
      dlv: 'PS_tryingToConceive',
      value: 'Trying to Conceive',
    },
    { dlv: 'PS_pregnant', value: 'Pregnant' },
    { dlv: 'PS_childUnder2', value: 'Child Under 2' },
    { dlv: 'PS_preschool3to5', value: 'Preschool (3-5)' },
    { dlv: 'PS_bigKid6to9', value: 'Big Kid (6-9)' },
    { dlv: 'PS_tween10to12', value: 'Tween (10-12)' },
    { dlv: 'PS_teen13to17', value: 'Teen (13-17)' },
    { dlv: 'PS_noneOfTheAbove', value: 'None of the Above' },
  ]
  let result = []

  MAPPING_LIST.forEach(({ dlv, value }) => {
    if (parentalStatus.includes(value)) result[dlv] = '1'
  })

  return result
}

export const sendGaEvent = ({ eventName, ...args }) => {
  window.dataLayer.push({
    pageviewURL: window.location.href,
    event: eventName,
    ...args,
  })
}
