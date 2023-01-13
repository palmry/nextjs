import googletag from './googletag'

export default config => {
  const { slots, ids, globalConfig } = config
  let timeout
  const requestManager = {
    adserverRequestSent: false,
    amazonDone: !(globalConfig.globalAmazon && globalConfig.globalAmazon.enabled),
    prebidDone: false,
  }

  // sends adserver request
  const sendAdserverRequest = () => {
    if (requestManager.adserverRequestSent) {
      return
    }
    clearTimeout(timeout)
    requestManager.adserverRequestSent = true
    googletag.cmd.push(() => {
      googletag.pubads().refresh(slots)
    })
  }

  const bidderBack = () => {
    if (requestManager.amazonDone && requestManager.prebidDone) {
      sendAdserverRequest()
    }
  }

  const requestAmazonBids = () => {
    const amazonSlots = slots
      .map(slot => {
        const au3 = slot.getTargeting('au3')
        return {
          slotName: slot.getAdUnitPath(),
          slotID: slot.getSlotElementId(),
          sizes: slot.getSizes().map(size => {
            return [size.getWidth(), size.getHeight()]
          }),
          excludeAmazonBids: !!globalConfig.slots[au3]['excludeAmazonBids'],
        }
      })
      .filter(slot => !slot.excludeAmazonBids)

    if (!amazonSlots.length) return

    window.apstag.fetchBids(
      {
        slots: amazonSlots,
        timeout: globalConfig.globalAmazon.timeout,
      },
      bids => {
        googletag.cmd.push(() => {
          window.apstag.setDisplayBids()
          requestManager.amazonDone = true // signals that APS request has completed
          bidderBack() // checks whether both APS and Prebid have returned
        })
      }
    )
  }

  const requestPrebidBids = () => {
    window.googletag.cmd.push(() => {
      window.pbjs.que.push(() => {
        window.pbjs.requestBids({
          adUnitCodes: ids,
          bidsBackHandler() {
            window.pbjs.setTargetingForGPTAsync(ids)
            requestManager.prebidDone = true
            bidderBack()
          },
        })
      })
    })
  }

  requestPrebidBids()

  if (globalConfig.globalAmazon && globalConfig.globalAmazon.enabled) {
    requestAmazonBids()
  }

  // set failsafe timeout
  timeout = window.setTimeout(() => {
    sendAdserverRequest()
  }, globalConfig.failsafeTimeout || 3000)
}
