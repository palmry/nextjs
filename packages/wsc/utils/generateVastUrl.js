import { getConfig } from '../globalConfig'

const targetingToString = targeting => {
  return encodeURIComponent(
    Object.entries(targeting)
      .map(([key, val]) => `${key}=${val}`)
      .join('&')
  )
}

export const generateVastUrl = (
  deviceType,
  customTargeting = {},
  adUnit = null,
  videoType = 'video'
) => {
  const adConfig = getConfig('AdConfig')
  const adUnitPath = `/${adConfig.dfpKey}/${adConfig.au1}/${adConfig.au2}/${videoType}/${adConfig.au4}/${adConfig.au5}`
  const customTargetingCopy = { ...customTargeting }
  customTargetingCopy['category'] = customTargetingCopy['category']
    ? customTargetingCopy['category'].join()
    : ''

  const targeting = {
    ...adConfig['globalTargeting'],
    ...customTargetingCopy,
  }

  if (adUnit && window.pbjs && window.pbjs.adServers) {
    const amazonTargeting = adUnit.amazonBid || {}

    return window.pbjs.adServers.dfp.buildVideoUrl({
      adUnit: adUnit,
      params: {
        iu: adUnitPath,
        output: 'xml_vast4',
        cust_params: { ...targeting, ...amazonTargeting },
      },
    })
  } else {
    return `https://pubads.g.doubleclick.net/gampad/ads?sz=400x300&iu=${adUnitPath}&gdfp_req=1&env=vp&output=xml_vast4&unviewed_position_start=1&url=${
      window.location.href
    }&cust_params=${targetingToString(targeting)}`
  }
}
