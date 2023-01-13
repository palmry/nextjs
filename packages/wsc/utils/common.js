import dateformat from 'dateformat'
import get from 'lodash/get'

import { getConfig } from '../globalConfig'

const { DEVICE_MINWIDTH, FOOTER_HEIGHT } = getConfig('StyleConfig')

/**
 * get post date title
 * @param {*} publishedDate - required
 * @param {*} updatedDate
 * @returns {string}
 */
export function getPostDateTitle(publishedDate, updatedDate) {
  if (!publishedDate) return ''

  const updatedAtTitle = dateformat(new Date(updatedDate || publishedDate), `mmm d, yyyy`)
  return `${updatedDate ? 'Updated  ' : 'Published '} ${updatedAtTitle}`
}

export const getPostRelatedCategories = post => {
  const CATEGORY_CONFIGS = getConfig('Category').en
  const relatedCategoriesCollection = get(post, 'relatedCategoriesCollection.items', [])
  return relatedCategoriesCollection.map(subCategory => {
    return CATEGORY_CONFIGS[subCategory.slug] ? CATEGORY_CONFIGS[subCategory.slug].title : ''
  })
}

/**
 * specify whether current screen width is desktop size or not
 * @returns {boolean}
 */
export function isDesktop() {
  return window.innerWidth >= DEVICE_MINWIDTH.DESKTOP
}

/**
 * specify whether current screen width is tablet size or not
 * @returns {boolean}
 */
export function isTablet() {
  return window.innerWidth >= DEVICE_MINWIDTH.MOBILE && window.innerWidth < DEVICE_MINWIDTH.DESKTOP
}

/**
 * get height of footer according to input device
 * device can be "mobile", "tablet", "desktop"
 * @returns {number}
 */
export function getFooterHeight() {
  return isDesktop()
    ? FOOTER_HEIGHT.DESKTOP
    : isTablet()
    ? FOOTER_HEIGHT.TABLET
    : FOOTER_HEIGHT.MOBILE
}

/**
 * get whether the page has been scrolled to the bottom-page
 * @param {number} [offsetBottom=0] - distance from bottom, default is 0
 * @returns {boolean}
 */
export function isBottomPage(offsetBottom = 0) {
  // Height of the whole document regardless to browser/device
  // read more on: https://javascript.info/size-and-scroll-window
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  )

  return (
    document.documentElement.clientHeight + window.pageYOffset >=
    scrollHeight - Number(offsetBottom)
  )
}

/**
 * Pause process
 * @param {number} [timeout=0] - How long does it sleep.
 * @returns {Object} - A Promise that can be waited by await syntax.
 */
export function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export function contentfulApiCurrentDateTime() {
  let dateTime = new Date()
  dateTime.setSeconds(0, 0)
  return dateTime.toISOString()
}

export function getDocumentHeadKey(locale, slug) {
  // This is tricky to force component to reset its state.
  // So, the GA pageview will be sent correctly when the user travels from category page to category page.
  // Ref: https://medium.com/@albertogasparin/forcing-state-reset-on-a-react-component-by-using-the-key-prop-14b36cd7448e
  return `head-${locale}-${slug}`
}

export function isMultiLanguageSite(siteConfig) {
  return Object.keys(get(siteConfig, 'locales', {})).length > 1
}

export function getPostSponsor(post) {
  let sponsor = null
  if (post.sponsor) {
    sponsor = post.sponsor
  } else if (get(post, 'multipleSeriesCollection.items[0].sponsor', null)) {
    sponsor = get(post, 'multipleSeriesCollection.items[0].sponsor')
  }

  // if sponsor is not set then try to check sponsor from category
  if (!sponsor) {
    // check sponsor from list of related categories
    const relatedCategories = get(post, 'relatedCategoriesCollection.items', [])
    for (const category of relatedCategories) {
      if (category.sponsor) {
        sponsor = category.sponsor
        break
      }
    }
    // if sponsor is still not set then check sponsor from main category
    if (sponsor == null && get(post, 'mainCategory.sponsor', null)) {
      sponsor = get(post, 'mainCategory.sponsor')
    }
  }

  return sponsor
}

export function isShowDisplayAdsForRhombus(post) {
  if (post.sponsor || get(post, 'multipleSeriesCollection.items[0].sponsor', null)) {
    return false
  }

  // if sponsor is not set from post and series then try to check sponsor from category
  // check showDisplayAds from sponsor of related categories
  const relatedCategories = get(post, 'relatedCategoriesCollection.items', [])
  for (const category of relatedCategories) {
    if (category.sponsor) {
      return get(category.sponsor, 'showDisplayAds') === false ? false : true
    }
  }
  // if sponsor is still not set then check showDisplayAds from sponsor of main category
  if (get(post, 'mainCategory.sponsor', null)) {
    const mainCategorySponsor = get(post, 'mainCategory.sponsor', null)
    return get(mainCategorySponsor, 'showDisplayAds') === false ? false : true
  }
  return true
}
