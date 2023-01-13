import has from 'lodash/has'
import get from 'lodash/get'
import { sleep } from 'wsc/utils/common'

const oneTrustCookieName = 'OptanonConsent'
const cookieConsentGroupName = 'C0002'

// return value of specific cookie name or undefined
function getCookie(cookieName) {
  let name = cookieName + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let cookieArray = decodedCookie.split(';')
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1)
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }
  return undefined
}

// find all active group from OneTrust cookie
// return true if specific groupName is one of all active group
function isActiveGroup(groupName) {
  const consentDataStr = getCookie(oneTrustCookieName)
  if (!consentDataStr) return false

  const consentDataObj = consentDataStr.split('&').reduce((consentDataObj, data) => {
    consentDataObj[data.split('=')[0]] = data
      .split('=')
      .slice(1)
      .join('=')
    return consentDataObj
  }, {})

  const allGroupString = consentDataObj.groups
  if (!allGroupString) return false

  const activeGroup = allGroupString.split(',').reduce((activeGroup, data) => {
    const [groupName, status] = data.split(':')
    if (status === '1') activeGroup.push(groupName)
    return activeGroup
  }, [])

  if (activeGroup.indexOf(groupName) < 0) return false

  return true
}

// check user is accept cookie consent or not
function isUserAcceptCookieConsent() {
  return isActiveGroup(cookieConsentGroupName)
}

const oneTrustUserConsent = {
  isAccepted: isUserAcceptCookieConsent,
  registerListener: async listenerFunction => {
    // make sure OneTrust is loaded
    const maxWaitAttempt = 50
    let waitAttempt = 0
    while (!has(window, 'OneTrust.OnConsentChanged') && waitAttempt < maxWaitAttempt) {
      await sleep(100)
      waitAttempt = waitAttempt + 1
    }

    // register OneTrust.OnConsentChanged with listenerFunction
    if (has(window, 'OneTrust.OnConsentChanged')) {
      window.OneTrust.OnConsentChanged(listenerFunction)
    }
  },
}

// update OneTrust banner such as add/remove class, change position
async function updateOneTrustBanner(isHideMenuBar, isShowPreviewSiteBar) {
  while (!get(window, 'OneTrust.isModalDisplayed', false)) {
    await sleep(100)
  }
  const oneTrustBanner = document.querySelector('#onetrust-banner-sdk')
  const removeAllTranslateClass = oneTrustBannerNode => {
    oneTrustBannerNode.classList.remove('translateWithNavAndPreviewBarOn')
    oneTrustBannerNode.classList.remove('translateWithNavBarOn')
    oneTrustBannerNode.classList.remove('translateWithPreviewSiteBarOn')
    oneTrustBannerNode.classList.remove('translateWithNoBarOn')
  }
  if (oneTrustBanner) {
    removeAllTranslateClass(oneTrustBanner)
    if (!isHideMenuBar && isShowPreviewSiteBar) {
      oneTrustBanner.classList.add('translateWithNavAndPreviewBarOn')
    } else if (!isHideMenuBar) {
      oneTrustBanner.classList.add('translateWithNavBarOn')
    } else if (isShowPreviewSiteBar) {
      oneTrustBanner.classList.add('translateWithPreviewSiteBarOn')
    } else {
      oneTrustBanner.classList.add('translateWithNoBarOn')
    }
  }
}

export { oneTrustUserConsent, updateOneTrustBanner }
