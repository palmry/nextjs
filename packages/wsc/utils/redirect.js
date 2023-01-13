import marked from 'marked'
import { isDesktop } from './common'

/**
 * @returns {string} windowFeatures to be used in window.open()
 */
export function getWindowOption() {
  return isDesktop() ? `width=600,height=600,noopener` : 'noopener'
}

/**
 * @param {string} string
 * @returns encoded string including escaped/reserved characters
 */
export function getStringentEncodeURIComponent(string) {
  return encodeURIComponent(string).replace(/[;,/?:@&=+$!'()*]/g, char => {
    return '%' + char.charCodeAt(0).toString(16)
  })
}

/**
 * return overriden renderer method for markdown link
 */
export const markedLink = function(href, title, text) {
  var link = marked.Renderer.prototype.link.call(this, href, title, text)
  return link.replace('<a', "<a target='_blank' rel='noopener' ")
}

/**
 * redirect to given url
 * @param {string} url
 * @param {string} [options] options to be used in 'window.open'
 * @returns {void | null}
 */
export function redirect(url, options = 'noopener') {
  if (!window.open || !url) {
    console.error(`CANNOT_REDIRECT_TO : ${url}`)
    return null
  }
  window.open(url, '_blank', options)
}

export default redirect
