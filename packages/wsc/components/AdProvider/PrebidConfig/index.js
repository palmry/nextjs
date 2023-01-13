/* eslint-disable class-methods-use-this */

// eslint-disable-next-line import/no-extraneous-dependencies
import prebidConfigData from 'prebid-config-data'
import BaseBidder from './BidderConfig/BaseBidder'
import IxBidder from './BidderConfig/IxBidder'

const defaultBidders = [IxBidder]

class PrebidConfig {
  constructor() {
    this.reset()
  }

  reset() {
    this.bidderClasses = defaultBidders.concat()
  }

  addBidderClass(bidderClass) {
    this.bidderClasses.unshift(bidderClass)
  }

  getBidderObject(bidderConfig) {
    let bidderObj = null

    this.bidderClasses.some(Cls => {
      const match = Cls.bidderNames().filter(b => b === bidderConfig.bidder)
      if (match.length > 0) {
        bidderObj = new Cls(bidderConfig)
        return true
      }
      return false
    })

    if (bidderObj === null) {
      bidderObj = new BaseBidder(bidderConfig)
    }
    return bidderObj
  }

  getBidderConfigs(platform, au3, sizes, adUnitPath) {
    let bidders = []
    prebidConfigData.forEach(bidderConfig => {
      const bidder = this.getBidderObject(bidderConfig)
      const configs = bidder.getConfigs(platform, au3, sizes, adUnitPath)
      bidders = bidders.concat(configs)
    })
    return bidders
  }

  getPrebidConfigData() {
    return prebidConfigData
  }
}

export default new PrebidConfig()
