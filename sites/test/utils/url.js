import get from 'lodash/get'

import { incrementFpv, getFpv } from 'wsc/utils/fpv'
import { setProp30 } from 'wsc/utils/googleTagManager'
import { SetPageviewCountGlobal } from '../components/SubscribePopup'

// Changes the URL in the browser without reloading the page
const seenUrls = []

export const isSeenUrl = url => seenUrls.includes(url)
export const markUrlAsSeen = url => seenUrls.push(url)
export const clearSeenUrls = () => (seenUrls.length = 0)

let lastSeenUrlBeforeChange = ''
export const getLastSeenUrlBeforeChange = () => lastSeenUrlBeforeChange

// parses the current url to return the base URL of the post (without slide slug)
export const getPostBaseUrl = () => {
  return urlWithoutTrailingSlash(
    window.location.href
      .split('/')
      .slice(0, 5)
      .join('/')
  ).split('?')[0] // remove query string
}

export const changeBrowserUrl = (url, title = null) => {
  // Save last seen url before change
  lastSeenUrlBeforeChange = window.location.href

  if (window.location.href === url) return

  window.history.replaceState({}, title || window.document.title, url)
  if (title) window.document.title = title
  incrementFpv()
  SetPageviewCountGlobal(getFpv())
  setProp30({ path: window.location.pathname })
  if (!isSeenUrl(url)) {
    markUrlAsSeen(url)
  }
}

export function hasTrailingSlash(url) {
  return url.charAt(url.length - 1) === '/'
}

export function urlWithoutTrailingSlash(url) {
  if (hasTrailingSlash(url)) {
    return url.substring(0, url.length - 1)
  }

  return url
}
/**
 * Generates the URL for the post using data from the post
 * @param {*} post
 */

export const getPostUrl = post => {
  return `${
    urlWithoutTrailingSlash(
      window.location.href
        .split('/')
        .slice(0, 3)
        .join('/')
    ).split('?')[0]
  }/${get(post, 'mainCategory.slug')}/${post.slug}`
}
