import has from 'lodash/has'
import { sleep } from 'wsc/utils/common'
// import { oneTrustUserConsent } from './oneTrustLib'

function getClientId() {
  return process.env.REACT_APP_LOTAME_CLIENT_ID
}

function getInstanceName() {
  return `lotame_${getClientId()}`
}

// Not ready to use. See link below for more info.
// https://jira.yk.wildskymedia.com/browse/OR-424?focusedCommentId=145473&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-145473
export async function initialize() {
  // // user must accept cookie consent before initialize lotame
  // if (!oneTrustUserConsent.isAccepted()) {
  //   return
  // }

  // if lotame is already loaded, no need to initialize again
  if (has(window, getInstanceName())) {
    return
  }

  // Lotame initialization.
  let lotameConfig = {
    clientId: Number(getClientId()),
  }
  let namespace = (window[getInstanceName()] = {})
  namespace.config = lotameConfig
  namespace.cmd = namespace.cmd || []

  // Lotame recommends loading the Lightning Tag directly on your page.
  // NOT recommends loading through a tag manager such as Google Tag Manager (GTM).
  const lotameLightningTag = document.createElement('script')
  lotameLightningTag.setAttribute(
    'src',
    `https://tags.crwdcntrl.net/lt/c/${getClientId()}/lt.min.js`
  )
  document.head.insertBefore(lotameLightningTag, document.head.childNodes[0])
}

export async function getInstance() {
  const instanceName = getInstanceName()
  // Wait the tag is loaded
  while (!has(window, instanceName)) {
    await sleep(100)
  }
  return window[instanceName]
}

export async function sendPageview() {
  // // user must accept cookie consent before send pageview
  // if (!oneTrustUserConsent.isAccepted()) {
  //   console.log('enter sendPageview but reject')
  //   return
  // }

  const location = window.location
  const interestData = [location.hostname]
  if (location.pathname !== '/') {
    interestData.push('Site Section')
    // We only include the category slug following the Lotame recommendation at ML-182.
    const pathNames = location.pathname.split('/')
    // Fetch the second name if the page is configured by the entry of Content Index Page model.
    const sectionName =
      location.pathname.match(/^\/p\//g) !== null ? pathNames.slice(2, 3) : pathNames.slice(1, 2)

    interestData.push(sectionName)
  }
  // Send pageview
  const lotame = await getInstance()
  lotame.cmd.push(function() {
    lotame.page({
      behaviors: {
        int: [interestData.join(' : ')],
      },
    })
  })
}
