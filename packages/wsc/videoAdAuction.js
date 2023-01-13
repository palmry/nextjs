import PrebidConfig from './components/AdProvider/PrebidConfig'
import { getConfig } from './globalConfig'
import get from 'lodash/get'

const videoBidderConfig = (config = []) => {
  const videoConfig = config.map(bidder => {
    bidder.params.video = {
      api: [2],
      mimes: ['video/mp4', 'video/webm', 'application/javascript'],
      minduration: 0,
      maxduration: 30,
      protocols: [2, 3, 5, 6],
      linearity: 1,
      playbackmethod: [3],
      startdelay: 0,
    }
    return bidder
  })
  return videoConfig
}

const executeAmazonVideoAuction = adUnit => {
  const adConfig = getConfig('AdConfig')
  if (!adConfig.globalAmazon || !adConfig.globalAmazon.enabled || !window.apstag) return

  window.apstag.fetchBids(
    {
      slots: [
        {
          slotID: adUnit.code,
          mediaType: 'video',
        },
      ],
      timeout: adConfig.globalAmazon.timeout,
    },
    bids => {
      adUnit.amazonBids = bids.length && bids[0].qsParams ? bids[0].qsParams : null
    }
  )
}

//constructs prebid video adUnit
export const videoAdUnit = (au3, code, deviceType) => {
  const adConfig = getConfig('AdConfig')
  const sizes = get(adConfig.slots, `${au3}.sizes.${deviceType}`) || null
  const adUnitPath = `${adConfig.dfpKey}/${adConfig.au1}/${adConfig.au2}/${au3}/${adConfig.au4}/${adConfig.au5}`
  const bidderConfig = PrebidConfig.getBidderConfigs(deviceType, au3, sizes, adUnitPath)

  if (!bidderConfig.length) return null

  return {
    code: code,
    mediaTypes: {
      video: {
        playerSize: [[400, 300]],
        mimes: ['video/mp4', 'video/webm', 'application/javascript'],
        context: 'instream',
      },
    },
    bids: videoBidderConfig(bidderConfig),
  }
}

export const executeVideoAuction = (adUnit, refresh = false) => {
  executeAmazonVideoAuction(adUnit)
  window.pbjs.que.push(() => {
    if (!refresh) window.pbjs.addAdUnits([adUnit])
    const adUnitCode = adUnit.code

    window.pbjs.requestBids({
      adUnitCodes: [adUnitCode],
    })
  })
}
