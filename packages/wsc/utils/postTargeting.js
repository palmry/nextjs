import { KeywordBlocking } from 'wildsky-components'
import get from 'lodash/get'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import { getPostSponsor } from 'wsc/utils/common'
import { getConfig } from '../globalConfig'
const appConfig = getConfig('AppConfig')

function getReferrer() {
  const sessionStorageValue = window.sessionStorage.getItem('referrer')

  if (sessionStorageValue) return sessionStorageValue

  const referrer = document.referrer.includes(appConfig.url) ? null : document.referrer
  window.sessionStorage.setItem('referrer', referrer)

  return referrer
}

export const getPostTargeting = post => {
  const sponsor = getPostSponsor(post)
  const sponsoredBy = sponsor && sponsor.name ? sponsor.name : ''

  const slotTargeting = {
    category: flatten([
      get(post, 'mainCategory.slug'),
      map(post.relatedCategoriesCollection.items, 'slug'),
    ]),
    sens: post.safeForAdvertiser === null || post.safeForAdvertiser ? '0' : '1',
    content_source: process.env.REACT_APP_DEFAULT_CONTENT_SOURCE,
    au2: post.postType,
    au4: get(post, 'mainCategory.slug'),
    key_word_list: KeywordBlocking.getBlockedLists(window.location.href.replace(/-|_/g, ' ')),
    postid: get(post, 'sys.id'),
    referrer: getReferrer(),
    sponsored: sponsoredBy,
    tags: post.tags ? post.tags : [],
  }

  return slotTargeting
}

export const getBabyNameTargeting = data => {
  let slotTargeting = {
    category: data?.category || null,
    key_word_list: KeywordBlocking.getBlockedLists(window.location.href),
    postid: data?.id || null,
    referrer: getReferrer(),
  }
  return slotTargeting
}
