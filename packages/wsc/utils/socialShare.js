import { redirect, getWindowOption } from './redirect'
import { getConfig } from '../globalConfig'

const APP_CONFIGS = getConfig('AppConfig')
const { DEVICE_MINWIDTH } = getConfig('StyleConfig')

/**
 * share url to facebook with given url
 * @param {string} [url = window.location.href]
 * @returns {*}
 */
export function facebookShare(url = window.location.href) {
  if (!window.open || !url) {
    console.error('CANNOT_SHARE_URL_TO_FACEBOOK')
    return null
  }

  return redirect(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    getWindowOption()
  )
}

/**
 * send url to facebook messenger with given url
 * @param {string} [url = window.location.href]
 * @returns {*}
 */
export function facebookSend(url = window.location.href) {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera
  let isAndroid = /android/i.test(userAgent)
  let isiOS =
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPad with iOS13 up

  // when user use iOS or Android and screen width of their device
  // is less than minimum size for desktop. we presume that they using
  // portable device and already install FB Messenger app on their device.
  if (window.innerWidth < DEVICE_MINWIDTH.DESKTOP && (isAndroid || isiOS)) {
    // launch FB Messenger app with target url
    window.location = `fb-messenger://share?link=${encodeURIComponent(url)}`
  } else {
    // open Facebook Send Dialog (NOT available on portable device)
    // with target url when user browsing on desktop
    if (!window.open || !url) {
      console.error('CANNOT_SEND_URL_TO_FACEBOOK_MESSENGER')
      return null
    }

    let facebookAppId = APP_CONFIGS.facebookAppId
    if (!facebookAppId) {
      console.error('facebookAppId is required for using Facebook Send Dialog')
      return null
    }

    return redirect(
      `https://www.facebook.com/dialog/send?app_id=${facebookAppId}` +
        `&display=popup&link=${encodeURIComponent(url)}` +
        `&redirect_uri=${encodeURIComponent('https://www.facebook.com/dialog/close_window/')}`,
      getWindowOption()
    )
  }
}

/**
 * share url using web share api / native share dialog
 * @param {Object} option - Default value {title: document.title, url: window.location.href}
 * @param {string} option.title - The title of share dialog.
 * @param {string} option.url - The URL to share.
 * @returns {*}
 */
export function webShareAPI(option) {
  if (!navigator.share) {
    console.error('CANNOT_USE_WEB_SHARE_API_DUE_TO_BROWSER_NOT_SUPPORT')
    return null
  }

  let shareOption = {
    title: document.title,
    url: window.location.href,
    ...option,
  }

  navigator
    .share(shareOption)
    .then(() => {
      console.log('CALL_WEB_SHARE_API_SUCCESS')
    })
    .catch(console.error)
}
